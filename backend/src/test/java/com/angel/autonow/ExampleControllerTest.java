package com.angel.autonow;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ExampleControllerTest {

	@Test
	void exampleEndpoint() {
		String result = new ExampleController().exampleEndpoint();
		assertEquals("hello", result);
	}
}