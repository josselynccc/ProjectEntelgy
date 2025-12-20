export const formatNumber = (num, locale = 'es-ES') => {
    if (num === null || num === undefined || num === '') return 'N/A';
    
    const number = Number(num);
    if (isNaN(number)) return 'N/A';
    
    return parseInt(number).toLocaleString(locale);
};

export const formatLanguagesObjectToString = (languages) => {
    if (!languages || typeof languages !== 'object') return 'N/A';
    
    const langValues = Object.values(languages);
    if (langValues.length === 0) return 'N/A';
    
    return langValues.join(', ');
};

export const formatCurrencies = (currencies) => {
    if (!currencies || typeof currencies !== 'object') return 'N/A';
    
    const currencyList = Object.values(currencies);
    if (currencyList.length === 0) return 'N/A';
    
    return currencyList
        .map(curr => `${curr.name} (${curr.symbol || 'sin símbolo'})`)
        .join(', ');
};

export const formatBorders = (borders, countryNames = {}) => {
    if (!Array.isArray(borders) || borders.length === 0) {
        return 'Sin fronteras terrestres';
    }
    
    if (Object.keys(countryNames).length > 0) {
        return borders
            .map(code => countryNames[code] || code)
            .join(', ');
    }
    
    return borders.join(', ');
};
