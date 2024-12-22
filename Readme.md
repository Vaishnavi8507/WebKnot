# Event Management Dashboard

![Event Management](frontend/images/app.png) 

## Description

The Event Management Dashboard is a web application designed to help users manage events, attendees and track tasks efficiently. Users can view event statistics, track event completion progress, and manage attendee information. The application provides a user-friendly interface for managing events and attendees, making it easier to organize and oversee various events.

## Tech Stack

- **Frontend**:
  - HTML
  - CSS
  - JavaScript
  - Font Awesome (for icons)
- **Backend**:
  - Node.js (Express.js)
- **Authentication**:
  - JSON Web Tokens (JWT) for user authentication

## Features

- User authentication and authorization
- Dashboard displaying event statistics
- Event completion progress indicator
- Attendee management functionality
- Responsive design for mobile and desktop

## API Documentation

### Registration

#### SignUp

- **Endpoint**: `http://localhost:3000/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Anya Forger",
    "email": "tohruhonda413@gmail.com",
    "password": "test@1234",
    "confirmPassword": "test@1234"
  }
  ```

### Authentication

#### Login

- **Endpoint**: `http://localhost:3000/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "tohruhonda413@gmail.com",
    "password": "test@1234"
  }
  ```

- **Response**:
  - **200 OK**: Returns a JWT token.
  - **401 Unauthorized**: Invalid credentials.

### Events

#### Get All Events

- **Endpoint**: ` http://localhost:3000/events`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:

  - **200 OK**: Returns an array of events.

  ```json
  [
      {

          "name": "Technovate",
          "date": "22-12-2024",
          "location": "Mysore",
          "description":"Technical",
      },
      
  ]
  ```

#### Create Event

- **Endpoint**: `http://localhost:3000/events`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Technovate",
    "date": "22-12-2024",
    "location": "Mysore",
    "description": "Technical"
  }
  ```
- **Response**:
  - **201 Created**: Returns the created event object.
  - **400 Bad Request**: Validation errors.

### Attendees

#### Get All Attendees

- **Endpoint**: `http://localhost:3000/attendees`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:

  - **200 OK**: Returns an array of attendees.

  ```json
  [
      {

          "name": "Jiriya",
          "email": "jiriya@gmail.com",
          "contact": "1122445577",
          "assigned event": "Tech Conference",
          "assigned task":"Crowd management"
      },
      
  ]
  ```

#### Add Attendee

- **Endpoint**: `http://localhost:3000/attendees`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Jiriya",
    "email": "jiriya@gmail.com",
    "contact": "1122445577",
    "assigned event": "Tech Conference",
    "assigned task": "Crowd management"
  }
  ```
- **Response**:
  - **201 Created**: Returns the created attendee object.
  - **400 Bad Request**: Validation errors.

## How to Run the Application

### Prerequisites

- Node.js installed on your machine
- A code editor (e.g., Visual Studio Code)

### Steps to Run the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Vaishnavi8507/WebKnot

   ```

2. **Install Dependencies**
   Navigate to the backend directory (if applicable) and install the required packages:

   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the backend directory and add the necessary environment variables, such as:

   ```plaintext

   JWT_SECRET=your_jwt_secret
   JWT_SECRET=8537ceba41ce9f96e3ceae73204f70608837c58b77d655a9b7748d46ed305129f662211676f95aed0fad3aef77f98e8703ab9982a588c5599f35048890524671
   ```

4. **Run the Backend Server**
   Start the backend server:

   ```bash
   node server.js
   ```

5. **Run the Frontend**
   Open the `index.html` file in your browser or set up a local server (e.g., using Live Server extension in VS Code).

6. **Access the Application**
   Open your browser and navigate to `http://localhost:3000` (or the port you specified) to access the application.

7. **Signin to the application**
   Credentials to access
   ```bash
   email id:tohruhonda413@gmail.com
   password:test@1234
   ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.
