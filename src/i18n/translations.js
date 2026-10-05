/**
 * =============================================================================
 *  TRANSLATIONS  —  Damien LEFEUVRE // Portfolio
 * =============================================================================
 *
 *  This is the SINGLE source of truth for every user-facing string in the app.
 *  Edit content freely here — the app re-renders on language change.
 *
 *  Structure:
 *    translations.<lang>.<section>.<key>
 *
 *  Guidelines to keep FR & EN in sync:
 *    - Every key present in `fr` MUST exist in `en` (and vice-versa).
 *    - `about.paragraphs` and `projects.*.details` are strings preserving
 *      line breaks (use \n or template-literal newlines).
 *    - Arrays (e.g. `about.skills.languages`) must match length across langs.
 *
 *  Add a new language:
 *    1. Duplicate the `fr` block, rename to your locale.
 *    2. Add the code to `LANGUAGES` in this file.
 *    3. Translate values.
 *
 * =============================================================================
 */

export const LANGUAGES = /** @type {const} */ (['fr', 'en']);
export const DEFAULT_LANGUAGE = 'fr';

/* ---------- FRENCH ---------- */
const fr = {
  meta: {
    tagline: 'Portfolio interactif',
  },

  intro: {
    eyebrow: 'Transmission entrante · Terminal',
    name: 'Damien LEFEUVRE',
    subtitle: 'Étudiant Ingénieur · 23 ans · Paris / Nantes',
    body: `Bienvenue dans mon portfolio. Ce n'est pas un CV, c'est un plateau de jeu.
            Chaque élément 3D est un projet réel. Déplacez-vous, explorez et interagissez.
            Vous y trouverez peut-être des surprises`,
    cta: 'Entrer dans la scène',
    aboutCta: 'Voir le à propos',
    textCvCta: 'Version texte accessible',
    pdfCvCta: 'Télécharger le CV (PDF)',
    hint1: 'Déplacer',
    hint2: 'Ouvrir le dossier',
    hint3: 'Inventaire',
    hint4: 'Mode jeu',
    hint5: 'Interagir (danse !)',
  },

  hud: {
    system: 'Système',
    online: 'En ligne',
    coords: 'Position',
    level: 'Niveau',
    stationsVisited: 'Stations',
    inventoryLabel: 'Inventaire',
    language: 'Langue',
    hintMove: 'Déplacer',
    hintOpen: 'Ouvrir',
    hintInteract: 'Interagir',
    hintPlay: 'Mode jeu',
    levelUp: 'Niveau supérieur',
    itemFound: 'Objet trouvé',
    musicOn: 'Activer la musique',
    musicOff: 'Couper la musique',
  },

  ui: {
    close: 'Fermer',
    prev: 'Station précédente',
    next: 'Station suivante',
    downloadCv: 'Télécharger le CV (PDF)',
    showDetails: 'Voir les détails',
    hideDetails: 'Masquer les détails',
    openRepo: 'Voir le code',
    openDemo: 'Voir la démo',
    year: 'Année',
    role: 'Rôle',
    stack: 'Stack',
    videoPlaceholder: '[ Insérer la vidéo dans public/videos/ ]',
    poweredBy: 'Powered by Three.Js & coffee',
  },

  interact: {
    prompt: 'Appuyer sur',
    toOpen: 'pour ouvrir le dossier',
    toInteract: 'pour interagir',
    toPlay: 'pour jouer',
  },

  projects: {
    minecraft: {
      name: 'Minecraft — Mode Créatif',
      year: '2025',
      role: 'Recréation from-scratch',
      short:
        "Une recréation complète du mode créatif de Minecraft, moteur voxel maison, chunks générés à la volée, gestion des collisions et interactions bloc-à-bloc.",
      details: `Objectif : reconstruire la boucle de jeu de construction du jeu de base, à partir de zéro.

• Moteur voxel maison : chunk streaming, mesh greedy meshing, éclairage AO.
• Rendu OpenGL bas-niveau (VBO / VAO / shaders GLSL).
• Systèmes : caméra libre, physique, casse/pose de blocs, sauvegarde du monde.
• Pipeline d'assets et gestion d'inventaire créatif.
`,
      tags: ['C++', 'OpenGL', 'Voxel', 'Game Engine'],
      stationHint: 'Un cube minecraft se casse à ton approche.',
    },

    utopex: {
      name: 'Utopex — Cyberpunk Defense',
      year: '2021',
      role: 'Game Designer & Développeur',
      short:
        "Jeu vidéo cyberpunk où le joueur défend un cœur de cristal contre des vagues d'ennemis, dans une néo-cité",
      details: `Projet scolaire réalisé en équipe de 3, avec une expérience de 3-4h de jeu.
      
• Développement complet : graphismes, gameplay, histoire, son.
• Création d’un moteur de rendu en temps réel 2D/3D isométrique sur Pygame avec gestion des particules et occlusion ambiante.
• Développement de modules pour simplifier l’utilisation de Pygame (gestion des entrées, création de boutons, barres de scrolling, zones de texte stylisées).
• Level design : arène compacte avec une conception stratégique du positionnement et des mécaniques de jeu.
• Travail graphique avec plus de 100 éléments créés dans un style Néo-Futuriste, Spatial et Cyberpunk
`,
      tags: ['Game Design', "Game Engine", "Isométrique", 'Cyberpunk', 'Tower Defense', 'IA'],
      stationHint: 'Le cristal émet une lueur quand tu approches.',
    },

    facerehab: {
      name: 'FaceRehab — Rééducation VR',
      year: '2026',
      role: 'Ingénieur Logiciel',
      short:
        "Application de rééducation maxillo-faciale en réalité mixte, basée sur des avatars MetaHuman personnalisés et des exercices ludifiés.",
      details: `Projet de fin d’études réalisé en équipe de 2, sous la forme d’une application Three.js comprenant :

• Avatars MetaHuman personnalisés pour chaque patient.
• Exercices ciblés (mouvements faciaux, articulation, symétrie) transformés en mini-jeux.
• Gamification : progression, feedback visuel temps réel, encouragements adaptatifs.
• Intégration avec un pipeline de suivi clinique pour les kinésithérapeutes.

`,
      tags: ['XR', "ThreeJs", 'Unreal', 'MetaHuman', 'Santé'],
      stationHint: 'Un visage numérique flotte en attente.',
    },

    vrtower: {
      name: 'VR Tower Defense — Hackathon Laval',
      year: '2026',
      role: 'Winner (1st Place) · Laval Virtual',
      short:
        "Tower defense en VR où le joueur déploie ses propres avatars animés comme unités défensives. Lauréat du hackathon Laval Virtual.",
      details: `Nous avons participé au hackathon de Laval dans le cadre de notre option en Réalité Virtuelle à Centrale Nantes.
      Le thème du Hackathon était Mini-moi, nous avions chacun construit au préalable une courte animation de nous en Motion Capture que nous devions impérativement inclure dans le projet.
      Le projet a été conçu en 2 jours avec une équipe de 3 personnes.

• Chaque unité défensive est une de nos animations, capturé et rejoué en temps réel.
• Gros focus sur le retour haptique : lors de l'achat d'un objet, de l'utilisation de l'arme ou du placement des figurines
• Vagues procédurales et scoring en direct.
• Victoire du hackathon de Laval.

`,
      tags: ['VR', 'Unity', 'Hackathon', 'Winner'],
      stationHint: 'Une tour tourne lentement, en attente d\'ordres.',
    },

    aiportal: {
      name: 'AI Portal — Rogue-like génératif',
      year: '2025',
      role: 'AI/ML Engineer & Game Dev',
      short:
        "Un rogue-like dont chaque niveau est généré en temps réel par un modèle inspiré de NanoGPT — tu écris un prompt, et le monde s'adapte à ta demande.",
      details: `Chaque portail est un nouveau prompt.

• Modèle génératif type NanoGPT entraîné sur un dataset de niveaux annotés.
• Pipeline : prompt utilisateur → tokens → grille de niveau → mesh + entités.
• Intégré à un moteur de jeu custom pour un feedback quasi instantané.
• Sécurité : filtre de cohérence pour éviter les niveaux injouables.
`,
      tags: ['LLM', 'PyTorch', "GPT", 'Procedural', 'Game AI'],
      stationHint: 'Des mots défilent dans le portail avant de se figer en monde.',
    },

    about: {
      name: 'À propos',
      year: '2003 → ∞',
      role: 'Étudiant Ingénieur',
      short:
        "Étudiant ingénieur à l'école Centrale Marseille",
      details: '',
      tags: [],
      stationHint: 'Un terminal ancien clignote. Il attend une commande.',
    },
  },

  about: {
    eyebrow: 'Dossier personnel · Ouvert',
    title: 'Damien LEFEUVRE',
    subtitle: 'Étudiant ingénieur, 23 ans',

    paragraphs: [
      `Je termine actuellement mon cursus d'étudiant ingénieur à Centrale Méditerranée, spécialisé en réalité virtuelle et 3D graphics.`,
      `J’aime concevoir et construire des projets concrets, en passant de l’idée à une solution fonctionnelle. Mon parcours m’a amené à travailler sur des sujets variés, de la 3D et de la réalité virtuelle à l’intelligence artificielle, aux données et au développement logiciel. La programmation est pour moi un outil parmi d’autres pour donner vie à des projets, plutôt qu’une fin en soi.`,
      `Je cherche aujourd’hui à développer un profil d’ingénieur polyvalent, capable de comprendre un problème dans son ensemble, de concevoir des solutions et de travailler à la croisée de plusieurs domaines. Ce portfolio rassemble quelques-uns de ces projets, personnels, académiques et professionnels.`,
    ],

    sections: {
      education: 'Formation',
      experience: 'Expérience',
      skills: 'Compétences',
      languages: 'Langues',
      contact: 'Contact',
    },

    education: [
      'Centrale Méditerranée — Diplôme d\'ingénieur (2023 → 2027)',
      'Centrale Nantes — Échange scolaire - Option RV/AR (2025 → 2026)',
      'CPGE Mathématiques · Physique · Info (2021 → 2023)',
    ],

    experience: [
      'GE Healthcare — Software Eng. Intern (2026)',
      'Météo France — Software Eng. Intern (2025)',
      '40Watts — Technical Operations Intern (2024)',
    ],

    skills: {
      programming: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'OCaml', 'SQL', 'Git'],
      web: ['React', 'Node.js', 'ThreeJs', "BabylonJs", 'Express', 'Flask', 'HTML', 'CSS'],
      ai: ['PyTorch', 'LangChain', 'LLM Integration', 'Machine Learning'],
      xr: ['OpenGL', 'Unity', 'Unreal Engine', 'OpenCV'],
    },

    languages: [
      'Français — Langue maternelle',
      'Anglais — Professionnel (C1)',
      'Espagnol — Intermédiaire (B1)',
      'Allemand — Notions de base'
    ],

    contact: {
      email: 'damien.lefeuvre0@gmail.com',
      github: 'github.com/DAMLEF',
      linkedin: 'linkedin.com/in/damien-lefeuvre-2b2296297',
      location: 'Région parisienne — Ouverte au monde',
    },
  },

  cv: {
    title: 'CV — Version texte',
    intro: `Une version linéaire, lisible et imprimable de mon parcours. Pour la version interactive en 3D, retourne sur la page principale.`,
    projectsHeader: 'Projets & Réalisations',
    projectRole: 'Rôle',
    projectYear: 'Année',
    backToScene: 'Retour à la version interactive',
    printCta: 'Imprimer / Exporter en PDF',
  },

  inventory: {
    empty: 'Vide',
    title: 'Inventaire',
    items: {
      pickaxe: { name: 'Pioche cubique', desc: 'Ça casse. Ça pose. C\'est éternel.' },
      crystal: { name: 'Éclat de cristal', desc: 'Encore chaud d\'une vague.' },
      mask:    { name: 'Masque neuronal', desc: 'Ressent avant de comprendre.' },
      headset: { name: 'Casque VR',       desc: 'Empruntable pour 48h seulement.' },
      token:   { name: 'Jeton IA',        desc: 'Un mot suffit à changer le monde.' },
      dossier: { name: 'Dossier scellé',  desc: 'Contient tout ce que je ne dis pas.' },
    },
    hint: 'Clique un objet pour animer ton avatar.',
  },

  playMode: {
    on: 'Mode Jeu activé',
    off: 'Mode Jeu désactivé',
    banner: 'MODE JEU · CLIQUE POUR POSER DES BLOCS',
  },

  activities: {
    poker: {
      name: 'Table de poker',
      hint: 'Retourner le jeton',
      /* Cinq lignes de flavor tirées aléatoirement quand tu flip */
      flips: [
        'ROYAL FLUSH — ta destinée est en pique.',
        'BLUFF ACCEPTÉ · la maison sourit.',
        'ALL-IN sur toi-même.',
        'FOLD ? Jamais. Tu joues.',
        'MISE : une idée. GAIN : un projet.',
      ],
    },
    dice: {
      name: 'Bac à dés',
      hint: 'Lancer les dés',
      /* Résultats commentés — le total détermine le message */
      lows: 'Petit coup. Rejoue.',
      mids: 'Correct. Le hasard t\'aime bien.',
      highs: 'DOUBLE SIX (ou presque). Le destin s\'incline.',
    },
    carousel: {
      name: 'Carrousel miniature',
      hint: 'Faire tourner',
      caption: 'Un tour de piste rien que pour toi.',
    },
    hologram: {
      name: 'Borne de commande',
      hint: 'Commander',
      menu: 'MENU DU JOUR',
      lines: [
        '// Nouilles au néon — 4 crédits',
        '// Sushi cyber-frit — 6 crédits',
        '// Café brûlant — offert',
        '// Pizza rétro — indisponible',
      ],
      ordered: 'Commande passée. Le drone arrive.',
    },
    rocket: {
      name: 'Rampe de lancement',
      hint: 'Mettre à feu',
      locked: 'VERROUILLÉ',
      lockedHint: 'Visite toutes les stations et activités pour débloquer.',
      launching: 'DÉCOMPTE // 3 · 2 · 1 — MISE À FEU',
      launched: 'Feu d’artifice au-dessus du terminal.',
    },
  },

  controls: {
    keysMove: ['Z', 'Q', 'S', 'D'],
    keyOpen: 'E',
    keyInteract: 'R',
    keyInventory: 'I',
    keyPlay: 'G',
    labelMoveKeys: 'ZQSD',
  },
};

/* ---------- ENGLISH ---------- */
const en = {
  meta: {
    tagline: 'Interactive portfolio',
  },

  intro: {
    eyebrow: 'Incoming Transmission · Terminal 2027',
    name: 'Damien LEFEUVRE',
    subtitle: 'Engineering Student · 23 y.o · Paris / Nantes',
    body: `Welcome to my portfolio. This isn't a CV — it's a playground
Every 3D element is based on a real project. Move around, explore, and interact.
You might even find a few surprises.`,
    cta: 'Enter the scene',
    aboutCta: 'Read the about',
    textCvCta: 'Accessible text version',
    pdfCvCta: 'Download the CV (PDF)',
    hint1: 'Move',
    hint2: 'Open file',
    hint3: 'Inventory',
    hint4: 'Play mode',
    hint5: 'Interact (dance!)',
  },

  hud: {
    system: 'System',
    online: 'Online',
    coords: 'Position',
    level: 'Level',
    stationsVisited: 'Stations',
    inventoryLabel: 'Inventory',
    language: 'Language',
    hintMove: 'Move',
    hintOpen: 'Open',
    hintInteract: 'Interact',
    hintPlay: 'Play mode',
    levelUp: 'Level Up',
    itemFound: 'Item found',
    musicOn: 'Play music',
    musicOff: 'Mute music',
  },

  ui: {
    close: 'Close',
    prev: 'Previous station',
    next: 'Next station',
    downloadCv: 'Download the CV (PDF)',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    openRepo: 'View source',
    openDemo: 'View demo',
    year: 'Year',
    role: 'Role',
    stack: 'Stack',
    videoPlaceholder: '[ Drop video into public/videos/ ]',
    poweredBy: 'Powered by curiosity & caffeine',
  },

  interact: {
    prompt: 'Press',
    toOpen: 'to open the file',
    toInteract: 'to interact',
    toPlay: 'to play',
  },

  projects: {
    minecraft: {
      name: 'Minecraft — Creative Mode',
      year: '2025',
      role: 'From-scratch recreation',
      short:
        "A full recreation of Minecraft's creative mode: home-made voxel engine, streamed chunks, collision system, block-by-block interactions.",
      details: `Goal: Rebuild the core building gameplay loop of the original game from scratch.

• Home-made voxel engine: chunk streaming, greedy meshing, AO lighting.
• Low-level OpenGL rendering (VBO / VAO / GLSL shaders).
• Systems: free camera, physics, break/place blocks, world save.
• Asset pipeline and creative inventory.
`,
      tags: ['C++', 'OpenGL', 'Voxel', 'Game Engine'],
      stationHint: 'A minecraft block breaks as you approach.',
    },

    utopex: {
      name: 'Utopex — Cyberpunk Defense',
      year: '2021',
      role: 'Game Designer & Developer',
      short:
        'A cyberpunk game where you defend a crystal heart against waves of enemies in a neo-city.',
      details: `School project developed by a team of 3, with a 3–4 hour gameplay experience.

• Full game development: graphics, gameplay, story, and sound.
• Custom real-time 2D/3D isometric rendering engine built with Pygame, including particle systems and ambient occlusion.
• Development of reusable Pygame modules to simplify input handling, button creation, scrolling bars, and styled text areas.
• Level design: compact arena with strategic conception of position and gameplay mechanics.
• Art direction and asset creation: over 100 original assets in a Neo-Futuristic, Space, and Cyberpunk style

`,
      tags: ['Game Design', "Game Engine", "Isometric", 'Cyberpunk', 'Tower Defense', 'AI'],
      stationHint: 'The crystal glows brighter as you approach.',
    },

    facerehab: {
      name: 'FaceRehab — VR Rehabilitation',
      year: '2026',
      role: 'Software Engineer',
      short:
        'A maxillofacial rehabilitation application in VR, powered by personalized MetaHuman avatars and gamified exercises.',
      details: `Final-year project developed by a team of 2, in the form of a Three.js application featuring:

• Custom MetaHuman avatars per patient.
• Targeted exercises (facial movements, articulation, symmetry) turned into mini-games.
• Gamification: progression, real-time feedback, adaptive encouragement.
• Integration with a clinical pipeline for physiotherapists.
`,
      tags: ['XR', "ThreeJs", 'Unreal', 'MetaHuman', 'Healthcare'],
      stationHint: 'A digital face floats, waiting.',
    },

    vrtower: {
      name: 'VR Tower Defense — Laval Hackathon',
      year: '2026',
      role: 'Winner (1st Place) · Laval Virtual',
      short:
        'A VR tower defense where the player deploys their own animated avatars as defensive units. Winner of the Laval Virtual hackathon.',
      details: `We participated in the Laval Hackathon as part of our Virtual Reality specialization at Centrale Nantes.
      The theme of the hackathon was “Mini-Me”. Before the event, each of us created a short Motion Capture animation of ourselves, which we were required to incorporate into the project.
      The project was developed over two days by a team of three.

• Each defensive unit is one of our Motion Capture animations, captured and replayed in real time.
• Strong focus on haptic feedback: when purchasing an item, using a weapon, or placing the figurines.
• Procedurally generated waves and real-time scoring.
• Winner of the Laval Hackathon.

`,
      tags: ['VR', 'Unity', 'Hackathon', 'Winner'],
      stationHint: 'A tower slowly rotates, awaiting orders.',
    },

    aiportal: {
      name: 'AI Portal — Generative Rogue-like',
      year: '2025',
      role: 'ML Engineer & Game Dev',
      short:
        'A roguelike where each level is generated in real time by a model inspired by NanoGPT — you write a prompt, and the world adapts to your request',
      details: `Every portal is a new prompt.

• Generative model (NanoGPT-style) trained on a labeled level dataset.
• Pipeline: user prompt → tokens → level grid → mesh + entities.
• Integrated in a custom game engine for near-instant feedback.
• Safety: coherence filter to avoid unplayable levels.
`,
      tags: ['LLM', 'PyTorch', "GPT", 'Procedural', 'Game AI'],
      stationHint: 'Words scroll inside the portal before crystallizing into a world.',
    },

    about: {
      name: 'About',
      year: '2003 → ∞',
      role: 'Engineering student ',
      short:
        'Engineering student at Centrale Méditerranée',
      details: '',
      tags: [],
      stationHint: 'An old terminal blinks. It waits for a command.',
    },
  },

  about: {
    eyebrow: 'Personal Dossier · Open',
    title: 'Damien LEFEUVRE',
    subtitle: 'Engineering student, 23 y.o',

    paragraphs: [
      `I am currently completing my engineering degree at Centrale Méditerranée, specializing in virtual reality and 3D graphics.`,
      `I enjoy designing and building concrete projects, from an initial idea to a functional solution. My background has led me to work across a variety of fields, from 3D and virtual reality to artificial intelligence, data, and software development. To me, programming is a tool among many others for bringing projects to life, rather than an end in itself.`,
      `I am now looking to develop a versatile engineering profile, capable of understanding a problem as a whole, designing solutions, and working at the intersection of multiple fields. This portfolio brings together some of these projects, both personal, academic, and professional.`,
    ],

    sections: {
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills',
      languages: 'Languages',
      contact: 'Contact',
    },

    education: [
      'Centrale Engineering School — Master (2023 → 2027)',
      "Centrale Nantes — Academic Exchange – VR/AR Specialization (2025 → 2026)",
      'CPGE Mathematics · Physics · CS (2021 → 2023)',
    ],

    experience: [
      'GE Healthcare — Software Eng. Intern (2026)',
      'Météo France — Software Eng. Intern (2025)',
      '40Watts — Technical Operations Intern (2024)',
    ],

    skills: {
      programming: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'OCaml', 'SQL', 'Git'],
      web: ['React', 'Node.js', 'ThreeJs', "BabylonJs", 'Express', 'Flask', 'HTML', 'CSS'],
      ai: ['PyTorch', 'LangChain', 'LLM Integration', 'Machine Learning'],
      xr: ['OpenGL', 'Unity', 'Unreal Engine', 'OpenCV'],
    },

    languages: [
      'French — Native',
      'English — Professional (C1)',
      'Spanish — Intermediate (B1)',
      'German — Basic knowledge',
    ],

    contact: {
      email: 'damien.lefeuvre0@gmail.com',
      github: 'github.com/DAMLEF',
      linkedin: 'linkedin.com/in/damien-lefeuvre-2b2296297',
      location: 'Paris area — Open to the world',
    },
  },

  cv: {
    title: 'CV — Text version',
    intro: `A linear, readable and printable version of my journey. For the 3D interactive version, head back to the main page.`,
    projectsHeader: 'Projects & Highlights',
    projectRole: 'Role',
    projectYear: 'Year',
    backToScene: 'Back to the interactive version',
    printCta: 'Print / Save as PDF',
  },

  inventory: {
    empty: 'Empty',
    title: 'Inventory',
    items: {
      pickaxe: { name: 'Cubic pickaxe',  desc: 'Breaks. Places. Forever.' },
      crystal: { name: 'Crystal shard',  desc: 'Still warm from a wave.' },
      mask:    { name: 'Neural mask',    desc: 'Feels before it understands.' },
      headset: { name: 'VR headset',     desc: 'Borrowable for 48h only.' },
      token:   { name: 'AI token',       desc: 'One word can rewrite worlds.' },
      dossier: { name: 'Sealed dossier', desc: 'Holds what I don\'t say.' },
    },
    hint: 'Click an item to animate your avatar.',
  },

  playMode: {
    on: 'Play Mode ON',
    off: 'Play Mode OFF',
    banner: 'PLAY MODE · CLICK TO PLACE BLOCKS',
  },

  activities: {
    poker: {
      name: 'Poker table',
      hint: 'Flip the chip',
      flips: [
        'ROYAL FLUSH — fate rides on spades.',
        'BLUFF ACCEPTED · the house smiles.',
        'ALL-IN on yourself.',
        'FOLD? Never. You play.',
        'BET: an idea. WIN: a project.',
      ],
    },
    dice: {
      name: 'Dice tray',
      hint: 'Roll the dice',
      lows: 'Small toss. Roll again.',
      mids: 'Fair. Luck likes you.',
      highs: 'DOUBLE SIX (or close). Fate bows.',
    },
    carousel: {
      name: 'Miniature carousel',
      hint: 'Spin it',
      caption: 'One lap around the ring, just for you.',
    },
    hologram: {
      name: 'Order kiosk',
      hint: 'Order',
      menu: 'TODAY\'S MENU',
      lines: [
        '// Neon noodles — 4 credits',
        '// Cyber-fried sushi — 6 credits',
        '// Burning coffee — on the house',
        '// Retro pizza — unavailable',
      ],
      ordered: 'Order placed. Drone incoming.',
    },
    rocket: {
      name: 'Launch pad',
      hint: 'Ignite',
      locked: 'LOCKED',
      lockedHint: 'Visit every station and activity to unlock.',
      launching: 'COUNTDOWN // 3 · 2 · 1 — IGNITION',
      launched: 'Fireworks above the terminal.',
    },
  },

  controls: {
    keysMove: ['W', 'A', 'S', 'D'],
    keyOpen: 'E',
    keyInteract: 'R',
    keyInventory: 'I',
    keyPlay: 'G',
    labelMoveKeys: 'WASD',
  },
};

/* ---------- EXPORT ---------- */
export const translations = { fr, en };
