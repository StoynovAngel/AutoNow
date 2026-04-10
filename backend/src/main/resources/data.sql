-- Users (passwords are BCrypt hashed for 'password123')
INSERT INTO users (email, password) VALUES
    ('admin@autonow.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.jLMYwB1czXG0IuMqHO'),
    ('john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.jLMYwB1czXG0IuMqHO'),
    ('jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.jLMYwB1czXG0IuMqHO');

-- User authorities
INSERT INTO user_authorities (user_id, authorities)
SELECT id, 'ROLE_ADMIN' FROM users WHERE email = 'admin@autonow.com';
INSERT INTO user_authorities (user_id, authorities)
SELECT id, 'ROLE_CUSTOMER' FROM users WHERE email = 'admin@autonow.com';
INSERT INTO user_authorities (user_id, authorities)
SELECT id, 'ROLE_CUSTOMER' FROM users WHERE email = 'john.doe@example.com';
INSERT INTO user_authorities (user_id, authorities)
SELECT id, 'ROLE_CUSTOMER' FROM users WHERE email = 'jane.smith@example.com';

-- Companies
INSERT INTO company (name, address, phone, email, description, company_type, created_at, updated_at) VALUES
    ('AutoNow Fleet Services', '100 Business Park Blvd, Sofia', '+3590888123456', 'fleet@autonow.com', 'Premium taxi and logistics services in Sofia', 'TAXI', NOW(), NOW()),
    ('MedTransport BG', '25 Hospital St, Sofia', '+3590888654321', 'info@medtransport.bg', 'Specialized ambulance and medical transport', 'AMBULANCE', NOW(), NOW());

-- Link admin user to company and add COMPANY_ADMIN authority
UPDATE users SET company_id = (SELECT id FROM company WHERE email = 'fleet@autonow.com')
WHERE email = 'admin@autonow.com';

INSERT INTO user_authorities (user_id, authorities)
SELECT id, 'ROLE_COMPANY_ADMIN' FROM users WHERE email = 'admin@autonow.com';

-- Vehicles
INSERT INTO vehicle (brand, model, image_url, air_conditioning, number_of_seats, trunk_capacity, vehicle_type) VALUES
    ('Toyota', 'Camry', 'https://example.com/images/camry.jpg', true, 5, 450.0, 'TAXI'),
    ('Honda', 'CR-V', 'https://example.com/images/crv.jpg', true, 5, 600.0, 'TAXI'),
    ('Mercedes', 'Sprinter', 'https://example.com/images/sprinter.jpg', true, 2, 1500.0, 'AMBULANCE'),
    ('Volvo', 'FH16', 'https://example.com/images/volvo.jpg', true, 2, 5000.0, 'SEMI'),
    ('Skoda', 'Octavia', 'https://example.com/images/octavia.jpg', true, 5, 530.0, 'TAXI'),
    ('Volkswagen', 'Passat', 'https://example.com/images/passat.jpg', true, 5, 480.0, 'TAXI');

-- Assign vehicles to companies
UPDATE vehicle SET company_id = (SELECT id FROM company WHERE email = 'fleet@autonow.com')
WHERE (brand = 'Toyota' AND model = 'Camry')
   OR (brand = 'Honda' AND model = 'CR-V')
   OR (brand = 'Skoda' AND model = 'Octavia')
   OR (brand = 'Volkswagen' AND model = 'Passat');

UPDATE vehicle SET company_id = (SELECT id FROM company WHERE email = 'info@medtransport.bg')
WHERE brand = 'Mercedes' AND model = 'Sprinter';

-- Drivers
INSERT INTO driver (first_name, last_name, phone_number, license_number, expertise_type, available, image_url) VALUES
    ('Michael', 'Johnson', '+1234567890', 'DL-001-2024', 'B', true, 'https://example.com/images/driver1.jpg'),
    ('Sarah', 'Williams', '+1234567891', 'DL-002-2024', 'B', true, 'https://example.com/images/driver2.jpg'),
    ('David', 'Brown', '+1234567892', 'DL-003-2024', 'C', true, 'https://example.com/images/driver3.jpg'),
    ('Emily', 'Davis', '+1234567893', 'DL-004-2024', 'CE', false, 'https://example.com/images/driver4.jpg'),
    ('Robert', 'Miller', '+1234567894', 'DL-005-2024', 'B', true, 'https://example.com/images/driver5.jpg');

-- Assign drivers to companies
UPDATE driver SET company_id = (SELECT id FROM company WHERE email = 'fleet@autonow.com')
WHERE license_number IN ('DL-001-2024', 'DL-002-2024', 'DL-005-2024');

UPDATE driver SET company_id = (SELECT id FROM company WHERE email = 'info@medtransport.bg')
WHERE license_number = 'DL-004-2024';

-- Assign vehicles to drivers
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-001-2024' AND v.brand = 'Toyota' AND v.model = 'Camry';
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-001-2024' AND v.brand = 'Honda' AND v.model = 'CR-V';
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-002-2024' AND v.brand = 'Skoda' AND v.model = 'Octavia';
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-003-2024' AND v.brand = 'Volvo' AND v.model = 'FH16';
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-004-2024' AND v.brand = 'Mercedes' AND v.model = 'Sprinter';
INSERT INTO driver_vehicles (driver_id, vehicle_id)
SELECT d.id, v.id FROM driver d, vehicle v WHERE d.license_number = 'DL-005-2024' AND v.brand = 'Volkswagen' AND v.model = 'Passat';

-- Orders
INSERT INTO orders (user_id, driver_id, vehicle_id, vehicle_type, pickup_address, pickup_latitude, pickup_longitude,
                   dropoff_address, dropoff_latitude, dropoff_longitude, status, estimated_price, final_price,
                   distance_km, estimated_duration_minutes, created_at, updated_at)
SELECT u.id, d.id, v.id, 'TAXI', '123 Main St, Sofia', 42.6977, 23.3219, '456 Oak Ave, Sofia', 42.7105, 23.3238,
       'COMPLETED', 15.50, 16.00, 5.2, 15, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
FROM users u, driver d, vehicle v
WHERE u.email = 'john.doe@example.com' AND d.license_number = 'DL-001-2024' AND v.brand = 'Toyota' AND v.model = 'Camry';

INSERT INTO orders (user_id, driver_id, vehicle_id, vehicle_type, pickup_address, pickup_latitude, pickup_longitude,
                   dropoff_address, dropoff_latitude, dropoff_longitude, status, estimated_price, final_price,
                   distance_km, estimated_duration_minutes, created_at, updated_at)
SELECT u.id, d.id, v.id, 'TAXI', '789 Pine Rd, Sofia', 42.6850, 23.3150, '321 Elm St, Sofia', 42.7000, 23.3400,
       'COMPLETED', 35.00, 38.50, 8.7, 22, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
FROM users u, driver d, vehicle v
WHERE u.email = 'john.doe@example.com' AND d.license_number = 'DL-002-2024' AND v.brand = 'Skoda' AND v.model = 'Octavia';

INSERT INTO orders (user_id, driver_id, vehicle_id, vehicle_type, pickup_address, pickup_latitude, pickup_longitude,
                   dropoff_address, dropoff_latitude, dropoff_longitude, status, estimated_price, final_price,
                   distance_km, estimated_duration_minutes, created_at, updated_at)
SELECT u.id, d.id, v.id, 'TAXI', '555 Cedar Ln, Sofia', 42.7100, 23.2900, '777 Birch Dr, Sofia', 42.6800, 23.3500,
       'COMPLETED', 22.00, 22.00, 6.8, 18, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM users u, driver d, vehicle v
WHERE u.email = 'jane.smith@example.com' AND d.license_number = 'DL-001-2024' AND v.brand = 'Honda' AND v.model = 'CR-V';

INSERT INTO orders (user_id, vehicle_type, pickup_address, pickup_latitude, pickup_longitude,
                   dropoff_address, dropoff_latitude, dropoff_longitude, status, estimated_price,
                   distance_km, estimated_duration_minutes, created_at, updated_at)
SELECT u.id, 'TAXI', '999 Maple Way, Sofia', 42.6900, 23.3100, '111 Spruce Ct, Sofia', 42.7200, 23.3300,
       'CREATED', 18.00, 4.5, 12, NOW(), NOW()
FROM users u WHERE u.email = 'jane.smith@example.com';

-- Payments
INSERT INTO payments (order_id, amount, payment_method, status, transaction_id, currency, created_at, updated_at)
SELECT o.id, 16.00, 'CREDIT_CARD', 'COMPLETED', 'TXN-001-2024', 'EUR', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '123 Main St, Sofia' AND u.email = 'john.doe@example.com';

INSERT INTO payments (order_id, amount, payment_method, status, transaction_id, currency, created_at, updated_at)
SELECT o.id, 38.50, 'DEBIT_CARD', 'COMPLETED', 'TXN-002-2024', 'EUR', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '789 Pine Rd, Sofia' AND u.email = 'john.doe@example.com';

INSERT INTO payments (order_id, amount, payment_method, status, transaction_id, currency, created_at, updated_at)
SELECT o.id, 22.00, 'CASH', 'COMPLETED', NULL, 'EUR', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '555 Cedar Ln, Sofia' AND u.email = 'jane.smith@example.com';

-- Ratings
INSERT INTO ratings (order_id, rating, comment, created_at)
SELECT o.id, 5, 'Excellent service! Driver was very professional and the car was clean.', NOW() - INTERVAL '7 days'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '123 Main St, Sofia' AND u.email = 'john.doe@example.com';

INSERT INTO ratings (order_id, rating, comment, created_at)
SELECT o.id, 4, 'Great experience, arrived on time.', NOW() - INTERVAL '3 days'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '789 Pine Rd, Sofia' AND u.email = 'john.doe@example.com';

INSERT INTO ratings (order_id, rating, comment, created_at)
SELECT o.id, 5, 'Very comfortable ride, would recommend!', NOW() - INTERVAL '1 day'
FROM orders o JOIN users u ON o.user_id = u.id
WHERE o.pickup_address = '555 Cedar Ln, Sofia' AND u.email = 'jane.smith@example.com';
