import { ApiClient } from '../../../core/services/api.js';
export class CountryService {
    constructor() {
        this.api = new ApiClient('https://restcountries.com/v3.1');
    }

    async getCountries() {
        try {
            const countries = await this.api.get('/region/ame');
            return countries.slice(0,12).map(country => this.transformCountryData(country));
        } catch (error) {
            console.error('API error getCountries', error);
            throw error;
        }
    }

    transformCountryData(apiData) {
        const cardData = {
            id: apiData.cca3,
            flag: apiData.flags?.svg,
            name: apiData.name?.common,
            capital: apiData.capital?.[0],
            population: apiData.population,
            area: apiData.area,
            languages: apiData.languages
        }
        return {
            cardData: cardData,
            modalData: {
                ...cardData,
                // Datos de ubicacion
                region: apiData.region || '',
                subregion: apiData.subregion || '',
                continent: apiData.continents?.[0] || '',
                latlng: apiData.latlng || [],
                timezones: apiData.timezones || [],
                borders: apiData.borders || [],
                
                // Datos políticos/económicos
                independent: apiData.independent || false,
                unMember: apiData.unMember || false,
                status: apiData.status || '',
                currencies: apiData.currencies || {},
                idd: apiData.idd || {}, // Código telefónico
                fifa: apiData.fifa || '', // Código FIFA
                
                // Datos de bandera
                flagDescription: apiData.flags?.alt || '',
                coatOfArms: apiData.coatOfArms?.png || apiData.coatOfArms?.svg || '',
                
                // Dato de mapa
                googleMaps: apiData.maps?.googleMaps || '',
                openStreetMaps: apiData.maps?.openStreetMaps || '',
                
                // gentilicio
                demonyms: apiData.demonyms || {},
                
                // capital info
                capitalInfo: apiData.capitalInfo || {},
            }
        };
    }
}

export const countryService = new CountryService();