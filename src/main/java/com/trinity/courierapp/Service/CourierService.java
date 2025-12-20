package com.trinity.courierapp.Service;

import com.trinity.courierapp.DTO.GeocodingResult;
import com.trinity.courierapp.DTO.OrderInitResponseDto;
import com.trinity.courierapp.Entity.Courier;
import com.trinity.courierapp.Repository.CourierRepository;
import com.trinity.courierapp.Util.CommonUtils;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourierService {

    @Autowired
    private CourierRepository courierRepository;

    @Autowired
    private CommonUtils commonUtils;

    // searching for courier in 100 km radius
    public FindCourierResult findNearestCourierFurther(OrderInitResponseDto dto) {
        boolean found = false;
        String srcAddress = dto.getSrcAddress();
        //radius in meters to cut of the search area
        double MAX_DISTANCE= 100_000;

        List<Courier> candidates =
                courierRepository.findEligibleCouriers(
                        dto.getSrcLat(),
                        dto.getSrcLng(),
                        MAX_DISTANCE,
                        dto.getVehicleType()
                );
        Courier nearest = null;
        double minRouteDistance = MAX_DISTANCE;
        double routeDist = 0;

        for (Courier c : candidates) {
            routeDist = commonUtils.getDistanceAtoBMeters(c.getCourierGps(), dto.getSrcLng(), dto.getSrcLat());

            if (routeDist <= MAX_DISTANCE && routeDist < minRouteDistance) {
                minRouteDistance = routeDist;
                nearest = c;
            }
        }

        double finalPrice = dto.getPrice() + routeDist * dto.getPriceKmRate() * 0.5;
        double durationMins = dto.getDurationMinutes();
        assert nearest != null;
        Point courierCoords = nearest.getCourierGps();
        String courierToARoute = commonUtils.getRouteAtoB(courierCoords,dto.getSrcLng(),dto.getSrcLat());
        double courierToAMins = commonUtils.getDurationAtoBMinutes(courierCoords,dto.getSrcLng(),dto.getSrcLat());
        double finalDuration = courierToAMins + durationMins;
        int courierId = nearest.getId();


        return new FindCourierResult(true, finalDuration,finalPrice,courierToARoute,courierToAMins,routeDist,courierId);
    }

    //searching for courier in 10 km radius
    public FindCourierResult findNearestCourier(OrderInitResponseDto dto) {
        String srcAddress = dto.getSrcAddress();
        //radius in meters to cut of the search area
        double MAX_DISTANCE= 10_000;

        List<Courier> candidates =
                courierRepository.findEligibleCouriers(
                        dto.getSrcLat(),
                        dto.getSrcLng(),
                        MAX_DISTANCE,
                        dto.getVehicleType()
                );
        Courier nearest = null;
        double minRouteDistance = MAX_DISTANCE;
        double routeDist = 0;

        for (Courier c : candidates) {
            routeDist = commonUtils.getDistanceAtoBMeters(c.getCourierGps(), dto.getSrcLng(), dto.getSrcLat());

            if (routeDist <= MAX_DISTANCE && routeDist < minRouteDistance) {
                minRouteDistance = routeDist;
                nearest = c;
            }
        }

        double finalPrice = dto.getPrice();
        double durationMins = dto.getDurationMinutes();
        assert nearest != null;
        Point courierCoords = nearest.getCourierGps();
        String courierToARoute = commonUtils.getRouteAtoB(courierCoords,dto.getSrcLng(),dto.getSrcLat());
        double courierToAMins = commonUtils.getDurationAtoBMinutes(courierCoords,dto.getSrcLng(),dto.getSrcLat());
        double finalDuration = courierToAMins + durationMins;
        int courierId = nearest.getId();

        return new FindCourierResult(true,finalDuration,finalPrice,courierToARoute,courierToAMins,routeDist,courierId);
    }

    public record FindCourierResult(boolean found, double newDuration, double newPrice, String courierToARoute, double courierToAMinutes, double routeCourierToADist, int courierId) {}

}

