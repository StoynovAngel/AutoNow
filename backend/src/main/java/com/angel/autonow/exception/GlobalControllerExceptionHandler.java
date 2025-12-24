package com.angel.autonow.exception;

import com.angel.autonow.user.UserException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@ControllerAdvice
public class GlobalControllerExceptionHandler {

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

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(IllegalArgumentException.class)
	public ProblemDetail handleIllegalArgumentException(IllegalArgumentException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return handle(e, HttpStatus.BAD_REQUEST);
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
