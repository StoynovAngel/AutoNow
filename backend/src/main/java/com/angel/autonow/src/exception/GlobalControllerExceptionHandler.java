package com.angel.autonow.src.exception;

import com.angel.autonow.src.user.UserException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@ControllerAdvice
public class GlobalControllerExceptionHandler {

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UsernameNotFoundException.class)
	public ExceptionResponse handleUsernameNotFoundException(UsernameNotFoundException e) {
		log.warn(e.getMessage(), HttpStatus.UNAUTHORIZED, e);
		return new ExceptionResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserException.class)
	public ExceptionResponse handleUserException(UserException e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return new ExceptionResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	public ExceptionResponse handleException(Exception e) {
		log.warn(e.getMessage(), HttpStatus.BAD_REQUEST, e);
		return new ExceptionResponse("Unexpected exception occurred", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
