package com.angel.autonow.exception;

import com.angel.autonow.user.UserException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
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
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ProblemDetail handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return handle(e, HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoResourceFoundException.class)
	public ProblemDetail handleNoResourceFoundException(NoResourceFoundException e) {
		return handle(e, HttpStatus.NOT_FOUND);
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
