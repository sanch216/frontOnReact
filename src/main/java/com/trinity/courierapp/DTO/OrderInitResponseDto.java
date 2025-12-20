package com.trinity.courierapp.DTO;

import com.trinity.courierapp.Entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class OrderInitResponseDto {

    // this orderId is temporary, used for caching only, the permanent id will be set after final confirmation
    private String orderToken;

    private double price;

    private String route;

    // this is also temporary eta, after the courier is chosen, more real eta can be calculated 
    private double durationMinutes;

    private double distanceMeters;

    private OrderTypeEnum orderType;

    private OrderStatusEnum orderStatus;

    //after finding courier
    private double finalDurationMins;

    private double courierToMins;

    private double courierToARouteMeter;

    private String courierName;

    private String courierPhoneNumber;

    private CourierStatusEnum courierStatus;

    private String vehicleNumber;

    private String courierLat;
    private String courierLng;

    private String courierToARoute;

    // the following you don't have to take in frontend, it is just for me to store in cache:
    private PaymentMethodEnum paymentMethod;

    private int courierId;

    private double priceKmRate;

    private String recipientFullName;

    private String recipientPhoneNumber;

    private VehicleTypeEnum vehicleType;

    private double srcLat;
    private double srcLng;
    private String srcAddress;
    private String srcPlaceId;

    private double destLat;
    private double destLng;
    private String destAddress;
    private String destPlaceId;

}
