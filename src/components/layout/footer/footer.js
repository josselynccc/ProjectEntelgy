export class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                footer {
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
                a {
                    text-decoration: none;
                    color: #b6dae7ff;
                    padding: 8px 16px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    display: inline-block;
                    font-size: 12px;
                }
                a:hover {
                    background-color: #1b3551ff;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                a:active {
                    transform: translateY(0);
                    box-shadow: none;
                }
                .footer-right{
                    display: flex;
                    align-items: center;
                }
            </style>
            <footer>
                <div class="footer-left">
                    <p>ENTELGY - Reto Frontend</p>
                </div>
                <div class="footer-right">
                    <a href="https://restcountries.com/v3.1/region/ame" target="_blank">API REST Countries</a>
                    <p>|</p>
                    <a href="https://github.com/josselynccc/ProjectEntelgy" target="_blank">Repositorio Git</a>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', Footer);