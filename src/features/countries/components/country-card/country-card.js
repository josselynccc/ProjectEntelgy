import styles from './country-card.css?inline';
import '../..//../../components/ui/card/card.js';
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
        }

        this._isFavorite = false;
        this._isLoading = true

        this._needUpdate = false;
        this._updateScheduled = false;
    }

    static get observedAttributes() {
        return ['data-country'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        if (name === 'data-country' && newValue) {
            try {
                const data = JSON.parse(newValue);
                this.country = data;
            } catch (error) {
                console.warn('Error parsing country data:', error);
            }
        }
    }

    get country() {
        return this._country;
    }

    get favorite() {
        return this._isFavorite;
    }
    
    set country(data) {
        if (typeof data !== 'object') return;
        
        this._country = { ...this._country, ...data };
        this._isLoading = false;
        this._needUpdate = true;
        this.scheduleUpdate();
    }

    set favoriteCountry(isFav) {
        if (this._isFavorite === isFav) return;
        this._isFavorite = isFav;
        this._needUpdate = true;
        this.scheduleUpdate();

        this.dispatchEvent(new CustomEvent('favorite-changed', {
            detail: { 
                country: this._country,
                isFavorite: this._isFavorite 
            },
            bubbles: true,
            composed: true,
        }));
    }

    formatNumber(num) {
        if (!num || isNaN(num)) return 'N/A';
        return parseInt(num).toLocaleString('es-ES');
    }

    getLanguagesString(langs) {
        return Object.values(langs).join(', ');
    }

    showDetails() {
        this.dispatchEvent(new CustomEvent('show-details', {
            bubbles: true,
            composed: true,
            detail: {
                country: this._country,
                isFavorite: this._isFavorite
            }
        }));
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
        
        shadow.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('favorite-btn')) {
                e.stopPropagation();
                this.favoriteCountry = !this._isFavorite;
            }
            
            if (target.classList.contains('country-title')) {
                e.stopPropagation();
                this.showDetails();
            }
        });
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
                    
                    <button class="favorite-btn">
                        ${this._isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
                
                <div slot="content" class="country-content">
                    <div class="country-info">
                        <h2 class="country-title" 
                            style="cursor: pointer;"
                            tabindex="0"
                            role="button"
                            aria-label="Ver detalles de ${this._country.name}">
                            ${this._country.name}
                        </h2>
                        
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