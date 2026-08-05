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
