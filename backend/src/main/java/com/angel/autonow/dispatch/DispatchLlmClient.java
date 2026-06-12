package com.angel.autonow.dispatch;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.order.OrderResponseDTO;

import java.util.List;

public interface DispatchLlmClient {
	DispatchSuggestionDTO suggestDriver(OrderResponseDTO order, List<DriverEntity> candidates);
}
