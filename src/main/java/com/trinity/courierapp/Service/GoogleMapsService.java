package com.trinity.courierapp.Service;

import com.trinity.courierapp.DTO.GeocodingResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class GoogleMapsService {



    @Value("${google.maps.api.key}")
    public String apiKey;

    private final RestTemplate restTemplate;
    public GoogleMapsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> doGetDirections(double startLat, double startLng, double endLat, double endLng) {
        String url = String.format(
                "https://maps.googleapis.com/maps/api/directions/json?origin=%f,%f&destination=%f,%f&key=%s",
                startLat, startLng, endLat, endLng, apiKey
        );
        return restTemplate.getForObject(url, Map.class);
    }

    public String extractPolyline(Map<String, Object> directionsJson) {
        Map<String, Object> firstRoute = ((List<Map<String, Object>>) directionsJson.get("routes")).get(0);
        return (String) ((Map<String, Object>) firstRoute.get("overview_polyline")).get("points");
    }

    public double extractDistance(Map<String, Object> directionsJson) {
        Map<String, Object> firstLeg = ((List<Map<String, Object>>) ((List<Map<String, Object>>) directionsJson.get("routes")).get(0).get("legs")).get(0);
        return ((Number) ((Map<String, Object>) firstLeg.get("distance")).get("value")).doubleValue();
    }

    public double extractDuration(Map<String, Object> directionsJson) {
        Map<String, Object> firstLeg = ((List<Map<String, Object>>) ((List<Map<String, Object>>) directionsJson.get("routes")).get(0).get("legs")).get(0);
        return ((Number) ((Map<String, Object>) firstLeg.get("duration")).get("value")).doubleValue();
    }

    public double getRouteDistance(double startLat, double startLng, double endLat, double endLng) {
        Map<String, Object> directionsJson = doGetDirections(startLat, startLng, endLat, endLng);
        Map<String, Object> firstLeg = ((List<Map<String, Object>>) ((List<Map<String, Object>>) directionsJson.get("routes")).get(0).get("legs")).get(0);
        return ((Number) ((Map<String, Object>) firstLeg.get("distance")).get("value")).doubleValue();
    }

    public String getRegionFromPlaceId(String placeId) {
        String url = "https://maps.googleapis.com/maps/api/place/details/json" +
                "?place_id=" + placeId +
                "&fields=address_component" +
                "&key=" + apiKey;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null) {
            throw new IllegalStateException("No response from Google Places API");
        }

        Map<String, Object> result = (Map<String, Object>) response.get("result");
        if (result == null) {
            throw new IllegalArgumentException("No result found for placeId: " + placeId);
        }

        List<Map<String, Object>> components = (List<Map<String, Object>>) result.get("address_components");
        if (components == null) {
            throw new IllegalArgumentException("No address components found for placeId: " + placeId);
        }

        for (Map<String, Object> comp : components) {
            List<String> types = (List<String>) comp.get("types");
            if (types != null && types.contains("administrative_area_level_1")) {
                return (String) comp.get("long_name"); // region/state
            }
        }

        return null; // fallback if no region found
    }



}
