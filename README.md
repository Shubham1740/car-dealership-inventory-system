# Vroomventory - Car Dealership Inventory System

A full-stack MERN application for managing a car dealership's inventory. The system enables authenticated users to browse and purchase vehicles, while administrators can manage inventory through a secure dashboard. The project is being developed using **Test-Driven Development (TDD)** principles with a focus on clean architecture, maintainable code, and modern development practices.

---

## Project Overview

Vroomventory is designed to simulate a real-world dealership inventory management system.

### Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Role-based authorization (Admin/User)

### Vehicle Management

* Add new vehicles
* View all available vehicles
* Update vehicle details
* Delete vehicles (Admin only)
* Search vehicles by:

  * Make
  * Model
  * Category
  * Price range

### Inventory

* Purchase vehicles
* Automatic stock reduction
* Restock inventory (Admin only)
* Disable purchasing when stock reaches zero

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

### Testing

* Jest
* Supertest

### Development Tools

* Git & GitHub
* ESLint
* Prettier

---

## Project Structure

```text
car-dealership-inventory-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── interfaces/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│
├── PROMPTS.md
└── README.md
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Shubham1740/Vroomventory.git
cd Vroomventory
```

---

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the development server:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Running Tests

```bash
cd backend
npm test
```

Development follows the **Red → Green → Refactor** cycle:

1. Write a failing test.
2. Implement the minimum code required.
3. Refactor while keeping tests green.

---

## REST API

### Authentication

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Register a user |
| POST   | `/api/auth/login`    | Login           |

### Vehicles

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/vehicles`        |
| POST   | `/api/vehicles`        |
| PUT    | `/api/vehicles/:id`    |
| DELETE | `/api/vehicles/:id`    |
| GET    | `/api/vehicles/search` |

### Inventory

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | `/api/vehicles/:id/purchase` |
| POST   | `/api/vehicles/:id/restock`  |

---

## Screenshots

<img width="1887" height="972" alt="image" src="https://github.com/user-attachments/assets/c22dcafe-bc9b-42be-bb0e-57c28887e001" />

<img width="1884" height="972" alt="brave_screenshot_localhost" src="https://github.com/user-attachments/assets/36671759-6281-45ba-bba7-1bae40697a5d" />

<img width="1885" height="969" alt="brave_screenshot_localhost (1)" src="https://github.com/user-attachments/assets/4d9bdaaa-5e9a-44dc-ba29-dc6e70a38904" />

<img width="1883" height="968" alt="brave_screenshot_localhost (2)" src="https://github.com/user-attachments/assets/22229a25-4bee-4b59-bb63-5b197a12b5e4" />


---

## My AI Usage

AI tools were used as development assistants throughout this project. All generated suggestions were reviewed, adapted, and integrated manually.

### AI Tools Used

* ChatGPT
* Claude

### How AI Was Used

* Brainstorming the overall project architecture.
* Discussing folder organization and clean architecture practices.
* Generating initial boilerplate for Express, TypeScript, and React setup.
* Reviewing API design and endpoint organization.
* Assisting with writing and refining Jest and Supertest test cases.
* Explaining TypeScript, Express, and MongoDB concepts when needed.
* Helping troubleshoot errors encountered during development.
* Improving documentation, commit messages, and project organization.
* Suggesting responsive UI ideas and dashboard layouts.
* Providing code reviews and refactoring suggestions.

### Reflection

AI accelerated routine development tasks such as boilerplate generation, documentation, debugging, and test planning, allowing more time to focus on application design and business logic. Every AI-generated suggestion was reviewed, modified where necessary, and manually integrated to ensure correctness, maintainability, and a clear understanding of the implementation.

---

## PROMPTS.md

The repository includes a `PROMPTS.md` file documenting the prompts used while collaborating with AI during development, in accordance with the project requirements.

---

## License

This project is developed for educational purposes as part of a full-stack software engineering assessment.
