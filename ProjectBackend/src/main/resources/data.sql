-- Initial Society Admin
-- Username: admin, Password: admin123
INSERT INTO society_admin (id, name, username, email, phone, password, is_active)
VALUES (1, 'Super Admin', 'admin', 'admin@society.com', '9876543210', 'admin123', true)
ON DUPLICATE KEY UPDATE name=name, password=VALUES(password);

-- Sample Flats
INSERT INTO flat (id, flat_number, building, floor, flat_type, area, status)
VALUES 
(1, 'A-101', 'Tower A', 1, '2 BHK', 1150, 'Occupied'),
(2, 'A-102', 'Tower A', 1, '3 BHK', 1450, 'Available'),
(3, 'B-201', 'Tower B', 2, '2 BHK', 1150, 'Occupied'),
(4, 'B-202', 'Tower B', 2, '3 BHK', 1500, 'Available')
ON DUPLICATE KEY UPDATE flat_number=flat_number;

-- Sample Guards
-- Username: guard1, Password: guard123
INSERT INTO guard (id, name, username, phone, password, shift, is_active)
VALUES 
(1, 'Ramesh Singh', 'guard1', '9812345678', 'guard123', 'Day', true),
(2, 'Suresh Kumar', 'guard2', '9812345679', 'guard123', 'Night', true)
ON DUPLICATE KEY UPDATE username=username, password=VALUES(password);

-- Sample Resident
-- Email: resident@example.com, Password: resident123
INSERT INTO resident (id, name, email, phone, password, member_type, flat_id, address, is_active)
VALUES 
(1, 'Rahul Sharma', 'resident@example.com', '9823456780', 'resident123', 'Owner', 1, 'Flat A-101, Green Heights', true),
(2, 'Priya Patel', 'priya@example.com', '9823456781', 'resident123', 'Tenant', 3, 'Flat B-201, Green Heights', true)
ON DUPLICATE KEY UPDATE email=email, password=VALUES(password);

-- Sample Notices
INSERT INTO notice (id, title, description, notice_date, is_active)
VALUES 
(1, 'Annual Society General Meeting', 'Annual AGM will be conducted on this Sunday at 10:00 AM in the clubhouse.', CURDATE(), true),
(2, 'Water Tank Cleaning Notice', 'Water supply will be suspended tomorrow from 1:00 PM to 4:00 PM for routine tank maintenance.', CURDATE(), true)
ON DUPLICATE KEY UPDATE title=title;

-- Sample Parking Slots
INSERT INTO parking (id, parking_number, flat_id, vehicle_number, status)
VALUES 
(1, 'P-A101', 1, 'MH-12-AB-1234', 'Occupied'),
(2, 'P-A102', NULL, NULL, 'Available'),
(3, 'P-B201', 3, 'MH-12-CD-5678', 'Occupied'),
(4, 'P-B202', NULL, NULL, 'Available')
ON DUPLICATE KEY UPDATE parking_number=parking_number;

-- Sample Staff
INSERT INTO staff (id, name, phone, designation, salary, joining_date, status)
VALUES 
(1, 'Mahesh Shinde', '9911223344', 'Electrician', 18000.00, '2023-01-15', 'Active'),
(2, 'Kavita Devi', '9911223355', 'Housekeeping', 14000.00, '2023-03-01', 'Active')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Events
INSERT INTO event (id, title, description, event_date, event_time, venue)
VALUES 
(1, 'Diwali Celebration & Fireworks', 'Grand Diwali celebration, cultural activities, and dinner for all residents.', '2026-11-01', '18:30:00', 'Community Clubhouse')
ON DUPLICATE KEY UPDATE title=title;

-- Sample Maintenance Dues
INSERT INTO maintenance (id, flat_id, resident_id, month, year, amount, due_date, status)
VALUES 
(1, 1, 1, 'October', 2026, 2500.00, '2026-10-31', 'Pending'),
(2, 3, 2, 'October', 2026, 2800.00, '2026-10-31', 'Pending')
ON DUPLICATE KEY UPDATE amount=amount;

