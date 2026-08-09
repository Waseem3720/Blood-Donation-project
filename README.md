# Blood Donation Management System

A comprehensive web-based platform designed to bridge the gap between blood donors and those in need. This system streamlines the blood donation process through real-time notifications, role-based dashboards, and secure authentication.

## 🩸 Features

### 🌟 Core Functionalities
- **Multi-Role Support**: Specialized interfaces for **Donors**, **Seekers**, and **Admins**.
- **Real-time Notifications**: Instant alerts for blood requests and updates using **Socket.io**.
- **Secure Authentication**: Robust login and registration system with **JWT** and **Google OAuth** integration.
- **Blood Request Management**: Easy-to-use forms for seekers to request blood and for donors to respond.
- **Advanced Admin Dashboard**: Powerful tools for managing users, monitoring requests, and overseeing the platform's health.

### 👤 Role-Based Dashboards
- **Donor Dashboard**: Track donation history, view pending requests in nearby areas, and manage availability.
- **Seeker Dashboard**: Create and manage blood requests, track the status of requests in real-time.
- **Admin Dashboard**: Comprehensive overview of the system, user management, and detailed reporting.

## 🛠️ Technology Stack

### Frontend
- **React**: Modern UI library for building a dynamic user interface.
- **Vite**: Ultra-fast build tool and development server.
- **CSS3**: Custom styling for a responsive and premium look.
- **React Router**: For seamless client-side navigation.
- **Axios**: Handling asynchronous API requests.
- **Socket.io-Client**: Real-time communication with the backend.

### Backend
- **Node.js**: Scalable runtime for the server environment.
- **Express.js**: Robust web framework for building APIs.
- **MongoDB & Mongoose**: Flexible NoSQL database with object data modeling.
- **Web Push Notifications**: ending real-time browser notifications to users for important blood donation requests and updates.

- **JSON Web Tokens (JWT)**: Secure user session management.
- **Bcrypt.js**: High-security password hashing.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB account/local instance
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BloodDonation
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add your credentials:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   ```
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_API_URL=http://localhost:5000
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```

### Running the Application

1. **Start the Server** (from `/server`)
   ```bash
   npm run dev
   ```

2. **Start the Client** (from `/client`)
   ```bash
   npm run dev
   ```

## 🔒 Security Features
- Data validation using `express-validator`.
- Password encryption with `bcrypt`.
- Protected API routes with middleware.
- Environment variable protection with `dotenv`.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
