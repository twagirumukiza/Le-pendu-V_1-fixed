// ============================================================
// LE PENDU — Banque de mots
// Mots sans accents (clavier 26 lettres). Difficulté dérivée
// de la longueur : facile <=6, moyen 7-9, difficile >=10.
// Chaque mot a une courte définition affichée en fin de partie.
// ============================================================

const RAW_WORDS = {
  "Animaux": [
    ["CHAT", "Petit félin domestique aux griffes rétractiles."],
    ["CHIEN", "Mammifère domestique fidèle, souvent gardien ou compagnon."],
    ["LION", "Grand félin d'Afrique, surnommé le roi des animaux."],
    ["TIGRE", "Grand félin rayé, le plus grand des chats sauvages."],
    ["ELEPHANT", "Plus gros mammifère terrestre, doté d'une trompe."],
    ["GIRAFE", "Mammifère africain au très long cou."],
    ["ZEBRE", "Équidé africain rayé de noir et blanc."],
    ["SINGE", "Primate agile, souvent vivant dans les arbres."],
    ["OURS", "Grand mammifère plantigrade au pelage épais."],
    ["RENARD", "Petit canidé rusé à la queue touffue."],
    ["LOUP", "Canidé sauvage vivant en meute."],
    ["AIGLE", "Grand rapace aux serres puissantes."],
    ["HIBOU", "Rapace nocturne aux aigrettes de plumes."],
    ["DAUPHIN", "Mammifère marin intelligent et joueur."],
    ["BALEINE", "Plus grand mammifère marin du monde."],
    ["REQUIN", "Grand poisson cartilagineux, prédateur des océans."],
    ["TORTUE", "Reptile lent protégé par une carapace."],
    ["LEZARD", "Petit reptile à quatre pattes et longue queue."],
    ["PAPILLON", "Insecte aux ailes colorées, issu d'une chenille."],
    ["ABEILLE", "Insecte pollinisateur qui produit le miel."],
    ["KANGOUROU", "Marsupial australien qui se déplace par bonds."],
    ["HERISSON", "Petit mammifère couvert de piquants."],
    ["ECUREUIL", "Petit rongeur à la queue touffue, vit dans les arbres."],
    ["CROCODILE", "Grand reptile aquatique aux mâchoires puissantes."],
    ["FLAMANT", "Grand oiseau échassier au plumage rose."],
    ["PANTHERE", "Grand félin tacheté, souvent nocturne."],
    ["MANCHOT", "Oiseau marin des régions froides, incapable de voler."],
    ["CHOUETTE", "Rapace nocturne sans aigrettes."],
    ["SCORPION", "Arachnide venimeux muni d'un dard."]
  ],
  "Cuisine": [
    ["PAIN", "Aliment de base fait de farine, d'eau et de levure."],
    ["FROMAGE", "Produit laitier fermenté, souvent à base de lait de vache."],
    ["BEURRE", "Matière grasse obtenue en battant la crème."],
    ["POULET", "Volaille très consommée en cuisine."],
    ["TOMATE", "Fruit rouge utilisé comme légume en cuisine."],
    ["CAROTTE", "Légume racine orange, riche en vitamines."],
    ["POMME", "Fruit rond à pépins, souvent croquant."],
    ["BANANE", "Fruit tropical allongé et jaune à maturité."],
    ["CITRON", "Agrume acide utilisé pour assaisonner."],
    ["CHOCOLAT", "Confiserie à base de fèves de cacao."],
    ["GATEAU", "Pâtisserie sucrée cuite au four."],
    ["SOUPE", "Plat liquide chaud, souvent à base de légumes."],
    ["SALADE", "Plat froid de légumes ou de crudités."],
    ["OMELETTE", "Plat d'œufs battus cuits à la poêle."],
    ["RATATOUILLE", "Plat provençal de légumes mijotés."],
    ["CROISSANT", "Viennoiserie feuilletée en forme de croissant de lune."],
    ["BAGUETTE", "Pain long et fin typique de France."],
    ["QUICHE", "Tarte salée garnie d'œufs et de crème."],
    ["CREPE", "Fine galette de blé, sucrée ou salée."],
    ["MACARON", "Petit gâteau rond à base de meringue et d'amande."],
    ["RISOTTO", "Plat italien de riz crémeux mijoté."],
    ["LASAGNE", "Plat italien de pâtes en couches avec sauce."],
    ["MOUTARDE", "Condiment piquant à base de graines moulues."],
    ["VINAIGRE", "Liquide acide utilisé pour assaisonner."],
    ["CASSEROLE", "Ustensile de cuisine à manche pour cuire les aliments."],
    ["MARMITE", "Grand récipient pour cuire des plats mijotés."]
  ],
  "Geographie": [
    ["FRANCE", "Pays d'Europe de l'Ouest, capitale Paris."],
    ["PARIS", "Capitale de la France, ville lumière."],
    ["MONTAGNE", "Relief élevé de la Terre, souvent rocheux."],
    ["RIVIERE", "Cours d'eau qui se jette dans un fleuve."],
    ["OCEAN", "Vaste étendue d'eau salée entre les continents."],
    ["DESERT", "Région très sèche avec peu de végétation."],
    ["FORET", "Vaste étendue couverte d'arbres."],
    ["ILE", "Terre entourée d'eau de tous côtés."],
    ["VOLCAN", "Relief d'où peut jaillir de la lave."],
    ["CONTINENT", "Vaste étendue de terre, comme l'Afrique ou l'Asie."],
    ["AFRIQUE", "Continent au sud de l'Europe, berceau de l'humanité."],
    ["EUROPE", "Continent qui comprend la France, l'Allemagne, l'Italie..."],
    ["ASIE", "Plus grand continent du monde."],
    ["CANADA", "Pays d'Amérique du Nord, capitale Ottawa."],
    ["JAPON", "Pays insulaire d'Asie, capitale Tokyo."],
    ["BRESIL", "Plus grand pays d'Amérique du Sud."],
    ["EGYPTE", "Pays d'Afrique du Nord, célèbre pour ses pyramides."],
    ["ITALIE", "Pays d'Europe du Sud en forme de botte."],
    ["ESPAGNE", "Pays d'Europe du Sud, capitale Madrid."],
    ["ALLEMAGNE", "Pays d'Europe centrale, capitale Berlin."],
    ["SENEGAL", "Pays d'Afrique de l'Ouest, capitale Dakar."],
    ["RWANDA", "Pays d'Afrique de l'Est, surnommé le pays des mille collines."],
    ["FRONTIERE", "Limite qui sépare deux territoires."],
    ["CAPITALE", "Ville principale d'un pays, siège du gouvernement."],
    ["PENINSULE", "Terre entourée d'eau sauf sur un côté."]
  ],
  "Informatique & Cyber": [
    ["ORDINATEUR", "Machine électronique qui traite des données."],
    ["RESEAU", "Ensemble d'appareils connectés entre eux."],
    ["LOGICIEL", "Programme informatique installé sur un appareil."],
    ["CLAVIER", "Périphérique servant à taper du texte."],
    ["ECRAN", "Périphérique qui affiche les images d'un appareil."],
    ["SERVEUR", "Ordinateur qui fournit des ressources à d'autres machines."],
    ["PIRATE", "Personne qui s'introduit illégalement dans un système."],
    ["VIRUS", "Programme malveillant qui infecte un système."],
    ["PAREFEU", "Dispositif qui filtre le trafic réseau pour protéger un système."],
    ["CRYPTAGE", "Transformation d'une donnée pour la rendre illisible sans clé."],
    ["ALGORITHME", "Suite d'instructions pour résoudre un problème."],
    ["DONNEES", "Informations traitées ou stockées par un système."],
    ["NUAGE", "Infrastructure informatique accessible via Internet (cloud)."],
    ["ROBOT", "Machine capable d'exécuter des tâches automatiquement."],
    ["INTERNET", "Réseau mondial reliant des millions d'ordinateurs."],
    ["NAVIGATEUR", "Logiciel utilisé pour consulter des pages web."],
    ["FICHIER", "Ensemble de données enregistré sous un nom."],
    ["MEMOIRE", "Composant qui stocke temporairement ou durablement des données."],
    ["PROCESSEUR", "Composant qui exécute les instructions d'un ordinateur."],
    ["SAUVEGARDE", "Copie de sécurité de données."],
    ["AUTHENTIFICATION", "Vérification de l'identité d'un utilisateur."],
    ["VULNERABILITE", "Faille exploitable dans un système informatique."],
    ["HAMECONNAGE", "Technique frauduleuse pour voler des informations personnelles (phishing)."],
    ["RANCONGICIEL", "Logiciel malveillant qui bloque des données contre rançon."],
    ["AUDIT", "Examen méthodique pour évaluer la conformité d'un système."],
    ["GOUVERNANCE", "Ensemble des règles qui encadrent la gestion d'une organisation."]
  ],
  "Sport": [
    ["FOOTBALL", "Sport d'équipe où l'on marque des buts avec un ballon rond."],
    ["BASKET", "Sport d'équipe où l'on marque des paniers."],
    ["TENNIS", "Sport de raquette joué en simple ou en double."],
    ["NATATION", "Sport consistant à nager dans l'eau."],
    ["CYCLISME", "Sport pratiqué à vélo."],
    ["JUDO", "Art martial japonais basé sur les projections."],
    ["RUGBY", "Sport d'équipe où l'on porte un ballon ovale."],
    ["MARATHON", "Course à pied de 42,195 kilomètres."],
    ["ESCALADE", "Sport consistant à grimper une paroi."],
    ["VOLLEYBALL", "Sport d'équipe où le ballon ne doit pas toucher le sol."],
    ["HANDBALL", "Sport d'équipe où l'on marque avec un ballon à la main."],
    ["ATHLETISME", "Ensemble de disciplines de course, saut et lancer."],
    ["BOXE", "Sport de combat avec les poings."],
    ["ESCRIME", "Sport de combat à l'épée."],
    ["SKI", "Sport de glisse sur la neige."],
    ["SURF", "Sport de glisse sur les vagues."],
    ["GOLF", "Sport où l'on envoie une balle dans des trous avec un club."],
    ["HALTEROPHILIE", "Sport consistant à soulever des poids."]
  ],
  "Cinema & Culture": [
    ["CINEMA", "Art de raconter des histoires en images animées."],
    ["ACTEUR", "Personne qui interprète un rôle dans un film ou une pièce."],
    ["REALISATEUR", "Personne qui dirige la réalisation d'un film."],
    ["SCENARIO", "Texte qui décrit l'histoire et les dialogues d'un film."],
    ["MUSIQUE", "Art d'organiser des sons dans le temps."],
    ["PEINTURE", "Art de représenter des images avec de la couleur."],
    ["SCULPTURE", "Art de façonner une matière pour créer une forme en volume."],
    ["THEATRE", "Art de jouer une histoire devant un public."],
    ["ROMAN", "Long récit de fiction en prose."],
    ["POEME", "Texte écrit avec un rythme et souvent des rimes."],
    ["FESTIVAL", "Événement culturel organisé sur plusieurs jours."],
    ["ORCHESTRE", "Grand groupe de musiciens jouant ensemble."],
    ["GUITARE", "Instrument à cordes pincées."],
    ["PIANO", "Instrument à clavier et à cordes frappées."],
    ["DANSE", "Art de bouger le corps en rythme."],
    ["PHOTOGRAPHIE", "Art de capturer des images grâce à la lumière."]
  ]
};

function difficultyOf(word) {
  if (word.length <= 6) return "facile";
  if (word.length <= 9) return "moyen";
  return "difficile";
}

// Liste plate : [{ mot, theme, difficulte, definition }]
const WORD_BANK = Object.entries(RAW_WORDS).flatMap(([theme, words]) =>
  words.map(([mot, definition]) => ({ mot, theme, difficulte: difficultyOf(mot), definition }))
);

const THEMES = Object.keys(RAW_WORDS);

function pickWord({ theme = null, difficulte = null } = {}) {
  let pool = WORD_BANK;
  if (theme && theme !== "Tous") pool = pool.filter(w => w.theme === theme);
  if (difficulte && difficulte !== "Tous") pool = pool.filter(w => w.difficulte === difficulte);
  if (pool.length === 0) pool = WORD_BANK;
  return pool[Math.floor(Math.random() * pool.length)];
}

function definitionOf(word) {
  const entry = WORD_BANK.find(w => w.mot === word);
  return entry ? entry.definition : null;
}

window.PenduWordBank = { WORD_BANK, THEMES, pickWord, difficultyOf, definitionOf };
