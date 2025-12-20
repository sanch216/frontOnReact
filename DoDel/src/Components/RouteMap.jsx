import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px'
};

const center = {
    lat: 42.8746,
    lng: 74.5698 // Бишкек
};

export default function RouteMap({ srcAddress, destAddress }) {
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        if (isLoaded && srcAddress && destAddress) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: srcAddress,
                    destination: destAddress,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);
                        setError(null);
                    } else {
                        setError('Не удалось построить маршрут');
                        console.error('Directions request failed:', status);
                    }
                }
            );
        }
    }, [isLoaded, srcAddress, destAddress]);

    if (!isLoaded) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка карты...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
        >
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    );
}
