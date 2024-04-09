USE employee_tracker_db;

INSERT INTO department (department_name) VALUES
('Producers'),
('Artists'),
('Writers');

INSERT INTO role (title, department_id, salary) VALUES
('Producer', 1, 80000),
('Lead Artist', 2, 75000),
('Penciller', 2, 70000),
('Colorist', 2, 65000),
('Lead Author', 3, 85000),
('Author', 3, 50000),
('Storyboard Artist', 3, 60000);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Stan', 'Lee', 1, NULL),
('Jack', 'Kirby', 2, NULL),
('Alan', 'Moore', 5, NULL),
('Chris', 'Claremont', 1, 1),
('Todd', 'McFarlane', 2, 1),
('Jim', 'Lee', 4, 2),
('Frank', 'Miller', 3, 2),
('Neil', 'Gaiman', 6, 3),
('Brian', 'K. Vaughan', 6, 3),
('Amanda', 'Conner', 7, 3);
