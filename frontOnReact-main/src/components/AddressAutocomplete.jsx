import { useEffect, useRef } from 'react';

function AddressAutocomplete({ onPlaceSelected }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!window.google?.maps?.places) return;

        const widget =
            new window.google.maps.places.PlaceAutocompleteElement({
                includedRegionCodes: ['KG'],
                types: ['address']
            });

        containerRef.current.appendChild(widget);

        const handler = async (e) => {
            const place = e.placePrediction.toPlace();
            await place.fetchFields({
                fields: ['location', 'placeId', 'formattedAddress']
            });

            onPlaceSelected({
                placeId: place.placeId,
                lat: place.location.lat(),
                lng: place.location.lng(),
                address: place.formattedAddress
            });
        };

        widget.addEventListener('gmp-select', handler);

        return () => {
            widget.removeEventListener('gmp-select', handler);
            containerRef.current.innerHTML = '';
        };
    }, [onPlaceSelected]);

    return (
        <div
            ref={containerRef}
            style={{ minHeight: 48 }}
        />
    );
}

export default AddressAutocomplete;
