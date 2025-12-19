import styles from './footer.css?inline';
export class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
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