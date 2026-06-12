package com.angel.autonow.exception;

import com.angel.autonow.company.PricingAlreadyExistsException;
import com.angel.autonow.company.PricingNotFoundException;
import com.angel.autonow.driver.VehicleAlreadyAssignedException;
import com.angel.autonow.order.OrderConflictException;
import com.angel.autonow.order.OrderForbiddenException;
import com.angel.autonow.rating.RatingConflictException;
import com.angel.autonow.rating.RatingForbiddenException;
import com.angel.autonow.user.UserException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalControllerExceptionHandler {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);

		Map<String, String> errors = new HashMap<>();
		e.getBindingResult().getFieldErrors().forEach(error ->
			errors.put(error.getField(), error.getDefaultMessage())
		);

		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		problemDetail.setTitle("Validation failed");
		problemDetail.setDetail("One or more fields have validation errors");
		problemDetail.setProperty("errors", errors);

		return problemDetail;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(ConstraintViolationException.class)
	public ProblemDetail handleConstraintViolationException(ConstraintViolationException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);

		Map<String, String> errors = new HashMap<>();
		e.getConstraintViolations().forEach(violation ->
			errors.put(violation.getPropertyPath().toString(), violation.getMessage())
		);

		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		problemDetail.setTitle("Validation failed");
		problemDetail.setDetail("One or more constraints were violated");
		problemDetail.setProperty("errors", errors);

		return problemDetail;
	}

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UsernameNotFoundException.class)
	public ProblemDetail handleUsernameNotFoundException(UsernameNotFoundException e) {
		log.warn(e.getMessage(), HttpStatus.UNAUTHORIZED, e);
		return handle(e, HttpStatus.UNAUTHORIZED);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserException.class)
	public ProblemDetail handleUserException(UserException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return handle(e, HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(OrderConflictException.class)
	public ProblemDetail handleOrderConflictException(OrderConflictException e) {
		log.warn(e.getMessage(), HttpStatus.CONFLICT, e);
		return handle(e, HttpStatus.CONFLICT);
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(OrderForbiddenException.class)
	public ProblemDetail handleOrderForbiddenException(OrderForbiddenException e) {
		log.warn(e.getMessage(), HttpStatus.FORBIDDEN, e);
		return handle(e, HttpStatus.FORBIDDEN);
	}

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(RatingConflictException.class)
	public ProblemDetail handleRatingConflictException(RatingConflictException e) {
		log.warn(e.getMessage(), HttpStatus.CONFLICT, e);
		return handle(e, HttpStatus.CONFLICT);
	}

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(VehicleAlreadyAssignedException.class)
	public ProblemDetail handleVehicleAlreadyAssignedException(VehicleAlreadyAssignedException e) {
		log.warn(e.getMessage(), HttpStatus.CONFLICT, e);
		return handle(e, HttpStatus.CONFLICT);
	}

	@ResponseStatus(HttpStatus.CONFLICT)
	@ExceptionHandler(PricingAlreadyExistsException.class)
	public ProblemDetail handlePricingAlreadyExistsException(PricingAlreadyExistsException e) {
		log.warn(e.getMessage(), HttpStatus.CONFLICT, e);
		return handle(e, HttpStatus.CONFLICT);
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(PricingNotFoundException.class)
	public ProblemDetail handlePricingNotFoundException(PricingNotFoundException e) {
		log.warn(e.getMessage(), HttpStatus.NOT_FOUND, e);
		return handle(e, HttpStatus.NOT_FOUND);
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(RatingForbiddenException.class)
	public ProblemDetail handleRatingForbiddenException(RatingForbiddenException e) {
		log.warn(e.getMessage(), HttpStatus.FORBIDDEN, e);
		return handle(e, HttpStatus.FORBIDDEN);
	}

	@ResponseStatus(HttpStatus.FORBIDDEN)
	@ExceptionHandler(AuthorizationDeniedException.class)
	public ProblemDetail handleAuthorizationDeniedException(AuthorizationDeniedException e) {
		log.warn(e.getMessage(), HttpStatus.FORBIDDEN, e);
		return handle(e, HttpStatus.FORBIDDEN);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(IllegalArgumentException.class)
	public ProblemDetail handleIllegalArgumentException(IllegalArgumentException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return handle(e, HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ProblemDetail handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return handle(e, HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ProblemDetail handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
		log.warn("Type mismatch for parameter '{}': {}", e.getName(), e.getMessage());
		return handle(e, HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoResourceFoundException.class)
	public ProblemDetail handleNoResourceFoundException(NoResourceFoundException e) {
		return handle(e, HttpStatus.NOT_FOUND);
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(IllegalStateException.class)
	public ProblemDetail handleIllegalStateException(IllegalStateException e) {
		log.error("Illegal state exception occurred: {}", e.getMessage(), e);
		return handle(e, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(InvalidDataAccessApiUsageException.class)
	public ProblemDetail handleInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException e) {
		log.error("Invalid data access API usage: {}", e.getMessage(), e);
		return handle(e, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	public ProblemDetail handleException(Exception e) {
		log.warn(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, e);
		return handle(e, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private ProblemDetail handle(Exception e, HttpStatus status) {
		ProblemDetail problemDetail = ProblemDetail.forStatus(status);
		problemDetail.setDetail(e.getMessage());

		return problemDetail;
	}
}
