import { useEffect, useRef, useState } from 'react';

/**
 * AddressInput - компонент автозаполнения адреса с Google Places API
 * 
 * @param {string} label - Метка поля
 * @param {string} placeholder - Плейсхолдер
 * @param {function} onPlaceSelected - Callback при выборе адреса, возвращает { address, lat, lng, city, placeId }
 * @param {string} value - Текущее значение (для контроллируемого компонента)
 * @param {boolean} required - Обязательное поле
 */
export default function AddressInput({
    label,
    placeholder = 'Начните вводить адрес...',
    onPlaceSelected,
    value = '',
    required = false
}) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        // Проверяем загружен ли Google Maps API
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.warn('Google Maps Places API not loaded yet');
            return;
        }

        // Инициализируем Autocomplete только один раз
        if (!autocompleteRef.current && inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    componentRestrictions: { country: 'KG' }, // Только Кыргызстан
                    fields: ['place_id', 'geometry', 'formatted_address', 'address_components'],
                    types: ['address']
                }
            );

            // Обработчик выбора места
            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    console.error('No geometry returned for selected place');
                    return;
                }

                // Извлекаем город из address_components
                let city = 'Bishkek'; // По умолчанию
                if (place.address_components) {
                    for (const component of place.address_components) {
                        if (component.types.includes('locality')) {
                            city = component.long_name;
                            break;
                        }
                        if (component.types.includes('administrative_area_level_1')) {
                            city = component.long_name;
                        }
                    }
                }

                const placeData = {
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    city: city,
                    placeId: place.place_id
                };

                setInputValue(place.formatted_address);

                if (onPlaceSelected) {
                    onPlaceSelected(placeData);
                }

                console.log('📍 Selected place:', placeData);
            });
        }
    }, [onPlaceSelected]);

    // Синхронизация с внешним value
    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required={required}
                autoComplete="off"
            />
        </div>
    );
}
