# MERN Stack Projects Repository

This repository contains multiple projects built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). The projects within this repository showcase full-stack web development with a focus on modern web technologies.

## Technologies Used

- **Frontend:**
  - React.js
  - React Router
  - Tailwind CSS
  - Vite

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - bcryptjs (for password hashing)

- **Development Tools:**
  - Concurrently (for running server and frontend concurrently)
  - dotenv (for environment variable management)
  - ESLint (for code quality and consistency)

## Setup Instructions

Follow the steps below to get the development environment running locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alikhan-devs/mern-stack.git

2. **Navigate to project directory:**

   ```bash
   cd mern-stack-projects
3. **Install dependencies:**
   ```bash
   npm install
4. **Set up environment variables:**
   Create a .env file in the root directory with the following variables:
    ```bash
    JWT_SECRET=your_jwt_secret_key
    MONGO_URI=mongodb://localhost:27017/your_database_name
5. **Run the application:**
   To run both the frontend and backend concurrently, execute the following command:
   ```bash
   npm run dev:all
  The frontend will be available at http://localhost:3000 and the backend at http://localhost:5000.

### Folder Structure
The folder structure is organized as follows:
 ```graphql
 mern-stack-projects/
├── project-name/                # Folder for the project
│   ├── client/                 # React frontend forproject
│   ├── server/                 # Express API for project
│   └── .env                    # Environment variables for project
├── other-project-1/            # Other MERN stack project
├── other-project-2/            # Other MERN stack project
├── .gitignore                  # Git ignore file
├── README.md                   # This file
└── package.json                # Root dependencies and scripts


### Contributing

Contributions are welcome! If you would like to contribute to this repository, please follow these steps:

1. Fork the repository.

2. Create a new branch (git checkout -b feature/your-feature).

3. Make your changes and commit them (git commit -am 'Add new feature').

4. Push your changes (git push origin feature/your-feature).

5. Create a pull request. 

