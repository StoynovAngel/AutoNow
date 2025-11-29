package com.angel.autonow;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class ExampleController {

	@GetMapping
	public String exampleEndpoint() {
		return "hello";
	}
}
