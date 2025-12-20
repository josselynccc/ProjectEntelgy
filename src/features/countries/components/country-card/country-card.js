import styles from './country-card.css?inline';
import '../..//../../components/ui/card/card.js';
import FavoriteStore from '../../../../core/store/favorites-store.js';
export class CountryCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._country = {
            flag : '',
            name : '',
            population : 0,
            languages: {},
            capital : '',
            area: 0,
            id: ''
        }
        this._isLoading = true

        this._needUpdate = false;
        this._updateScheduled = false;

        this._countryModal = null;
        this._isOpeningModal = false;
    }

    static get observedAttributes() {
        return ['data-country', 'data-country-modal'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        if (name === 'data-country' && newValue) {
            try {
                this.country = JSON.parse(newValue);
            } catch (error) {
                console.warn('Error parsing country data:', error);
            }
        }

        if (name === 'data-country-modal' && newValue) {
            try {
                this._countryModal = JSON.parse(newValue);
            } catch (error) {
                console.warn('Error parsing modal data:', error);
            }
        }
    }

    get country() {
        return this._country;
    }
    
    set country(data) {
        if (typeof data !== 'object') return;
        
        this._country = { ...this._country, ...data };
        this._isLoading = false;
        this._needUpdate = true;
        this.scheduleUpdate();
    }

    isFavorite() {
        return this._country.id ? FavoriteStore.isFavorite(this._country.id) : false;
    }
    
    toggleFavorite() {
        console.log('Toggling favorite for country:', this._country);
        if (this._country.id) {
            FavoriteStore.toggle({
                id: this._country.id,
                name: this._country.name,
                flag: this._country.flag,
                capital: this._country.capital,
                population: this._country.population,
                region: this._country.region
            });
            this.updateFavoriteButton();
        }
    }

    updateFavoriteButton() {
        const button = this.shadowRoot.querySelector('.favorite-btn');
        if (button) {
            const isFavorite = this.isFavorite();
            button.innerHTML = isFavorite ? '❤️' : '🤍';
            button.setAttribute('aria-label', 
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
            );
        }
    }

    formatNumber(num) {
        if (!num || isNaN(num)) return 'N/A';
        return parseInt(num).toLocaleString('es-ES');
    }

    getLanguagesString(langs) {
        return Object.values(langs).join(', ');
    }

    showDetails() {
        if (this._isOpeningModal) {
            return;
        }
        
        if (!this._countryModal) {
            return;
        }
        
        this._isOpeningModal = true;
        
        if (!customElements.get('country-modal')) {
            import('../country-modal/country-modal.js').then(() => {
                this.openModal();
            }).catch(error => {
                this._isOpeningModal = false;
            });
        } else {
            this.openModal();
        }
    }

    async openModal() {
        try {
            const existingModal = document.querySelector('country-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            const modal = document.createElement('country-modal');
            document.body.appendChild(modal);
            
            this._isOpeningModal = false;
            
            setTimeout(() => {
                if (typeof modal.open === 'function') {
                    modal.open(this._countryModal, this.isFavorite());
                } else {
                    modal.setAttribute('data-country', JSON.stringify(this._countryModal));
                    modal.setAttribute('data-is-favorite', this.isFavorite().toString());
                    modal.style.display = 'block';
                }
            }, 10);
            
        } catch (error) {
            alert(`Error al cargar información de ${this._country.name}`);
            this._isOpeningModal = false;
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.cancelScheduledUpdate();
    }

    scheduleUpdate() {
        if (this._updateScheduled) return;
        this._updateScheduled = true;
        requestAnimationFrame(() => this.performUpdate());
    }

    cancelScheduledUpdate() {
        this._updateScheduled = false;
        this._needUpdate = false;
    }

    performUpdate() {
        if (this._needUpdate && this.isConnected) {
            this._updateScheduled = false;
            this._needUpdate = false;
            
            this.render();
        }
    }

    render() {
        if (!this.shadowRoot) return;
        
        if (this._isLoading) {
            this.renderSkeleton();
            return;
        }
        
        if (!this._country.name) {
            this.renderPlaceholder();
            return;
        }
        
        this.renderWithData();
    }

    setupEventListeners() {
        const shadow = this.shadowRoot;
        if (!shadow) return;
        
        this.removeEventListeners();

        this._clickHandler = (e) => {
            const target = e.target;
            
            if (target.classList.contains('favorite-btn')) {
                e.stopPropagation();
                this.toggleFavorite();
            }
            
            if (target.classList.contains('country-title')) {
                e.stopPropagation();
                this.showDetails();
            }
        };
        
        shadow.addEventListener('click', this._clickHandler);
    }

    removeEventListeners() {
        const shadow = this.shadowRoot;
        if (!shadow) return;
        
        if (this._clickHandler) {
            shadow.removeEventListener('click', this._clickHandler);
            this._clickHandler = null;
        }
    }

    renderSkeleton() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <app-card>
                <div slot="header" class="skeleton-flag"></div>
                <div slot="content" class="skeleton-content">
                    <div class="skeleton-text medium"></div>
                    <div class="skeleton-text small"></div>
                    <div class="skeleton-stats">
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                    </div>
                </div>
            </app-card>
        `;
    }
    renderPlaceholder() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="card placeholder">
                <div class="placeholder-content">
                    <p>Selecciona un país</p>
                </div>
            </div>
        `;
    }

    renderWithData() {
        const isFavorite = this.isFavorite();

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            
            <app-card>
                <div slot="header" class="country-header">
                    ${this._country.flag ? 
                        `<img src="${this._country.flag}" 
                              alt="Bandera de ${this._country.name}" 
                              class="country-flag"
                              loading="lazy">` 
                        : '<div class="flag-placeholder">🏳️</div>'
                    }
                </div>
                
                <div slot="content" class="country-content">
                    <div class="country-info">
                        <div class="title-favorite-container">
                            <h2 class="country-title" 
                                style="cursor: pointer;"
                                tabindex="0"
                                role="button"
                                aria-label="Ver detalles de ${this._country.name}">
                                ${this._country.name}
                            </h2>
                            <button class="favorite-btn">
                                ${isFavorite ? '❤️' : '🤍'}
                            </button>
                        </div>
                        ${this._country.capital ? 
                            `<div class="capital-info">
                                <span class="icon">🏛️</span>
                                <span class="capital-text">${this._country.capital}</span>
                            </div>` 
                            : '<p class="no-data">Capital no disponible</p>'
                        }
                    </div>
                </div>

                <div slot="footer" class="stats-container">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-icon">👥</span>
                            <span class="stat-title">Población</span>
                        </div>
                        <div class="stat-value">
                            ${this.formatNumber(this._country.population)}
                        </div>
                        <div class="stat-subtitle">habitantes</div>
                    </div>
                    <span class="divider"></span>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-icon">🗣️</span>
                            <span class="stat-title">Idioma(s)</span>
                        </div>
                        <div class="stat-value">
                            ${this.getLanguagesString(this._country.languages)}
                        </div>
                    </div>
                    <span class="divider"></span>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-icon">🗺️</span>
                            <span class="stat-title">Área</span>
                        </div>
                        <div class="stat-value">
                            ${this.formatNumber(this._country.area)} km²
                        </div>
                    </div>
                </div>
                
            </app-card>
        `;
        
        this.setupEventListeners();
    }
}

customElements.define('app-country-card', CountryCard);