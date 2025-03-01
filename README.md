# Server Documentation

## Tech Stack

- **Bun**: JavaScript runtime and toolkit
- **Elysia.js**: Web framework for Bun
- **SQLite**: Database (via Bun:sqlite)
- **Jose**: JWT implementation for authentication
- **SendGrid**: Email service for password reset

## Setup and Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Required environment variables:
   - `JWT_SECRET`: Secret key for JWT signing
   - `SENDGRID_KEY`: API key for SendGrid email service

3. Start the development server:
   ```bash
   bun run dev
   ```

4. For production:
   ```bash
   bun run pro
   ```

## API Endpoints

### Authentication

#### Sign Up
- **Endpoint**: `POST /signup`
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: `{ message: "success" }` or error message

#### Sign In
- **Endpoint**: `POST /signin`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, name: string, image: string }` or error message

#### Verify JWT
- **Endpoint**: `POST /verify-jwt`
- **Body**: `{ token: string }`
- **Response**: JWT payload or "unauthorized"

#### Password Reset Flow
1. **Request Reset**:
   - **Endpoint**: `POST /reset-pass`
   - **Body**: `{ email: string }`
   - **Response**: "check your email" or error message
   - Sends a verification code to the user's email

2. **Verify Code**:
   - **Endpoint**: `POST /verify-code`
   - **Body**: `{ code: string, email: string }`
   - **Response**: "success" or error message

3. **Reset Password**:
   - **Endpoint**: `POST /resetpass`
   - **Body**: `{ pass: string, email: string, code: string }`
   - **Response**: "password reset successfully" or error message

#### Profile Management

1. **Save Profile**:
   - **Endpoint**: `POST /saveprofile`
   - **Body**: `{ token: string, name: string, email: string, imageuri: string }`
   - **Response**: "success" or error message

2. **Delete Photo**:
   - **Endpoint**: `POST /deletephoto`
   - **Body**: `{ token: string, email: string }`
   - **Response**: "success" or error message

3. **Get User Info**:
   - **Endpoint**: `POST /getNI`
   - **Body**: `{ email: string }`
   - **Response**: `{ name: string, image: string }`

### WebSocket

#### Chat WebSocket
- **Endpoint**: `ws://<server>/chat`
- **Functionality**:
  - Automatically pairs users for chatting
  - Creates chat rooms
  - Handles message sending between users
  - Supports text messages and image sharing
  - Handles disconnection

#### WebSocket Message Format
```json
{
  "content": "{...}" // JSON stringified content with these possible properties:
  // For initial pairing: 
  // Assigned automatically when connection is established

  // For messaging:
  // { "message": "text message", "room": "roomId" }
  
  // For sharing user name:
  // { "name": "username", "room": "roomId" }
  
  // For sharing images:
  // { "image": "imageData", "room": "roomId" }
  
  // For disconnecting:
  // { "disconnect": "true", "room": "roomId" }
}
```

## Database Schema

The server uses SQLite with the following table structure:

### Users Table
- `name`: User's display name
- `email`: User's email (unique identifier)
- `password`: Hashed password
- `image`: Profile image (optional)
- `resetCode`: Code for password reset

## Security Features

- Password hashing using Bun's built-in password API
- JWT authentication with expiration (2 days)
- Email verification for password reset
- CORS support

## WebSocket Room Management

- Unpaired users are stored until another user connects
- When two users connect, they are subscribed to a shared room
- Communication occurs via room publications
- Disconnection properly handles room unsubscription
