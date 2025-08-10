// État global de l'application
let trails = [];
let filteredTrails = [];
let selectedTrail = null;

// Éléments du DOM
const elements = {
    // Filtres desktop
    searchInput: document.getElementById('searchInput'),
    difficultyFilters: document.querySelectorAll('.difficulty-filter'),
    typeFilters: document.querySelectorAll('.type-filter'),
    locationFilter: document.getElementById('locationFilter'),
    distanceFilters: document.querySelectorAll('.distance-filter'),
    durationFilters: document.querySelectorAll('.duration-filter'),
    resetFilters: document.getElementById('resetFilters'),
    
    // Filtres mobile
    mobileSearchInput: document.getElementById('mobileSearchInput'),
    mobileDifficultyFilters: document.querySelectorAll('.mobile-difficulty-filter'),
    mobileTypeFilters: document.querySelectorAll('.mobile-type-filter'),
    mobileLocationFilter: document.getElementById('mobileLocationFilter'),
    mobileDistanceFilters: document.querySelectorAll('.mobile-distance-filter'),
    mobileDurationFilters: document.querySelectorAll('.mobile-duration-filter'),
    mobileResetFilters: document.getElementById('mobileResetFilters'),
    
    // Interface mobile
    mobileFilterBtn: document.getElementById('mobileFilterBtn'),
    mobileSidebarOverlay: document.getElementById('mobileSidebarOverlay'),
    mobileSidebar: document.getElementById('mobileSidebar'),
    closeMobileSidebar: document.getElementById('closeMobileSidebar'),
    
    // Contenu principal
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    emptyState: document.getElementById('emptyState'),
    resultsCount: document.getElementById('resultsCount'),
    desktopTable: document.getElementById('desktopTable'),
    tableBody: document.getElementById('tableBody'),
    mobileCards: document.getElementById('mobileCards'),
    
    // Détails
    detailsPanel: document.getElementById('detailsPanel'),
    detailsContent: document.getElementById('detailsContent'),
    closeDetails: document.getElementById('closeDetails'),
    mobileDetailsModal: document.getElementById('mobileDetailsModal'),
    mobileDetailsContent: document.getElementById('mobileDetailsContent'),
    closeMobileDetails: document.getElementById('closeMobileDetails'),
    
    // Bouton retour en haut
    backToTopBtn: document.getElementById('backToTopBtn')
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupScrollHandling();
    loadTrailsData();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Filtres desktop
    elements.searchInput.addEventListener('input', applyFilters);
    elements.difficultyFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    elements.typeFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    elements.locationFilter.addEventListener('change', applyFilters);
    elements.distanceFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    elements.durationFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    elements.resetFilters.addEventListener('click', resetAllFilters);
    
    // Filtres mobile (synchronisation)
    elements.mobileSearchInput.addEventListener('input', (e) => {
        elements.searchInput.value = e.target.value;
        applyFilters();
    });
    elements.mobileDifficultyFilters.forEach((filter, index) => {
        filter.addEventListener('change', (e) => {
            elements.difficultyFilters[index].checked = e.target.checked;
            applyFilters();
        });
    });
    elements.mobileTypeFilters.forEach((filter, index) => {
        filter.addEventListener('change', (e) => {
            elements.typeFilters[index].checked = e.target.checked;
            applyFilters();
        });
    });
    elements.mobileLocationFilter.addEventListener('change', (e) => {
        elements.locationFilter.value = e.target.value;
        applyFilters();
    });
    elements.mobileDistanceFilters.forEach((filter, index) => {
        filter.addEventListener('change', (e) => {
            elements.distanceFilters[index].checked = e.target.checked;
            applyFilters();
        });
    });
    elements.mobileDurationFilters.forEach((filter, index) => {
        filter.addEventListener('change', (e) => {
            elements.durationFilters[index].checked = e.target.checked;
            applyFilters();
        });
    });
    elements.mobileResetFilters.addEventListener('click', resetAllFilters);
    
    // Interface mobile
    elements.mobileFilterBtn.addEventListener('click', openMobileSidebar);
    elements.closeMobileSidebar.addEventListener('click', closeMobileSidebar);
    elements.mobileSidebarOverlay.addEventListener('click', (e) => {
        if (e.target === elements.mobileSidebarOverlay) {
            closeMobileSidebar();
        }
    });
    
    // Détails
    elements.closeDetails.addEventListener('click', closeDetailsPanel);
    elements.closeMobileDetails.addEventListener('click', closeMobileDetailsModal);
    elements.mobileDetailsModal.addEventListener('click', (e) => {
        if (e.target === elements.mobileDetailsModal) {
            closeMobileDetailsModal();
        }
    });
    
    // Bouton retour en haut
    elements.backToTopBtn.addEventListener('click', scrollToTop);
}

// Configuration de la gestion du scroll
function setupScrollHandling() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Afficher/masquer le bouton retour en haut
        if (scrollTop > 300) {
            elements.backToTopBtn.classList.remove('opacity-0', 'invisible');
        } else {
            elements.backToTopBtn.classList.add('opacity-0', 'invisible');
        }
    });
}

// Chargement des données
async function loadTrailsData() {
    try {
        showLoadingState();
        
        const response = await fetch('sentiers_metadata_data.json');
        if (!response.ok) throw new Error('Impossible de charger les données');
        
        trails = await response.json();
        
        setupLocationFilter();
        applyFilters();
        hideLoadingState();
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showErrorState();
    }
}

// Les données sont maintenant chargées directement en JSON, plus besoin de parser CSV

// Configuration du filtre de lieu
function setupLocationFilter() {
    const locations = [...new Set(trails.map(trail => {
        return trail.starting_point.split(':')[0].trim();
    }))].sort();
    
    // Remplir les deux selects (desktop et mobile)
    [elements.locationFilter, elements.mobileLocationFilter].forEach(select => {
        select.innerHTML = '<option value="">Tous les lieux</option>';
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            select.appendChild(option);
        });
    });
}

// Application des filtres
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const selectedDifficulties = Array.from(elements.difficultyFilters)
        .filter(filter => filter.checked)
        .map(filter => parseInt(filter.value));
    const selectedTypes = Array.from(elements.typeFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    const selectedLocation = elements.locationFilter.value;
    const selectedDistances = Array.from(elements.distanceFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    const selectedDurations = Array.from(elements.durationFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    filteredTrails = trails.filter(trail => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            trail.name.toLowerCase().includes(searchTerm) ||
            trail.code.toLowerCase().includes(searchTerm) ||
            trail.starting_point.toLowerCase().includes(searchTerm);
        
        // Difficulté
        const matchesDifficulty = selectedDifficulties.length === 0 || 
            selectedDifficulties.includes(trail.difficulty);
        
        // Type
        const matchesType = selectedTypes.length === 0 || 
            selectedTypes.includes(trail.type);
        
        // Lieu
        const matchesLocation = !selectedLocation || 
            trail.starting_point.startsWith(selectedLocation);
            
        // Distance
        const matchesDistance = selectedDistances.length === 0 || 
            selectedDistances.some(range => {
                if (!trail.distance) return false;
                const distanceValue = parseFloat(trail.distance.replace(',', '.'));
                switch(range) {
                    case '0-5': return distanceValue < 5;
                    case '5-10': return distanceValue >= 5 && distanceValue <= 10;
                    case '10+': return distanceValue > 10;
                    default: return false;
                }
            });
            
        // Durée
        const matchesDuration = selectedDurations.length === 0 ||
            selectedDurations.some(range => {
                if (!trail.duration) return false;
                const durationParts = trail.duration.split('h');
                const hours = parseInt(durationParts[0]) || 0;
                const minutes = parseInt(durationParts[1]) || 0;
                const totalMinutes = hours * 60 + minutes;
                
                switch(range) {
                    case '0-1h': return totalMinutes < 60;
                    case '1h-2h': return totalMinutes >= 60 && totalMinutes <= 120;
                    case '2h-3h': return totalMinutes > 120 && totalMinutes <= 180;
                    case '3h+': return totalMinutes > 180;
                    default: return false;
                }
            });
        
        return matchesSearch && matchesDifficulty && matchesType && matchesLocation && matchesDistance && matchesDuration;
    });
    
    updateResultsDisplay();
}

// Mise à jour de l'affichage des résultats
function updateResultsDisplay() {
    elements.resultsCount.textContent = `Sentiers (${filteredTrails.length})`;
    
    if (filteredTrails.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
        renderDesktopTable();
        renderMobileCards();
    }
}

// Rendu tableau desktop
function renderDesktopTable() {
    elements.tableBody.innerHTML = '';
    
    filteredTrails.forEach(trail => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50 cursor-pointer transition-colors';
        row.addEventListener('click', () => showTrailDetails(trail));
        
        if (selectedTrail && selectedTrail.code === trail.code) {
            row.classList.add('bg-blue-50');
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${trail.code}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${trail.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getTypeBadge(trail.type)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getDifficultyIcons(trail.difficulty)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                <div class="flex items-center">
                    <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    ${trail.starting_point}
                </div>
            </td>
        `;
        
        elements.tableBody.appendChild(row);
    });
}

// Rendu cartes mobile
function renderMobileCards() {
    elements.mobileCards.innerHTML = '';
    
    filteredTrails.forEach(trail => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow border trail-card-hover cursor-pointer p-4';
        card.addEventListener('click', () => showMobileTrailDetails(trail));
        
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-sm font-medium text-blue-600">${trail.code}</span>
                        ${getTypeBadge(trail.type)}
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">${trail.name}</h3>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        ${trail.starting_point}
                    </div>
                    <div class="flex items-center">
                        <span class="text-sm text-gray-600 mr-2">Difficulté:</span>
                        ${getDifficultyIcons(trail.difficulty)}
                    </div>
                </div>
            </div>
        `;
        
        elements.mobileCards.appendChild(card);
    });
}

// Helpers pour l'affichage
function getTypeBadge(type) {
    if (type === 'Walking') {
        return '<span class="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Randonnée</span>';
    } else if (type === 'Cultural Heritage') {
        return '<span class="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">Patrimoine</span>';
    }
    return '';
}

function getDifficultyIcons(difficulty) {
    const icons = '⚡'.repeat(difficulty);
    return `<span class="difficulty-icon">${icons}</span>`;
}

// Affichage des détails (desktop)
function showTrailDetails(trail) {
    selectedTrail = trail;
    elements.detailsContent.innerHTML = generateTrailDetailsHTML(trail);
    elements.detailsPanel.classList.remove('hidden');
    
    // Mettre à jour la sélection visuelle dans le tableau
    renderDesktopTable();
}

// Affichage des détails (mobile)
function showMobileTrailDetails(trail) {
    selectedTrail = trail;
    elements.mobileDetailsContent.innerHTML = generateTrailDetailsHTML(trail);
    elements.mobileDetailsModal.classList.remove('hidden');
}

// Génération du HTML des détails
function generateTrailDetailsHTML(trail) {
    return `
        <div class="space-y-6">
            <!-- Image -->
            <div class="relative">
                ${trail.image_url ? `
                    <img src="${trail.image_url}" alt="${trail.name}" 
                         class="w-full h-48 object-cover rounded-lg"
                         onerror="this.parentElement.innerHTML = getImagePlaceholder();">
                ` : getImagePlaceholder()}
            </div>
            
            <!-- Informations principales -->
            <div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">${trail.name}</h4>
                <p class="text-sm text-blue-600 mb-4">Code: ${trail.code}</p>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Type</span>
                        ${getTypeBadge(trail.type)}
                    </div>
                    
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Difficulté</span>
                        <div class="flex items-center">
                            ${getDifficultyIcons(trail.difficulty)}
                            <span class="ml-2 text-sm text-gray-700">Niveau ${trail.difficulty}</span>
                        </div>
                    </div>
                    
                    <div class="py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Point de départ</span>
                        <div class="flex items-center mt-1">
                            <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="text-sm text-gray-700">${trail.starting_point}</span>
                        </div>
                    </div>
                    
                    ${trail.distance ? `
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Distance</span>
                        <span class="text-sm text-gray-700">${trail.distance}</span>
                    </div>
                    ` : ''}
                    
                    ${trail.duration ? `
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Durée</span>
                        <span class="text-sm text-gray-700">${trail.duration}</span>
                    </div>
                    ` : ''}
                    
                    ${trail.altitude ? `
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Altitude</span>
                        <span class="text-sm text-gray-700">${trail.altitude}</span>
                    </div>
                    ` : ''}
                    
                    ${trail.parking ? `
                    <div class="py-2 border-b border-gray-200">
                        <span class="text-sm font-medium text-gray-600">Parking</span>
                        <p class="text-sm text-gray-700 mt-1">${trail.parking}</p>
                    </div>
                    ` : ''}
                </div>
                
                ${trail.description ? `
                <div class="pt-4">
                    <h5 class="text-sm font-medium text-gray-600 mb-2">Description</h5>
                    <p class="text-sm text-gray-700 leading-relaxed">${trail.description}</p>
                </div>
                ` : ''}
                
                <!-- Bouton lien externe -->
                <div class="pt-6">
                    <a href="${trail.url}" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        Voir plus d'infos
                    </a>
                </div>
            </div>
        </div>
    `;
}

function getImagePlaceholder() {
    return `
        <div class="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div class="text-center text-gray-400">
                <svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                </svg>
                <p class="text-sm">Image non disponible</p>
            </div>
        </div>
    `;
}

// Fonctions de navigation et de contrôle
function resetAllFilters() {
    elements.searchInput.value = '';
    elements.mobileSearchInput.value = '';
    elements.locationFilter.value = '';
    elements.mobileLocationFilter.value = '';
    
    [...elements.difficultyFilters, ...elements.mobileDifficultyFilters].forEach(filter => {
        filter.checked = false;
    });
    [...elements.typeFilters, ...elements.mobileTypeFilters].forEach(filter => {
        filter.checked = false;
    });
    [...elements.distanceFilters, ...elements.mobileDistanceFilters].forEach(filter => {
        filter.checked = false;
    });
    [...elements.durationFilters, ...elements.mobileDurationFilters].forEach(filter => {
        filter.checked = false;
    });
    
    applyFilters();
}

function openMobileSidebar() {
    elements.mobileSidebarOverlay.classList.remove('hidden');
    setTimeout(() => {
        elements.mobileSidebar.classList.remove('-translate-x-full');
    }, 10);
}

function closeMobileSidebar() {
    elements.mobileSidebar.classList.add('-translate-x-full');
    setTimeout(() => {
        elements.mobileSidebarOverlay.classList.add('hidden');
    }, 300);
}

function closeDetailsPanel() {
    elements.detailsPanel.classList.add('hidden');
    selectedTrail = null;
    renderDesktopTable(); // Retirer la sélection visuelle
}

function closeMobileDetailsModal() {
    elements.mobileDetailsModal.classList.add('hidden');
    selectedTrail = null;
}

// États de l'interface
function showLoadingState() {
    elements.loadingState.classList.remove('hidden');
    elements.errorState.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
    elements.desktopTable.classList.add('hidden');
    elements.mobileCards.innerHTML = '';
}

function hideLoadingState() {
    elements.loadingState.classList.add('hidden');
    elements.desktopTable.classList.remove('hidden');
}

function showErrorState() {
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.remove('hidden');
    elements.desktopTable.classList.add('hidden');
}

function showEmptyState() {
    elements.emptyState.classList.remove('hidden');
    elements.desktopTable.classList.add('hidden');
    elements.mobileCards.innerHTML = '';
}

function hideEmptyState() {
    elements.emptyState.classList.add('hidden');
    elements.desktopTable.classList.remove('hidden');
}

// Fonction pour remonter en haut de page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}