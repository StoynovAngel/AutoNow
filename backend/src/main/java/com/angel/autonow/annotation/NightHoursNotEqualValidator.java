package com.angel.autonow.annotation;

import com.angel.autonow.company.CompanyPricingRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NightHoursNotEqualValidator implements ConstraintValidator<NightHoursNotEqual, CompanyPricingRequestDTO> {

    @Override
    public boolean isValid(CompanyPricingRequestDTO dto, ConstraintValidatorContext context) {
        if (dto.nightStartHour() == null || dto.nightEndHour() == null) return true;
        return !dto.nightStartHour().equals(dto.nightEndHour());
    }
}
