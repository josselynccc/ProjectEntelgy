import '../../components/layout/container/container.js';
export class CountriesPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <app-container></app-container>
        `;
    }
}

customElements.define('app-countries-page', CountriesPage);