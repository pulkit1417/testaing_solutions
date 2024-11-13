# 📝 React Notes App Project

Welcome to the **React Notes App**! This project is a simple, user-friendly notes-taking application that integrates Firebase for authentication. Below, you'll find a detailed overview, features, and setup instructions to get you started. 🚀

## 📚 Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)

## 📖 About the Project
This project is a full-fledged **Notes App** built using **React** and **Firebase**. Users can create, view, edit, and delete their notes, but only if they're authenticated. The app includes routes for logging in and signing up, ensuring only registered users can access the notes management functionalities. 🛡️

## ✨ Features
- 🔑 **User Authentication**: Secure login and signup powered by Firebase.
- 📃 **Notes Management**: Add, view, edit, and delete notes.
- 🔗 **Protected Routes**: Ensures only authenticated users can access specific pages.
- 🖥️ **Responsive Design**: Mobile-friendly and desktop-ready.
- 🛠 **Components**: Modular React components for easy code maintenance.

## 🛠 Technologies Used
- **React** (v18.3.1) ⚛️
- **Firebase** (v11.0.1) 🔥
- **React Router DOM** (v6.28.0) 🛤️
- **Tailwind CSS** (v3.4.14) 💨
- **React Icons** for beautiful icons 🎨
- **Lucide React** for modern UI icons 🔧

## 📁 Project Structure
```
project-root/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── NotesList.js
│   │   ├── AddNote.js
│   │   ├── EditNote.js
│   │   ├── ViewNote.js
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── App.js
│   ├── firebase.config.js
│   └── index.js
├── package.json
└── README.md
```

## ⚙️ Setup Instructions
Follow these steps to get the project up and running on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/react-notes-app.git
   cd react-notes-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   * Create a project in Firebase Console.
   * Enable **Authentication** (Email/Password).
   * Copy the Firebase config object and paste it into `firebase.config.js`.

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Visit**:
   * Open http://localhost:3000 in your browser.

## 🚀 Usage
* **Login/Signup**: Access `/login` and `/signup` to authenticate.
* **Notes Operations**:
   * **Add Note**: Navigate to `/add-note`.
   * **View/Edit/Delete Notes**: Accessible from the notes list.
