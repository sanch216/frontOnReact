import { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import AddressAutocomplete from '../components/AddressAutocomplete';

function RoutePage() {
    const [center, setCenter] = useState({ lat: 42.8746, lng: 74.5698 }); // KG default

    const handlePlaceSelected = ({ lat, lng }) => {
        setCenter({ lat, lng });
    };

    return (
        <APIProvider apiKey="AIzaSyBz1c0rzoSRxUT03ymuE0UwY8ETOoSirnY" libraries={['places', 'geometry']}>
            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Left */}
                <div style={{ flex: 1, padding: 20 }}>
                    <AddressAutocomplete onPlaceSelected={handlePlaceSelected} />
                </div>

                {/* Right */}
                <div style={{ flex: 2 }}>
                    <Map
                        defaultCenter={center}
                        defaultZoom={14}
                        onCameraChanged={(e) => setCenter(e.detail.center)}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </APIProvider>
    );
}

export default RoutePage;
