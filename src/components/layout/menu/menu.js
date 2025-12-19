import './menu-item.js';
export class Menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.menuItems = [
            { label: 'Home', link: '#Home' },
            { label: 'Favorites Countries', link: '#FavoritesCountries' }
        ];
    }
    connectedCallback() {
        const itemsHTML = this.menuItems.map(item => 
            `<app-menu-item label="${item.label}" link="${item.link}"></app-menu-item>`
        ).join('');

        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <ul>
                ${itemsHTML}
            </ul>
        `;
    }
}

customElements.define('app-menu', Menu);