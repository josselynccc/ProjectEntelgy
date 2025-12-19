import styles from './menu.css?inline';
export class MenuItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        const label = this.getAttribute('label') || 'Menu Item';
        const link = this.getAttribute('link') || '#';
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            <li>
                <a href="${link}">${label}</a>
            </li>
        `;
    }
}

customElements.define('app-menu-item', MenuItem);