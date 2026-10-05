# Damien LEFEUVRE — Portfolio interactif

Un portfolio-plateau où chaque projet est une petite station 3D à visiter.  
Mélange volontaire : **pulp SF 1930** (Amazing Stories) × **cyberpunk** × **CRT subtil** × **Three.js**.

---

## ⚡ Démarrage rapide

Prérequis : **Node.js ≥ 18**.

## 🎮 Contrôles

| Touche              | Action                                             |
| ------------------- | -------------------------------------------------- |
| `W` `A` `S` `D` / ⬆⬇⬅➡ | Déplacer l'avatar                                  |
| `E`                 | Interagir avec la station la plus proche           |
| `I`                 | Ouvrir / fermer l'inventaire                       |
| `G`                 | Basculer le **Mode Jeu** (easter-egg voxels)      |
| `Esc`               | Fermer une modale                                  |
| `Entrée` / `Espace` | Fermer l'intro                                     |

Souris : cliquer sur une station l'ouvre directement. En Mode Jeu, cliquer au sol pose un bloc coloré style Minecraft.

## 🧭 Architecture

```
portfolio/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                # Bootstraps React + GameProvider
   ├─ App.jsx                 # Root layout : Scene + HUD + Modals + CRT
   │
   ├─ i18n/
   │  └─ translations.js      # 🌐 TOUS LES TEXTES (FR/EN)
   │
   ├─ data/
   │  └─ projects.js          # 📦 Positions, couleurs, liens, vidéos
   │
   ├─ state/
   │  └─ GameContext.jsx      # Store : langue, level, inventaire, modales
   │                          # Aussi : refs de position, mini synth beep
   │
   ├─ components/             # UI 2D (React classique)
   │  ├─ CRTOverlay.jsx       # Scanlines + noise
   │  ├─ Intro.jsx            # Overlay boot
   │  ├─ HUD.jsx              # Coins diegetiques (langue, level, coords)
   │  ├─ Inventory.jsx        # Panel bas-gauche + slots
   │  ├─ InteractPrompt.jsx   # « Press E » contextuel
   │  ├─ ProjectModal.jsx     # Pop-up projet (vidéo + détails)
   │  ├─ AboutModal.jsx       # Pop-up « À propos »
   │  ├─ LevelUpFlash.jsx     # Flash « niveau supérieur »
   │  └─ PlayModeBanner.jsx   # Bandeau du mode jeu
   │
   ├─ scene/                  # 3D (Three.js / React-Three-Fiber)
   │  ├─ Scene.jsx            # Canvas racine
   │  ├─ Ground.jsx           # Sol néon + grid
   │  ├─ Neons.jsx            # Particules + halo horizon
   │  ├─ CameraRig.jsx        # Caméra qui suit l'avatar (tilt + look-ahead)
   │  ├─ Effects.jsx          # Bloom + chromatic aberration + noise
   │  ├─ Character.jsx        # Avatar jouable + trail
   │  ├─ PlayModeGround.jsx   # Easter-egg : cliquer pour poser des voxels
   │  ├─ Stations.jsx         # Compose toutes les stations
   │  └─ stations/
   │     ├─ StationBase.jsx      # Piédestal + nameplate + hitbox commune
   │     ├─ MinecraftStation.jsx # Bloc qui se casse en boucle
   │     ├─ CrystalStation.jsx   # Cristal Utopex qui pulse
   │     ├─ FaceStation.jsx      # Tête wireframe FaceRehab
   │     ├─ TowerStation.jsx     # Tour VR + drones orbitants
   │     ├─ PortalStation.jsx    # Portail IA + mots défilants
   │     └─ AboutStation.jsx     # Vieux CRT « À propos »
   │
   └─ styles/
      ├─ global.css           # Design tokens + CRT + fonts + glitch
      └─ ui.css               # Intro, HUD, Modals, Inventory
```

---

## 🕹️ Easter-eggs

* **Mode Jeu (`G`)** : cliquer au sol pose un voxel coloré style Minecraft. Chaque tuile empile les blocs verticalement.
* **Inventaire (`I`)** : cliquer sur un objet déclenche une animation de l'avatar (spin de combat, pulse de sort…).
* **Niveaux** : chaque station visitée augmente le niveau du personnage (léger effet de croissance + flash HUD).
* **Persistance** : niveau, langue et inventaire sont sauvegardés dans `localStorage`.

---

## 🎨 Direction artistique — tokens principaux

Voir `src/styles/global.css` pour la palette exacte.

| Rôle              | Couleur                   |
| ----------------- | ------------------------- |
| Void (fond)       | `#0a0612` → `#05030c`     |
| Parchemin (texte) | `#f2e8c8`                 |
| Pulp jaune        | `#f5c518`                 |
| Pulp rouge        | `#d2492b`                 |
| Néon cyan         | `#45f0ff`                 |
| Néon magenta      | `#ff2bd6`                 |
| Terminal vert     | `#7cf29c`                 |

Fonts :

* **Rye** — display pulp (Amazing Stories vibes)
* **JetBrains Mono** — HUD & diegetique
* **Space Grotesk** — corps de texte

---

## 🧑‍💻 Auteur

**Damien LEFEUVRE** — Étudiant ingénieur Centrale (Nantes & Marseille) · 23 ans  
✉ `damien.lefeuvre0@gmail.com` · GitHub `DAMLEF` · LinkedIn `damien-lefeuvre-2b2296297`

_
