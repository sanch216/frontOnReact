package com.trinity.courierapp.Service;

import com.trinity.courierapp.DTO.CoordinateRecord;
import com.trinity.courierapp.DTO.GeocodingResult;
import com.trinity.courierapp.DTO.OrderInitResponseDto;
import com.trinity.courierapp.Entity.*;
import com.trinity.courierapp.Repository.CourierRepository;
import com.trinity.courierapp.Repository.OrderRepository;
import com.trinity.courierapp.Util.CommonUtils;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.Objects;

import static com.trinity.courierapp.Util.CommonUtils.GEOMETRY_FACTORY;
import static com.trinity.courierapp.Util.CommonUtils.toPoint;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CourierRepository courierRepository;

    @Autowired
    private GoogleMapsService googleMapsService;

    @Autowired
    private CommonUtils commonUtils;

    public Order createOrder(OrderInitResponseDto dto, User user) {
        Point srcPoint = toPoint(dto.getSrcLat(), dto.getSrcLng());
        Point destPoint = toPoint(dto.getDestLat(), dto.getDestLng());
        Courier courier = courierRepository.findById(dto.getCourierId());
        courier.setCourierStatus(CourierStatusEnum.BUSY);
        dto.setCourierStatus(CourierStatusEnum.BUSY);
        dto.setOrderStatus(OrderStatusEnum.TO_BE_PICKED_UP);
        courierRepository.save(courier);

        return new Order(srcPoint, destPoint, dto.getOrderType(), OrderStatusEnum.TO_BE_PICKED_UP,courier,user,dto.getPaymentMethod(),dto.getRecipientFullName(), BigDecimal.valueOf(dto.getPrice()),dto.getRecipientPhoneNumber(), LocalDate.now());
    }

    public CalcResult calculatePrice(String srcPlaceId, String destPlaceId, double srcLat, double srcLng, double destLat, double destLng) {

        CoordinateRecord bishkekGps = new CoordinateRecord(42.871374,74.582327);
        CoordinateRecord oshGps = new CoordinateRecord(40.526464,72.806236);

        String srcRegion = googleMapsService.getRegionFromPlaceId(srcPlaceId);
        String destRegion = googleMapsService.getRegionFromPlaceId(destPlaceId);

        OrderTypeEnum currentOrderType = OrderTypeEnum.INTER_REGION;
//        double distanceKm = commonUtils.findDistanceKm(srcGeocode.lat(), srcGeocode.lng(), destGeocode.lat(), destGeocode.lng());
        CoordinateRecord destGps = new CoordinateRecord(destLat, destLng);
        CoordinateRecord srcGps = new CoordinateRecord(srcLat, srcLng);
        Map<String, Object> directions = googleMapsService.
                doGetDirections(srcLat, srcLng, destLat, destLng);
        double distanceAtoBMeters = googleMapsService.extractDistance(directions);
        double price = 0;
        int cityRadInMeters = 15000;
        int localOrderDistance = 15000;
        double priceKmRate = 0;

        if ( (Objects.equals(srcRegion, "Bishkek") && Objects.equals(destRegion, "Bishkek"))
            ||
                (Objects.equals(srcRegion, "Osh City") && Objects.equals(destRegion, "Osh City"))
            ||
                commonUtils.twoPointsInsideCity(bishkekGps,srcGps,destGps,cityRadInMeters)
            ||
                commonUtils.twoPointsInsideCity(oshGps,srcGps,destGps,cityRadInMeters)
        ) {
            priceKmRate = 50;
            price = priceKmRate * distanceAtoBMeters/1000;
            currentOrderType = OrderTypeEnum.LOCAL;
        }
        else if (distanceAtoBMeters > localOrderDistance && (destRegion.equals("Bishkek") || destRegion.equals("Osh City"))) {
            priceKmRate = 60;
            price = priceKmRate * distanceAtoBMeters/1000;
        }
        else if (distanceAtoBMeters > localOrderDistance) {
            priceKmRate = 70;
            price = priceKmRate * distanceAtoBMeters/1000;
        }
        else if (distanceAtoBMeters < localOrderDistance) {
            priceKmRate = 55;
            price = priceKmRate * distanceAtoBMeters/1000;
            currentOrderType = OrderTypeEnum.LOCAL;
        }
        else {
            price = 1;
            return new CalcResult(price,currentOrderType, priceKmRate);
        }

        return new CalcResult(price, currentOrderType, priceKmRate);
    }


//    public String getEta(){
//
//        for courier destination
//        Map<String, Object> courierToADirections = googleMapsService.
//                doGetDirections(courier ,  , srcGeocode.lat(), srcGeocode.lng());
//        double distanceCourierToA = googleMapsService.extractDistance(courierToADirections);
//
//        Map<String, Object> courierToBDirections = googleMapsService.
//                doGetDirections(srcGeocode.lat(), srcGeocode.lng(), destGeocode.lat(), destGeocode.lng());
//        double distanceCourierToB = googleMapsService.extractDistance(courierToBDirections);

////        always add the from a to b and from courier to a
//    }


    public record CalcResult(double price, OrderTypeEnum orderType, double priceRate) {}
}
