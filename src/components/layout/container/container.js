import '../header/header.js';
import '../footer/footer.js';
export class Container extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    width: 100%;
                    display: block;
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                }
                .layout {
                    display: flex;
                    min-height: calc(100vh - 100px);
                    justify-content: space-between;
                    flex-direction: column;
                    padding: 50px 0 50px 0;
                }
                .slot-wrapper {
                    flex: 1;
                    background-color: #f5f7fa;
                    padding: 20px;
                    border-radius: 8px;
                }
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