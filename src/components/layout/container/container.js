import '../header/header.js';
import '../footer/footer.js';
import styles from './container.css?inline';
export class Container extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            <div class="layout">
                <app-header></app-header>
                <div class="slot-wrapper">
                    <slot></slot>
                </div>
                <app-footer></app-footer>
            </div>
        `;
    }
}

customElements.define('app-container', Container);