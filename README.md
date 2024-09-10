# Project Sports

## Overview

This project is a web application built using modern web development technologies. Below is a detailed overview of the tech stack used in this project.

## Tech Stack

### Frontend

- **Next.js**: A React framework for server-side rendering and generating static websites. It is used for building the user interface and handling routing.
  - Version: 14.2.4
  - [Next.js Documentation](https://nextjs.org/docs)

- **React**: A JavaScript library for building user interfaces.
  - Version: 18
  - [React Documentation](https://reactjs.org/docs/getting-started.html)

- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
  - Version: 3.4.1
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs)

- **DaisyUI**: A plugin for Tailwind CSS that provides a set of accessible and customizable UI components.
  - Version: 4.12.10
  - [DaisyUI Documentation](https://daisyui.com/docs)

- **Framer Motion**: A library for animations in React.
  - Version: 11.2.12
  - [Framer Motion Documentation](https://www.framer.com/motion/)

- **React Icons**: A collection of popular icons for React projects.
  - Version: 5.2.1
  - [React Icons Documentation](https://react-icons.github.io/react-icons/)

### Backend

- **Firebase**: A platform developed by Google for creating mobile and web applications. It provides various services like authentication, Firestore database, and storage.
  - Version: 10.12.2
  - [Firebase Documentation](https://firebase.google.com/docs)

### Development Tools

- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
  - [TypeScript Documentation](https://www.typescriptlang.org/docs/)

- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
  - Version: 8
  - [ESLint Documentation](https://eslint.org/docs/latest/)

- **PostCSS**: A tool for transforming CSS with JavaScript plugins.
  - Version: 8
  - [PostCSS Documentation](https://postcss.org/)

### Configuration Files

- **next.config.mjs**: Configuration file for Next.js.
- **tailwind.config.ts**: Configuration file for Tailwind CSS.
- **postcss.config.mjs**: Configuration file for PostCSS.
- **.eslintrc.json**: Configuration file for ESLint.

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Create a `.env.local` file and add your environment variables.
4. Run the development server using `npm run dev`.

## License

This project is licensed under the MIT License.



## Project Structure

- **src/**: Contains the source code of the application.
  - **app/**: Contains the main application components.
  - **contexts/**: Contains context providers like `AuthContext`.
  - **firebase/**: Contains Firebase configuration and initialization.
  - **pages/**: Contains the Next.js pages.
  - **components/**: Contains reusable React components.
  - **styles/**: Contains global styles and CSS files.

- **public/**: Contains static assets like images and fonts.


<!-- TREE STRUCTURE START -->
<!-- TREE STRUCTURE END -->

<!-- TREE STRUCTURE START -->
```bash
.
├── README.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── hero-image.webp
│   ├── next.svg
│   ├── placeholder.jpeg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       ├── (profile-creation)
│   │   │       │   ├── basic-details
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── layout.tsx
│   │   │       │   ├── personal-details
│   │   │       │   │   └── page.tsx
│   │   │       │   └── preferences
│   │   │       │       └── page.tsx
│   │   │       └── page.tsx
│   │   ├── (main)
│   │   │   ├── (protected)
│   │   │   │   ├── feed
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── post
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── profile
│   │   │   │       ├── edit
│   │   │   │       │   └── page.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── user
│   │   │       └── [username]
│   │   │           └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   ├── CommentBox
│   │   │   └── index.tsx
│   │   ├── DisplayPosts
│   │   │   └── index.tsx
│   │   ├── LoginForm
│   │   │   └── index.tsx
│   │   ├── MediaInputArray
│   │   │   └── MediaInputArray.tsx
│   │   ├── Modal
│   │   │   └── index.tsx
│   │   ├── Navbar
│   │   │   └── index.tsx
│   │   ├── NewPostForm
│   │   │   └── index.tsx
│   │   ├── SearchBar
│   │   │   └── SearchBar.tsx
│   │   └── SignupForm
│   │       └── index.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   └── SignupDataContext.tsx
│   ├── firebase
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── firebase.ts
│   │   └── storage.ts
│   ├── types
│   │   ├── AuthData.ts
│   │   ├── CommentData.ts
│   │   ├── PostData.ts
│   │   ├── SignUpData.ts
│   │   └── UserData.ts
│   └── utils
│       ├── base64.ts
│       └── fetchBlob.ts
├── tailwind.config.ts
├── tree_output.txt
└── tsconfig.json

33 directories, 53 files
```
<!-- TREE STRUCTURE END -->
