# 🏃‍♂️ Athletic Hub - Server Side

This is the **backend/server** part of the full-stack Athletic Hub application. It manages APIs for events and bookings, handles authentication using JWT and cookies, and interacts with a MongoDB database.

---

## 🌐 Live Server URL

🔗 [https://athletic-hub-server-blue.vercel.app/](https://athletic-hub-server-blue.vercel.app/)

> Use this base URL to test API routes from your frontend or Postman/Thunder Client.

---

## ⚙️ Tech Stack & Dependencies

| Package          | Description                              |
|------------------|------------------------------------------|
| **Express.js**   | Fast & minimal backend framework         |
| **MongoDB**      | NoSQL database (Atlas Cloud)             |
| **jsonwebtoken** | Token-based authentication (JWT)         |
| **dotenv**       | Environment variable configuration        |
| **CORS**         | Cross-Origin Resource Sharing             |
| **cookie-parser**| Parse and manage HTTP cookies             |

---

## 🔐 Authentication & Security

- **JWT** based login system.
- **Token stored in cookies** (httpOnly, secure, sameSite=none).
- Middleware:  
  - `verifyToken` → validates user token  
  - `verifyEmailToken` → checks if token's email matches query email

---

## 🧪 API Endpoints Overview

### 📌 Events

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/allEvents`        | Get all public events              |
| GET    | `/event/:id`        | Get single event details           |
| POST   | `/allEvents`        | Add new event (HR/Admin)           |
| PUT    | `/events/:id`       | Update an event by ID              |
| DELETE | `/events/:id`       | Delete an event                    |
| GET    | `/events?email=`    | Get events posted by a specific HR |

---

### 📌 Bookings

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| GET    | `/bookings?email=`     | Get all bookings of a user             |
| POST   | `/bookings`            | Book a new event                       |
| DELETE | `/bookings/:id`        | Cancel a booking                       |
| GET    | `/events/:id`          | Get all users who booked an event      |

---

### 📌 Authentication

| Method | Endpoint   | Description                       |
|--------|------------|-----------------------------------|
| POST   | `/jwt`     | Issue JWT and set it in cookie    |

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file in the root of your server with:

```env
PORT=3000
DB_USER=yourMongoUsername
DB_PASSWORD=yourMongoPassword
JWT_SECRET=yourSuperSecretKey
