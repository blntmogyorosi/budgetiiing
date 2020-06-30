CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(62),
    password VARCHAR(128),
    registered TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password) VALUES ('blnt.mogyorosi@gmail.com', 'bcryptHashPassword');