import globe from '../../../assets/logo.png';
import '../menu/menu.js';
import styles from './header.css?inline';
export class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            <header>
                <div class="header-left">
                    <div class="logo">
                        <img src="${globe}" alt="GlobeIcon" />
                    </div>
                    <h1>Countries Info</h1>
                </div>
                <app-menu></app-menu>
            </header>
        `;
    }
}

customElements.define('app-header', Header);