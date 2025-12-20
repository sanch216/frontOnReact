import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useState, useEffect, useCallback, useMemo } from 'react';

const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
    marginTop: '16px'
};

// Центр по умолчанию - Бишкек
const defaultCenter = {
    lat: 42.8746,
    lng: 74.5698
};

// Библиотеки Google Maps, которые нам нужны
const libraries = ['places'];

/**
 * OrderMapPreview - карта для предварительного просмотра маршрута в модальном окне
 * 
 * @param {object} srcLocation - { lat, lng } точки отправления
 * @param {object} destLocation - { lat, lng } точки назначения
 * @param {function} onRouteCalculated - Callback с данными маршрута { distance, duration }
 */
export default function OrderMapPreview({ srcLocation, destLocation, onRouteCalculated }) {
    const [directions, setDirections] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    // Загрузка Google Maps API
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // Мемоизируем иконки маркеров
    const markerIcons = useMemo(() => {
        if (!isLoaded) return { src: null, dest: null };

        return {
            src: {
                url: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                        <circle cx="12" cy="12" r="10" fill="#22c55e" stroke="white" stroke-width="2"/>
                        <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">A</text>
                    </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16)
            },
            dest: {
                url: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                        <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                        <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">B</text>
                    </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16)
            }
        };
    }, [isLoaded]);

    // Центрируем карту при изменении точек
    useEffect(() => {
        if (srcLocation && destLocation) {
            // Центрируем между двумя точками
            setMapCenter({
                lat: (srcLocation.lat + destLocation.lat) / 2,
                lng: (srcLocation.lng + destLocation.lng) / 2
            });
        } else if (srcLocation) {
            setMapCenter(srcLocation);
        } else if (destLocation) {
            setMapCenter(destLocation);
        }
    }, [srcLocation, destLocation]);

    // Строим маршрут когда есть обе точки
    useEffect(() => {
        if (!isLoaded || !srcLocation || !destLocation) {
            setDirections(null);
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: srcLocation,
                destination: destLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    setDirections(result);

                    // Извлекаем данные о маршруте
                    const route = result.routes[0];
                    if (route && route.legs && route.legs[0]) {
                        const leg = route.legs[0];
                        const routeData = {
                            distance: leg.distance.value, // в метрах
                            distanceText: leg.distance.text,
                            duration: leg.duration.value / 60, // в минутах
                            durationText: leg.duration.text
                        };

                        console.log('🗺️ Route calculated:', routeData);

                        if (onRouteCalculated) {
                            onRouteCalculated(routeData);
                        }
                    }
                } else {
                    console.error('Directions request failed:', status);
                    setDirections(null);
                }
            }
        );
    }, [isLoaded, srcLocation, destLocation, onRouteCalculated]);

    // Опции для DirectionsRenderer (скрываем стандартные маркеры, используем свои)
    const directionsOptions = useMemo(() => ({
        suppressMarkers: true, // Скрываем стандартные маркеры A/B
        polylineOptions: {
            strokeColor: '#3b82f6',
            strokeWeight: 5,
            strokeOpacity: 0.8
        }
    }), []);

    // Обработка ошибок загрузки
    if (loadError) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                background: '#fef2f2',
                borderRadius: '12px',
                color: '#dc2626'
            }}>
                ❌ Ошибка загрузки карты
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f5f9',
                borderRadius: '12px',
                marginTop: '16px'
            }}>
                <span>🗺️ Загрузка карты...</span>
            </div>
        );
    }

    // Если нет ни одной точки - показываем подсказку
    if (!srcLocation && !destLocation) {
        return (
            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                borderRadius: '12px',
                marginTop: '16px',
                border: '2px dashed #cbd5e1',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <span style={{ fontSize: '32px' }}>📍</span>
                <span style={{ color: '#64748b' }}>Введите адреса для отображения маршрута</span>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={srcLocation && destLocation ? 12 : 14}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true
            }}
        >
            {/* Маркер точки А (откуда) */}
            {srcLocation && (
                <Marker
                    position={srcLocation}
                    icon={markerIcons.src}
                    title="Точка отправления (A)"
                />
            )}

            {/* Маркер точки Б (куда) */}
            {destLocation && (
                <Marker
                    position={destLocation}
                    icon={markerIcons.dest}
                    title="Точка назначения (B)"
                />
            )}

            {/* Маршрут между точками */}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={directionsOptions}
                />
            )}
        </GoogleMap>
    );
}
