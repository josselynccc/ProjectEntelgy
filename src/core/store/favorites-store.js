const FavoriteStore = {
    _favorites: [],
    _listeners: new Set(),

    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    },

    _notify() {
        this._listeners.forEach(listener => listener());
    },

    getAll() {
        return [...this._favorites];
    },

    isFavorite(countryId) {
        return this._favorites.some(fav => fav.id === countryId);
    },

    add(country) {
        if (!this.isFavorite(country.id)) {
            this._favorites.push({
                id: country.id,
                name: country.name,
                flag: country.flag
            });
            this._save();
            this._notify();
        }
    },

    remove(countryId) {
        this._favorites = this._favorites.filter(fav => fav.id !== countryId);
        this._save();
        this._notify();
    },

    toggle(country) {
        if (this.isFavorite(country.id)) {
            this.remove(country.id);
        } else {
            this.add(country);
        }
    },

    _save() {
        localStorage.setItem('favorites', JSON.stringify(this._favorites));
    },

    _init() {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            try {
                this._favorites = JSON.parse(saved);
            } catch (e) {
                this._favorites = [];
            }
        }
        this._notify();
    }
};

FavoriteStore._init();

export default FavoriteStore;