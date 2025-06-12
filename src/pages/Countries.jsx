import { useEffect, useState } from 'react';
import { countriesService } from '../services/countries.service'

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCountries = async () => {
        try {
            const response = await countriesService.getCountries();
            console.log('API Response:', response);
            
            // Handle different response structures
            let countriesData = [];
            if (response && Array.isArray(response)) {
                countriesData = response;
            } else if (response && Array.isArray(response.data)) {
                countriesData = response.data;
            } else if (response && response.data) {
                // If it's a single object, wrap it in an array
                countriesData = [response.data];
            } else if (response) {
                // If it's a single object directly in response
                countriesData = [response];
            }
            
            console.log('Processed countries data:', countriesData);
            setCountries(countriesData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setError(error);
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCountries();
    }, []);
    
    return (
        <div className="max-w-4xl p-6">
            <h1 className="text-2xl font-bold mb-6">Ülkeler</h1>
            {isLoading ? (
                <p>Yükleniyor...</p>
            ): (
                <div>
                    {countries && countries.length > 0 ? (
                        <ul className="space-y-2">
                            {countries.map((country) => (
                                <li key={country.id} className="p-3 border rounded hover:bg-gray-50">
                                    {country.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Herhangi bir ülke bulunamadı.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Countries