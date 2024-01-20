INSERT INTO department (department_name) VALUES
  ('Producers'),
  ('Artists'),
  ('Writers');

INSERT INTO managers (manager_id, first_name, last_name, role_id) VALUES
  (1, 'Stan', 'Lee', 1),
  (2, 'Jack', 'Kirby', 4),
  (3, 'Alan', 'Moore', 7);

INSERT INTO role (role_id, title, department_id, salary) VALUES
  (1, 'Producer', 1, 175000),
  (2, 'Lead Artist', 2, 150000),
  (3, 'Penciller', 2, 120000),
  (4, 'Colorist', 2, 100000),
  (5, 'Lead Author', 3, 90000),
  (6, 'Author', 3, 80000),
  (7, 'Storyboard Artist', 3, 75000);

INSERT INTO employees (employee_id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'Chris', 'Claremont', 1, 1),
  (2, 'Todd', 'McFarlane', 2, 1),
  (3, 'Jim', 'Lee', 4, 2),
  (4, 'Frank', 'Miller', 3, 2),
  (5, 'Neil', 'Gaiman', 5, 3),
  (6, 'Brian', 'K. Vaughan', 6, 3),
  (7, 'Amanda', 'Conner', 7, 3);
