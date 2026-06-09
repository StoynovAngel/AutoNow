package com.angel.autonow.vehicle;

import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Set;

@Component
public class VehicleClassifier {

    private static final int XL_MIN_SEATS = 6;
    private static final int STANDARD_MIN_SEATS = 4;

    public Set<VehicleClass> classesFor(VehicleEntity vehicle) {
        EnumSet<VehicleClass> classes = EnumSet.noneOf(VehicleClass.class);

        Integer seats = vehicle.getNumberOfSeats();
        if (seats == null) {
            return classes;
        }

        if (seats >= XL_MIN_SEATS) {
            classes.add(VehicleClass.XL);
        } else if (seats >= STANDARD_MIN_SEATS) {
            classes.add(VehicleClass.STANDARD);
        }

        return classes;
    }

    public boolean matches(VehicleEntity vehicle, VehicleClass requested) {
        return classesFor(vehicle).contains(requested);
    }
}
