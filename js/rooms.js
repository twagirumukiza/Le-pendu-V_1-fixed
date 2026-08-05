// ============================================================
// LE PENDU — Multijoueur (Firebase Realtime Database)
// Mode A : "Manche collective"  -> tour par tour + buzz mot possible à tout moment
// Mode B : "Mot secret"         -> un hôte choisit le mot, les autres devinent
// ============================================================

const { normalize: normalizeWord, MAX_ERRORS: MAX_ERR } = window.PenduUtils;

function genRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

class PenduMultiplayer {

  constructor() {
    this.db = window.PenduFirebase.db();
    this.auth = window.PenduFirebase.auth();

    this.uid = null;
    this.roomCode = null;
    this.roomRef = null;
    this.unsub = null;
  }

  async ensureAuth() {

    if (this.uid)
      return this.uid;

    const cred = await this.auth.signInAnonymously();

    this.uid = cred.user.uid;

    return this.uid;
  }

  async createRoom({
    mode,
    theme,
    difficulte,
    hostName,
    secretWord
  }) {

    await this.ensureAuth();

    const code = genRoomCode();

    const roomRef = this.db.ref(`pendu_rooms/${code}`);

    let word;

    if (mode === "A") {

      word = window.PenduWordBank
        .pickWord({
          theme,
          difficulte
        }).mot;

    } else {

      word = normalizeWord(secretWord);

    }

    await roomRef.set({

      meta: {

        mode,

        theme: theme || "Tous",

        difficulte: difficulte || "Tous",

        status: "lobby",

        maxErrors: MAX_ERR,

        createdAt:
          firebase.database.ServerValue.TIMESTAMP,

        hostUid: this.uid

      },

      word: {

        value: word,

        length: word.length

      },

      guessedLetters: {},

      errors: 0,

      turnOrder: [],

      currentTurnIndex: 0,

      winnerUid: null,

      players: {

        [this.uid]: {

          name: hostName,

          isHost: true,

          order: 0,

          connected: true,

          joinedAt:
            firebase.database.ServerValue.TIMESTAMP

        }

      }

    });

    this._attachPresence(code, this.uid);

    return code;
  }

    async joinRoom(code, name) {

    await this.ensureAuth();

    code = code.toUpperCase().trim();

    const roomRef = this.db.ref(`pendu_rooms/${code}`);

    const snap = await roomRef.get();

    if (!snap.exists())
      throw new Error("Salon introuvable. Vérifie le code.");

    const room = snap.val();

    if (room.meta.status !== "lobby")
      throw new Error("La partie a déjà commencé.");

    const playersSnap = await roomRef.child("players").get();

    const players = playersSnap.val() || {};

    const order = Object.keys(players).length;

    await roomRef.child(`players/${this.uid}`).set({

      name,

      isHost: false,

      order,

      connected: true,

      joinedAt:
        firebase.database.ServerValue.TIMESTAMP

    });

    this._attachPresence(code, this.uid);

    return code;

  }

  _attachPresence(code, uid) {

    const connRef =
      this.db.ref(
        `pendu_rooms/${code}/players/${uid}/connected`
      );

    connRef.onDisconnect().set(false);

    this.roomCode = code;

    this.roomRef =
      this.db.ref(`pendu_rooms/${code}`);

  }

  listen(callback) {

    if (!this.roomRef)
      return;

    this.unsub =
      this.roomRef.on("value", snap => {

        callback(snap.val());

      });

  }

  stopListening() {

    if (this.roomRef && this.unsub)
      this.roomRef.off("value", this.unsub);

  }

  async startGame() {

    const playersSnap =
      await this.roomRef.child("players").get();

    const players =
      playersSnap.val() || {};

    const metaSnap =
      await this.roomRef.child("meta").get();

    const meta =
      metaSnap.val();

    let eligible =
      Object.entries(players);

    if (meta.mode === "B") {

      // l'hôte ne joue pas
      eligible =
        eligible.filter(
          ([uid, p]) => !p.isHost
        );

    }

    eligible.sort(
      (a, b) =>
        a[1].order - b[1].order
    );

    const turnOrder =
      eligible.map(([uid]) => uid);

    await this.roomRef.update({

      turnOrder,

      currentTurnIndex: 0,

      "meta/status": "jeu"

    });

  }

    // Un joueur propose une lettre (uniquement si c'est son tour)
  async submitLetter(letter) {

    letter = normalizeWord(letter);

    const snap = await this.roomRef.get();
    const room = snap.val();

    if (!room || room.meta.status !== "jeu")
      return;

    const activeUid =
      room.turnOrder[room.currentTurnIndex];

    if (activeUid !== this.uid)
      throw new Error("Ce n'est pas ton tour.");

    if (room.guessedLetters &&
        room.guessedLetters[letter])
      return;

    const word = room.word.value;

    const correct = word.includes(letter);

    const updates = {};

    updates[`guessedLetters/${letter}`] =
      correct ? "correct" : "wrong";

    let errors = room.errors || 0;

    if (!correct)
      errors++;

    const guessed = {};

    // On convertit les anciennes lettres en booléens
    Object.keys(room.guessedLetters || {}).forEach(l => {
      guessed[l] = true;
    });

    guessed[letter] = true;

    const isComplete =
      word.split("").every(l => guessed[l]);

    let status = room.meta.status;

    let winnerUid = room.winnerUid ?? null;

    if (isComplete) {

      status = "fini";

      winnerUid = this.uid;

    }
    else if (errors >= room.meta.maxErrors) {

      status = "fini";

      winnerUid =
        room.meta.mode === "B"
          ? room.meta.hostUid
          : null;

    }
    else {

      updates.currentTurnIndex =
        (room.currentTurnIndex + 1) %
        room.turnOrder.length;

    }

    updates.errors = errors;
    updates["meta/status"] = status;
    updates.winnerUid = winnerUid ?? null;

    // Sécurité Firebase :
    // aucune valeur undefined ne doit être envoyée.
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        updates[key] = null;
      }
    });

    await this.roomRef.update(updates);

    await this.roomRef.child("log").push({

      type: "lettre",

      uid: this.uid,

      value: letter,

      correct,

      ts: firebase.database.ServerValue.TIMESTAMP

    });

  }
  // N'importe quel joueur peut tenter le mot complet
  async submitWordGuess(attempt) {

    const snap = await this.roomRef.get();
    const room = snap.val();

    if (!room || room.meta.status !== "jeu")
      return;

    if (
      room.meta.mode === "B" &&
      this.uid === room.meta.hostUid
    ) {
      throw new Error("L'hôte ne devine pas son propre mot.");
    }

    const correct =
      normalizeWord(attempt) === room.word.value;

    const updates = {};

    if (correct) {

      // Toutes les lettres deviennent découvertes
      const guessedLetters = {};

      room.word.value
        .split("")
        .forEach(letter => {
          guessedLetters[letter] = "correct";
        });

      updates.guessedLetters = guessedLetters;
      updates["meta/status"] = "fini";
      updates.winnerUid = this.uid;

    } else {

      const errors = (room.errors || 0) + 1;

      updates.errors = errors;

      if (errors >= room.meta.maxErrors) {

        updates["meta/status"] = "fini";

        updates.winnerUid =
          room.meta.mode === "B"
            ? room.meta.hostUid
            : null;

      }

    }

    // Sécurité Firebase :
    // aucune valeur undefined n'est envoyée
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        updates[key] = null;
      }
    });

    await this.roomRef.update(updates);

    await this.roomRef.child("log").push({

      type: "mot",

      uid: this.uid,

      value: normalizeWord(attempt),

      correct,

      ts: firebase.database.ServerValue.TIMESTAMP

    });

  }

  async leaveRoom() {

    if (this.roomRef && this.uid) {

      await this.roomRef
        .child(`players/${this.uid}/connected`)
        .set(false);

    }

    this.stopListening();

    this.roomRef = null;
    this.roomCode = null;

  }

}

window.PenduMultiplayer = PenduMultiplayer;
  
