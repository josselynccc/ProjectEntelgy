import styles from './modal.css?inline';
export class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._isOpen = false;
    }
    
    open() {
        this._isOpen = true;
        this.render();
        this.style.display = 'block';
    }
    
    close() {
        this._isOpen = false;
        this.style.display = 'none';
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
               ${styles}
            </style>
            <div class="modal-overlay">
                <div class="modal-content">
                    <slot name="header"></slot>
                    <slot name="body"></slot>
                    <slot name="footer"></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('app-modal', Modal);