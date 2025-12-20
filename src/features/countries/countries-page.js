import '@components/layout/container/container.js';
import '@countries/components/main-content/main-content.js';
import '@countries/components/favorites-list/favorites-list.js';
import style from './countries-page.css?inline';
export class CountriesPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>${style}</style>
            <app-container>
                <section id="Home" class="section active">
                    <p>COUNTRIES</p>
                    <app-main-content></app-main-content>
                </section>
                <div class="separator"></div> 
                <section id="FavoritesCountries" class="section favorites-section">
                    <p>COUNTRIES FAVORITES</p>
                    <app-favorites-list></app-favorites-list>
                </section>
            </app-container>
        `;
        
        this.setupNavigation();
    }
    setupNavigation() {
        const animateSection = (id) => {
            const section = document.getElementById(id);
            if (!section) return;

            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            section.classList.remove('visible');
            void section.offsetWidth;
            section.classList.add('visible');
        };

        const handleNavigation = () => {
            const id = location.hash.replace('#', '') || 'Home';
            animateSection(id);
        };

        window.addEventListener('hashchange', handleNavigation);
        handleNavigation();
    }
}

customElements.define('app-countries-page', CountriesPage);