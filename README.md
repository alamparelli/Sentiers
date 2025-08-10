# 🥾 Explorateur de Sentiers Mullerthal

Une interface web moderne et responsive pour explorer les sentiers locaux du Mullerthal Trail au Luxembourg.

![Screenshot](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Fonctionnalités

### 🔍 **Filtrage avancé**
- **Recherche textuelle** - Par nom, code ou lieu de départ
- **Difficulté** - 3 niveaux avec indicateurs visuels ⚡
- **Type d'activité** - Randonnée ou Patrimoine culturel
- **Lieu de départ** - Sélection par ville
- **Distance** - Moins de 5km, 5-10km, plus de 10km
- **Durée** - Moins d'1h, 1-2h, 2-3h, plus de 3h

### 📱 **Interface responsive**
- **Desktop** - Sidebar filtres + tableau + panneau détails sticky
- **Mobile** - Drawer filtres + cartes + modal détails
- **Navigation fluide** - Bouton retour en haut

### 🗺️ **Informations détaillées**
- Distance et durée exactes
- Point de départ et d'arrivée
- Informations de parking
- Altitude
- Description complète
- Images des sentiers
- Liens vers les pages officielles

## 🚀 Démo en ligne

**[🌐 Voir la démo](https://alamparelli.github.io/mullerthal-trail-explorer/)**

## 📊 Données

- **76 sentiers** du Mullerthal Trail
- **Données enrichies** extraites automatiquement depuis les pages officielles
- **Format JSON** optimisé pour les performances

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **Tailwind CSS** - Styling moderne et responsive
- **JavaScript ES6+** - Logique interactive
- **JSON** - Stockage des données

## 🏃‍♂️ Utilisation locale

1. Cloner le dépôt
```bash
git clone https://github.com/alamparelli/mullerthal-trail-explorer.git
cd mullerthal-trail-explorer
```

2. Servir les fichiers (nécessaire pour le chargement JSON)
```bash
# Python 3
python -m http.server 8000

# Node.js 
npx serve .

# PHP
php -S localhost:8000
```

3. Ouvrir http://localhost:8000

## 📁 Structure du projet

```
├── index.html                      # Page principale
├── script.js                       # Logique JavaScript
├── sentiers_metadata_data.json     # Données des sentiers
└── README.md                       # Documentation
```

## 🎯 Fonctionnalités clés

### Filtrage intelligent
- Combinaison de plusieurs critères
- Temps réel sans latence
- Compteur de résultats dynamique

### Interface adaptative  
- Mobile-first design
- Transitions fluides
- États de chargement et d'erreur

### Expérience utilisateur
- Sélection visuelle des sentiers
- Panneau de détails contextuel
- Navigation intuitive

## 🌍 Données source

Les données proviennent du site officiel [Mullerthal Trail](https://www.mullerthal-trail.lu) et incluent :

- 76 sentiers locaux officiels
- Informations détaillées extraites automatiquement
- Images et descriptions complètes
- Liens vers les cartes topographiques

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour les amoureux de randonnée au Luxembourg** 🇱🇺
