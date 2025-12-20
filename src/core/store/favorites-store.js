const FavoriteStore = {
    _favorites: [],

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
        }
    },

    remove(countryId) {
        this._favorites = this._favorites.filter(fav => fav.id !== countryId);
        this._save();
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
    }
};

FavoriteStore._init();

export default FavoriteStore;