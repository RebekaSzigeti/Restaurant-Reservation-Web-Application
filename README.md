# Restaurant Reservation & Management Web App

A full-stack web application built with **Node.js**, **Express**, and **Microsoft SQL Server**.  
The app allows users to browse restaurants, make table reservations, and upload images for each restaurant. User authentication, session-based authorization, and input validation are implemented.

---

## Features

- Browse all restaurants and view detailed information.
- Make, view, and delete table reservations.
- Upload and display images for each restaurant.
- User login/logout with session management.
- Input validation for reservations and restaurant data.
- Session-based access control for reservation deletion.

---

## Technologies

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, EJS
- **Database:** Microsoft SQL Server
- **Authentication:** Session-based
- **File Uploads:** Multer
- **Version Control:** Git/GitHub

---

## Project Structure

```
project-root/
│
├─ app.js               # Main Express application
├─ package.json         # Project configuration & dependencies
├─ routes/              # Express route handlers
│   ├─ vendeglo.js
│   ├─ vendegloReszletek.route.js
│   ├─ foglalas.route.js
│   ├─ fenykep.route.js
│   └─ login.route.js
├─ db/                  # Database access modules
├─ views/               # EJS templates
├─ public/              # Static files (CSS, client JS, images)
└─ middleware/          # Middleware modules
```

- The database setup is included in setup.sql, which creates the login, user, and necessary tables for the project.
