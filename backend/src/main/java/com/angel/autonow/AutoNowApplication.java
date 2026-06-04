package com.angel.autonow;

import com.angel.autonow.pricing.PricingProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(PricingProperties.class)
public class AutoNowApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoNowApplication.class, args);
    }

}
