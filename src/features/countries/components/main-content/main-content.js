import { countryService } from '@countries/services/countries-service.js';
import styles from './main-content.css?inline';
import '../country-card/country-card.js';
export class MainContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.countries = [];
        this.isLoading = false;
        this.error = null;
    }
    
    async connectedCallback() {
        await this.loadCountries();
        this.render();
    }
    
    async loadCountries() {
        this.isLoading = true;
        this.error = null;
        this.render();
        
        try {
            this.countries = await countryService.getCountries();
            
            this.dispatchEvent(new CustomEvent('countries-loaded', {
                bubbles: true,
                detail: { count: this.countries.length }
            }));
            
        } catch (error) {
            this.error = error.message || 'Error loading countries';
            console.error('countries error:', error);
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    addEventListeners() {
        const retryBtn = this.shadowRoot.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadCountries());
        }
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            
            <div class="countries-grid">
                ${this.isLoading ? `
                    <div class="loading">
                        <div class="spinner">⏳</div>
                        <p>Cargando países...</p>
                    </div>
                ` : this.error ? `
                    <div class="error">
                        <p>${this.error}</p>
                        <button class="retry-btn">Reintentar</button>
                    </div>
                ` : `
                    ${this.countries.map((country, index) => {
                        const data = country.cardData || country;
                        const modalData = country.modalData || country;
                        
                        const jsonStr = JSON.stringify(data);
                        const escaped = jsonStr.replace(/"/g, '&quot;');

                        const jsonStrModal = JSON.stringify(modalData);
                        const escapedModal = jsonStrModal.replace(/"/g, '&quot;');
                        return `
                            <app-country-card 
                                data-index="${index}"
                                data-country="${escaped}"
                                data-country-modal="${escapedModal}"
                            ></app-country-card>
                        `;
                    }).join('')}
                `}
            </div>
        `;
        
        this.addEventListeners();
    }
}

customElements.define('app-main-content', MainContent);