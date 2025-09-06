
CREATE TABLE IF NOT EXISTS roles(
  id SERIAL,
  role_name VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  password_hashed VARCHAR(255) NOT NULL,
  role_name VARCHAR(255) NOT NULL REFERENCES roles(role_name),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles(role_name) VALUES ('Admin');
INSERT INTO  roles(role_name) VALUES ('Auditor');

-- INSERT INTO users(email,username,password_hashed,role_name) VALUES('user@gmail.com','user','Qwerty@123','Auditor');
-- INSERT INTO users(email,username,password_hashed,role_name) VALUES('admin@gmail.com','admin','Qwerty@123','Admin');
