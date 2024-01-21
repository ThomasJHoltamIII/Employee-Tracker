INSERT INTO department (department_id, department_name) VALUES
  (1, 'Producers'),
  (2, 'Artists'),
  (3, 'Writers');

INSERT INTO role (role_id, title, department_id) VALUES
  (1, 'Producer', 1),
  (2, 'Lead Artist', 2),
  (3, 'Penciller', 2),
  (4, 'Colorist', 2),
  (5, 'Lead Author', 3),
  (6, 'Author', 3),
  (7, 'Storyboard Artist', 3);

INSERT INTO managers (manager_id, first_name, last_name, role_id, salary) VALUES
  (1, 'Stan', 'Lee', 1, 250000),
  (2, 'Jack', 'Kirby', 2, 245000),
  (3, 'Alan', 'Moore', 5, 200000);

INSERT INTO employees (employee_id, first_name, last_name, role_name, role_id, manager_id, salary) VALUES
  (1, 'Chris', 'Claremont', 'Producer', 1, 1, 120000),
  (2, 'Todd', 'McFarlane', 'Lead Artist', 2, 1, 175000),
  (3, 'Jim', 'Lee', 'Colorist', 4, 2, 110000), 
  (4, 'Frank', 'Miller', 'Penciller', 3, 2, 155000),
  (5, 'Neil', 'Gaiman', 'Author', 6, 3, 130000),
  (6, 'Brian', 'K. Vaughan', 'Author', 6, 3, 82000),
  (7, 'Amanda', 'Conner', 'Storyboard Artist', 7, 3, 110000);
