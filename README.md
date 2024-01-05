# File Transfer and Collab API

Welcome to the File Transfer and Collab API! This API is built using Express, MongoDB, and Node.js, offering authentication, file transfer with GridFS, and end-to-end communication using Socket.IO.

## System Architecture

- **Components:**
    - **Frontend Client:**
        - Utilizes the API to interact with the backend.
    - **Backend Server (Node.js with Express):**
        - Handles API requests, business logic, and interacts with the database.
    - **Database (MongoDB with GridFS):**
        - Stores file metadata and content.
    - **Socket.IO:**
        - Enables real-time communication for collaborative features.
  
## API Endpoints

**User Authentication:**
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and generate a token.

**File Management:**
- `POST /api/files/upload`: Upload a file.
- `GET /api/files/:fileId`: Get file metadata.
- `GET /api/files/:fileId/content`: Download file content.
- `PUT /api/files/:fileId`: Update file metadata.
- `DELETE /api/files/:fileId`: Delete a file.

**Collaboration:**
- WebSocket events for real-time collaboration (e.g., document editing, commenting).

## Database Schema

**User Collection:**
- `username`, `email`, `password` (hashed), etc.

**File Collection:**
- `filename`, `size`, `type`, `uploadDate`, `owner` (user ID), etc.

**Collaboration Collection:**
- Tracks collaborative sessions and activities.

## Real-Time Collaboration

- Utilize [Socket.IO](http://socket.io/) for real-time communication.
- Implement features like collaborative text editing, commenting, and version control.

Feel free to explore, contribute, or use this API for your collaborative file transfer and communication needs. Happy coding! {
I am currently working on some fixes and deploymen, the live link will be provided here once its completed.
}
