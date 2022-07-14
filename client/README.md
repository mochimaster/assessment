# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Steps:
1. In Postgres DB, create database with name `assignment`
2. In root directory, run `npm i`
3. In root directory, run `npm start` - This will also seed the table
4. Change directory to `client`
5. In `client` directory, run `npm i`
6. In `client` directory, run `npm start`
7. In browser, navigate to `http://localhost:3000/#/`

Seeded the table with the following users. The password field in database is currently stored as plain text. In test or live environments, passwords must never be stored as plain text. Can utilize bcrypt library to store and validate password.

Available Users:
| Username  | Password | Role
| --------- | -------- | ------
| user1     | user1    | MEMBER
| user2     | user2    | MEMBER
| user3     | user3    | MEMBER
| user4     | user4    | ADMIN
| user5     | user5    | ADMIN
| user6     | user6    | FACILITY MANAGER
| user7     | user7    | FACILITY MANAGER
