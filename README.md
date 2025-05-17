# Notification Service

A MERN backend microservice for handling notifications (email, SMS, in-app) using Node.js, Express, MongoDB, and RabbitMQ.

## Features

- REST API to send and fetch notifications
- Supports email, SMS, and in-app notifications
- Uses RabbitMQ for job queueing and background processing
- Modular code structure
- Swagger documentation for API endpoints

## Folder Structure

```
notification-service/
├── config/
├── controllers/
├── models/
├── queues/
├── routes/
├── services/
├── index.js
├── worker.js
├── package.json
├── .env.example
```

## Setup & Installation

1. **Clone the repo and install dependencies:**

   ```bash
   cd notification-service
   npm install
   ```

2. **Copy and configure your environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB and RabbitMQ URIs
   # Set SWAGGER_SERVER_URL to your deployed server URL for Swagger documentation
   ```

3. **Start MongoDB and RabbitMQ locally** (or use cloud URIs).

4. **Run the API server:**

   ```bash
   npm run dev
   ```

   The server runs on `http://localhost:5000` by default.

5. **Run the worker process (in a separate terminal):**

   ```bash
   npm run worker
   ```

6. **Access API Documentation:**

   - The Swagger UI for API documentation is available at `/api-docs`.
   - Ensure `SWAGGER_SERVER_URL` is set correctly in your environment for production deployments.

## Swagger Documentation

- The API documentation is generated using Swagger and can be accessed at the `/api-docs` endpoint.
- Ensure that the `SWAGGER_SERVER_URL` environment variable is set to the correct URL of your deployed server to reflect the accurate server URL in the documentation.
- The documentation provides details on all available endpoints, request parameters, and response formats.

## API Endpoints

### Send Notification

- **POST** `/notifications`
- **Body:**
  ```json
  {
    "userId": "<user_id>",
    "type": "email" | "sms" | "inapp",
    "content": "Message content"
  }
  ```

### Get User Notifications

- **GET** `/notifications/users/:id/notifications`

## Notes

- Add users directly to the database (no registration endpoint included).
- Notification sending real for sms and email and mocked for in-app (logs to console, random success/failure).
- Ensure all environment variables are correctly set for production deployments.

---
