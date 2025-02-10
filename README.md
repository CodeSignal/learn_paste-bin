# Pastebin Demo Application

A simple Pastebin-like application built with React, TypeScript, and Express. This application is intentionally built with minimal security measures for educational purposes in security courses.

## Features

- Code snippet creation and editing
- Support for multiple programming languages:
  - TypeScript
  - JavaScript
  - Python
  - Java
  - C++
- Syntax highlighting using CodeMirror
- File upload functionality
- Basic user authentication
- Unique URLs for each saved snippet
- SQLite database with Sequelize ORM

## ⚠️ Security Notice

This application is deliberately built WITHOUT security measures for educational purposes. It contains various vulnerabilities including but not limited to:
- SQL Injection possibilities
- No input validation
- Weak authentication
- No CSRF protection
- Potential XSS vulnerabilities

DO NOT USE THIS IN PRODUCTION!

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd pastebin-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create database and default user:
```bash
npm run server
```
This will automatically create the SQLite database and a default admin user.

4. Start the frontend development server:
```bash
npm run dev
```

## Usage

1. Access the application at `http://localhost:3000`

2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`

3. Create new snippets:
   - Enter a title
   - Select a programming language
   - Write or paste your code
   - Click "Save" to generate a unique URL

4. Upload files:
   - Click the file upload button
   - Select a text file
   - The content will be automatically loaded into the editor

5. Access saved snippets:
   - Use the generated URL (format: `/snippet/:id`)
   - Edit and save changes as needed

## Project Structure

```
src/
├── server/
│   ├── models/
│   │   ├── index.ts
│   │   ├── Snippet.ts
│   │   └── User.ts
│   └── index.ts
├── components/
│   ├── Editor.tsx
│   └── Login.tsx
├── types.ts
├── App.tsx
└── main.tsx
```

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/snippets` - Create/update snippets
- `GET /api/snippets/:id` - Retrieve a specific snippet

## Development

Backend server runs on port 3000:
```bash
npm run server
```

Frontend development server runs on port 5173:
```bash
npm run dev
```

## Dependencies

### Backend
- express
- sequelize
- sqlite3
- jsonwebtoken
- bcryptjs
- cors

### Frontend
- react
- react-router-dom
- @uiw/react-codemirror
- Various CodeMirror language packages

## Contributing

This is a demo application for educational purposes. If you find any bugs or want to suggest improvements, please open an issue or submit a pull request.
