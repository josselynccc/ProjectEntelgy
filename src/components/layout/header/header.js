import globe from '../../../assets/logo.png';
import '../menu/menu.js';
export class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    width: auto;
                    background: linear-gradient(135deg, #1e3a5f, #2b4f7a);
                    padding: 1rem;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                h1 {
                    margin: 0;
                    font-size: 1.5rem;   
                }
                .logo {
                    width: 40px;
                    height: 40px;
                    background-color: white;
                    border-radius: 50%;
                }
                img {
                    height: 40px;
                    width: auto;    
                }
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