import styles from './country-modal.css?inline';
import '@components/ui/modal/modal.js'
import { 
    formatNumber, 
    formatLanguagesObjectToString, 
    formatBorders,
    formatCurrencies
} from '../../utils/format.js';
export class CountryModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = null;
        this._isFavorite = false;
        this._isOpen = false;
    }

    static get observedAttributes() {
        return ['data-country', 'data-is-favorite'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'data-country') {
            try {
                this._data = JSON.parse(newValue);
                this.render();
            } catch (error) {
                console.warn('Error parsing country data in modal:', error);
            }
        }
        if (name === 'data-is-favorite') {
            this._isFavorite = newValue === 'true';
            this.renderFavoriteBadge();
        }
    }

    open(countryData, isFavorite = false) {
        const existingModal = document.querySelector('country-modal');
        if (existingModal) {
            existingModal.remove();
        }

        this._data = countryData;
        console.log(this._data)
        this._isFavorite = isFavorite;
        this._isOpen = true;

        if (!this.parentNode) {
            document.body.appendChild(this);
        }
        this.style.display = 'block';

        requestAnimationFrame(() => {
            this.shadowRoot.querySelector('.modal-overlay')?.classList.add('open');
            this.shadowRoot.querySelector('.modal-content')?.classList.add('open');
        });
        
        document.body.style.overflow = 'hidden';
    }

    close() {
        this._isOpen = false;
        
        const overlay = this.shadowRoot.querySelector('.modal-overlay');
        const content = this.shadowRoot.querySelector('.modal-content');
        
        if (overlay) overlay.classList.remove('open');
        if (content) content.classList.remove('open');
        
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
            document.body.style.overflow = 'auto';
            this.dispatchEvent(new CustomEvent('modal-closed'));
        }, 300);
    }

    renderFavoriteBadge() {
        const favoriteBadge = this.shadowRoot.querySelector('.favorite-badge');
        if (favoriteBadge) {
            favoriteBadge.style.display = this._isFavorite ? 'flex' : 'none';
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const shadow = this.shadowRoot;
        if (!shadow) return;

        shadow.querySelector('.modal-close')?.addEventListener('click', () => this.close());
        shadow.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });

        shadow.querySelector('.open-maps')?.addEventListener('click', () => {
            if (this._data?.googleMaps) {
                window.open(this._data.googleMaps, '_blank');
            }
        });

        shadow.querySelector('.close-btn')?.addEventListener('click', () => this.close());
    }

    render() {
        if (!this._data) {
            this.shadowRoot.innerHTML = `
                <style>${styles}</style>
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-body">Cargando...</div>
                    </div>
                </div>
            `;
            return;
        }
        
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="modal-overlay">
                <div class="modal-content">
                    <!-- Header del modal -->
                    <div class="modal-header">
                        <button class="modal-close" aria-label="Cerrar">×</button>
                        <div class="header-top">
                            ${this._isFavorite ? 
                                `<div class="favorite-badge">
                                    <span class="badge-icon">❤️</span>
                                    <span class="badge-text">Favorito</span>
                                </div>` 
                                : ''
                            }
                        </div>
                        
                        <div class="header-content">
                            <div class="country-flag">
                                ${this._data.flag ? 
                                    `<img src="${this._data.flag}" 
                                          alt="Bandera de ${this._data.name}" 
                                          class="flag-image">` 
                                    : '<div class="flag-placeholder">🏳️</div>'
                                }
                            </div>
                            <div class="country-titles">
                                <h2 class="country-name">${this._data.name}</h2>
                                <p class="country-official">${this._data.capital || 'Capital no disponible'}</p>
                                <div class="country-subtitle">
                                    <span class="country-region">${this._data.region || ''}</span>
                                    ${this._data.subregion ? `<span class="country-subregion"> • ${this._data.subregion}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cuerpo del modal -->
                    <div class="modal-body">
                        <div class="sections-container">
                            <!-- Sección: Estadísticas principales -->
                            <section class="stats-section">
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-icon">👥</div>
                                        <div class="stat-content">
                                            <div class="stat-label">Población</div>
                                            <div class="stat-value">${formatNumber(this._data.population)}</div>
                                            <div class="stat-unit">habitantes</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-item">
                                        <div class="stat-icon">🗺️</div>
                                        <div class="stat-content">
                                            <div class="stat-label">Área</div>
                                            <div class="stat-value">${formatNumber(this._data.area)}</div>
                                            <div class="stat-unit">km²</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-item">
                                        <div class="stat-icon">🗣️</div>
                                        <div class="stat-content">
                                            <div class="stat-label">Idiomas</div>
                                            <div class="stat-value">${formatLanguagesObjectToString(this._data.languages)}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-item">
                                        <div class="stat-icon">💰</div>
                                        <div class="stat-content">
                                            <div class="stat-label">Moneda</div>
                                            <div class="stat-value">${formatCurrencies(this._data.currencies)}</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Sección: Información detallada -->
                            <div class="detailed-grid">
                                <!-- Columna izquierda -->
                                <div class="detail-column">
                                    <section class="detail-section">
                                        <h3 class="section-title">📍 Ubicación</h3>
                                        <div class="detail-content">
                                            <div class="detail-item">
                                                <span class="detail-label">Continente:</span>
                                                <span class="detail-value">${this._data.continent || 'N/A'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Región:</span>
                                                <span class="detail-value">${this._data.region || 'N/A'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Subregión:</span>
                                                <span class="detail-value">${this._data.subregion || 'N/A'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Fronteras:</span>
                                                <span class="detail-value">${formatBorders(this._data.borders)}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section class="detail-section">
                                        <h3 class="section-title">🏛️ Política</h3>
                                        <div class="detail-content">
                                            <div class="detail-item">
                                                <span class="detail-label">Estado:</span>
                                                <span class="detail-value">${this._data.status || 'N/A'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Independiente:</span>
                                                <span class="detail-value">${this._data.independent ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">ONU:</span>
                                                <span class="detail-value">${this._data.unMember ? 'Miembro' : 'No miembro'}</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Código FIFA:</span>
                                                <span class="detail-value">${this._data.fifa || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <!-- Columna derecha -->
                                <div class="detail-column">
                                    <section class="detail-section">
                                        <h3 class="section-title">⏰ Zonas horarias</h3>
                                        <div class="detail-content">
                                            <div class="timezone-list">
                                                ${this._data.timezones && this._data.timezones.length > 0 ? 
                                                    this._data.timezones.map(tz => `
                                                        <div class="timezone-item">
                                                            <span class="timezone-badge">${tz}</span>
                                                        </div>
                                                    `).join('') 
                                                    : '<div class="no-data">No disponible</div>'
                                                }
                                            </div>
                                        </div>
                                    </section>

                                    <section class="detail-section">
                                        <h3 class="section-title">🎌 Símbolos</h3>
                                        <div class="detail-content">
                                            <div class="symbols-grid">
                                                ${this._data.coatOfArms ? 
                                                    `<div class="symbol-item">
                                                        <div class="symbol-label">Escudo de armas:</div>
                                                        <img src="${this._data.coatOfArms}" 
                                                             alt="Escudo de armas de ${this._data.name}"
                                                             class="coat-of-arms"
                                                             onerror="this.style.display='none'">
                                                    </div>` 
                                                    : ''
                                                }
                                                <div class="symbol-item">
                                                    <div class="symbol-label">Código telefónico:</div>
                                                    <div class="symbol-value">${this._data.idd?.root || ''}${this._data.idd?.suffixes?.[0] || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <!-- Sección: Enlaces -->
                            <section class="links-section">
                                <h3 class="section-title">🔗 Más información</h3>
                                <div class="links-grid">
                                    ${this._data.googleMaps ? 
                                        `<a href="${this._data.googleMaps}" 
                                            target="_blank" 
                                            class="link-button open-maps">
                                            <span class="link-icon">🗺️</span>
                                            <span>Ver en Google Maps</span>
                                        </a>` 
                                        : ''
                                    }
                                    ${this._data.openStreetMaps ? 
                                        `<a href="${this._data.openStreetMaps}" 
                                            target="_blank" 
                                            class="link-button">
                                            <span class="link-icon">🌍</span>
                                            <span>OpenStreetMap</span>
                                        </a>` 
                                        : ''
                                    }
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- Footer del modal -->
                    <div class="modal-footer">
                        <button class="close-btn">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.renderFavoriteBadge();
    }
}

customElements.define('country-modal', CountryModal);