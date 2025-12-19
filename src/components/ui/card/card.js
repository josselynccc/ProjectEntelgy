import style from './card.css?inline';

export class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <article class="card" part="card">
                <div class="card-header">
                    <slot name="header"></slot>
                </div>
                <div class="card-content">
                    <slot name="content"></slot>
                    <slot></slot>
                </div>
                <div class="card-footer">
                    <slot name="footer"></slot>
                </div>
            </article>
        `;
    }
}

customElements.define('app-card', Card);