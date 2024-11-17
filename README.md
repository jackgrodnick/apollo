# Apollo Superday Vehicle API Service Project!

# Notes, Acknowledgments, and What I Learned:

This was a super cool project to tackle! I started this task off unsure of how to begin, but I quickly learned that making this API is very similar to past React and static web projects I've done. The only difference is that instead of serving up static web content, we sent just JSON instead. During this process, my biggest challenge was remembering all the syntax and figuring out how to get started, as it has been a while since I last used Node.js or Express. I want to acknowledge these YouTube videos that helped me refresh before I attempted this project:

- https://www.youtube.com/watch?v=ldYcgPKEZC8 (review of the pipeline for API creation)
- https://www.youtube.com/watch?v=T2sYitv2OAY (showed me how to test my API using Jest and Supertest)
- https://www.youtube.com/watch?v=zw4s3Ey8ayo&t=1381s (review of SQL syntax)

# Project Overview

This project implenents CRUD-style API with endpoints to manage vehicle data stored in a PostgreSQL database. The API allows vehicle database CRUD updates using HTTP requests handled by a Express server.

# Features of the API

- Can create a new vehicle record
- Can fetch all vehicle records
- Can fetch a specific vehicle by VIN
- Can update a vehicle's details by VIN
- Can delete a vehicle by VIN
- Handles errors for invalid JSON and malformed data

# Technologies I Used

- **Node.js** with **Express** framework
- **PostgreSQL** as the database
- **pg** library for database connection
- **Jest** and **Supertest** for testing

---

# Prerequisites

Make sure you have the following installed:
- Node.js
- PostgreSQL
- npm

# Installation

1. Clone this repository

   ```
   git clone https://github.com/jackgrodnick/apollo.git
   ```

2. Install the dependencies

   ```
   npm install
   ```

3. Create a PostgreSQL database

   Open the PostgreSQL terminal

   ```
   psql -U postgres
   ```

   Then run the following code in database.sql with the modifications for your respective database implenetation.

# Start the Server

To start the Express server, run:

```
npx nodemon index.js
```

The server will run on http://localhost:3000 by default.

nodemon is used for automatically restarting the server on code changes.

# API Endpoints

Here are the available endpoints:

## GET /vehicle

Fetch all vehicles.

## POST /vehicle

Create a new vehicle.

## GET /vehicle/:vin

Fetch a specific vehicle by VIN.

## PUT /vehicle/:vin

Update a vehicle's details by VIN.

## DELETE /vehicle/:vin

Delete a vehicle by VIN.

# Error Handling

- 400 Bad Request: For invalid JSON format.
- 422 Unprocessable Entity: For malformed or missing data.
- 404 Not Found: If a vehicle is not found by VIN.

# Testing

Unit tests are included using Jest and Supertest.

# Running Tests

To run the tests, use:

```
npm test
```

# Improvements for the Future

If this project is extended or used in the future, there are several enhancements I would consider implementing. One key improvement would be to refactor the folder structure by splitting the code into separate directories. For example, the routes could be placed in a dedicated routes directory, while database logic, middleware, and utilities could have their own directories.

For the current implementation, I opted for a simpler folder structure as it was easier to manage at this scale. However, as the project grows, more organization and modularization would be necessary to ensure maintainability and scalability.