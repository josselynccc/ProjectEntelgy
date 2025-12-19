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
                li {
                    list-style: none;
                    margin: 0 5px;
                    font-family: Arial, sans-serif;
                    display: inline-block;
                }
                a {
                    text-decoration: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    display: inline-block;
                    font-weight: bold;
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
            </style>
            <li>
                <a href="${link}">${label}</a>
            </li>
        `;
    }
}

customElements.define('app-menu-item', MenuItem);