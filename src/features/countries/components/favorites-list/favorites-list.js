import FavoriteStore from '@core/store/favorites-store.js';
import styles from './favorites-list.css?inline';

export class FavoritesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._unsubscribe = null;
    }
    
    connectedCallback() {
        this.subscribeToStore();
        this.render();
    }
    
    disconnectedCallback() {
        if (this._unsubscribe) this._unsubscribe();
    }
    
    subscribeToStore() {
        this._unsubscribe = FavoriteStore.subscribe(() => this.render());
    }
    
    render() {
        const favorites = FavoriteStore.getAll();
        
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
            </style>
            <div class="header">
                <span class="title">⭐ Favorites</span>
                <span class="count">${favorites.length}</span>
            </div>
            
            <div class="list">
                ${favorites.length === 0 
                    ? '<div class="empty">No favorites yet</div>'
                    : favorites.map(fav => `
                        <div class="item" data-id="${fav.id}">
                            <img src="${fav.flag}" class="flag" alt="${fav.name}">
                            <span class="name">${fav.name}</span>
                            <button class="remove" data-id="${fav.id}">×</button>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        this.shadowRoot.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                FavoriteStore.remove(btn.dataset.id);
            });
        });
        
        this.shadowRoot.querySelectorAll('.item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove')) {
                    this.dispatchEvent(new CustomEvent('view-country', {
                        detail: { countryId: item.dataset.id },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        });
    }
}

customElements.define('app-favorites-list', FavoritesList);