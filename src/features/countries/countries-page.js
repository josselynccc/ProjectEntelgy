import '../../components/layout/container/container.js';
import '../countries/components/main-content/main-content.js';
export class CountriesPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <app-container>
                <app-main-content></app-main-content>
            </app-container>
        `;
    }
}

customElements.define('app-countries-page', CountriesPage);