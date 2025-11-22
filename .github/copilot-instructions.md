# AI Coding Agent Instructions for `timetrackerJS`

Welcome to the `timetrackerJS` codebase! This document provides essential guidance for AI coding agents to be productive in this project. The project is a MERN stack-based online productivity tracking tool with a Chrome extension for monitoring browsing activity.

---

## Big Picture Overview

### Architecture

- **Backend**: Node.js with Express, located in `server.js`. Routes are defined in the `routes/` directory.
- **Frontend**: React-based client application in the `client/` directory.
- **Database**: MongoDB, with models defined in the `models/` directory.
- **Chrome Extension**: Located in `clockman extension/` and `chrome extension - Copy/` directories, enabling browser activity tracking.

### Data Flow

1. **User Authentication**: Managed via JWT tokens (`auth.js` in `middleware/` and `actions/auth.js` in `client/src/`).
2. **Session Tracking**: Backend tracks user sessions and app statistics (`routes/usersession.js`, `routes/stats.js`).
3. **Frontend-Backend Communication**: REST API endpoints are consumed by React components.
4. **Chrome Extension**: Sends browsing data to the backend for processing.

---

## Developer Workflows

### Setting Up the Project

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```
3. Start the development environment:
   ```bash
   npm run dev
   ```
4. Load the Chrome extension:
   - Open Chrome > More Tools > Extensions.
   - Enable Developer Mode.
   - Click "Load unpacked" and select the `clockman extension/` directory.

### Running Tests

- Backend tests: Not explicitly defined in the current setup.
- Frontend tests: Run using React's default testing setup:
  ```bash
  cd client
  npm test
  ```

### Building the Project

- Build the React frontend for production:
  ```bash
  cd client
  npm run build
  ```

---

## Project-Specific Conventions

### Backend

- **Routes**: Organized by feature in the `routes/` directory (e.g., `stats.js`, `userauth.js`).
- **Models**: Defined in `models/` (e.g., `User.js`, `Session.js`).
- **Middleware**: Authentication middleware is in `middleware/auth.js`.

### Frontend

- **State Management**: Uses React Context API and actions (e.g., `actions/auth.js`).
- **Component Structure**: Components are in `client/src/components/`.
- **Styling**: CSS files are colocated with components (e.g., `App.css`).

### Chrome Extension

- **Manifest**: Defined in `manifest.json`.
- **Background Scripts**: Located in `background.js` and `background2.js`.

---

## Integration Points

### External Dependencies

- **MongoDB**: Database for storing user data and session statistics.
- **JWT**: Used for user authentication.
- **React**: Frontend framework.
- **Express**: Backend framework.

### Cross-Component Communication

- **Frontend to Backend**: REST API calls using `fetch` or `axios`.
- **Chrome Extension to Backend**: Sends browsing data via HTTP requests.

---

## Examples

### Adding a New API Endpoint

1. Create a new route file in `routes/`.
2. Define the endpoint using Express:

   ```javascript
   const express = require("express");
   const router = express.Router();

   router.get("/example", (req, res) => {
     res.json({ message: "Example endpoint" });
   });

   module.exports = router;
   ```

3. Register the route in `server.js`.

### Adding a New React Component

1. Create the component in `client/src/components/`.
2. Import and use the component in `App.js` or another parent component.

---

Feel free to update this document as the project evolves!
