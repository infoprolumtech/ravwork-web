# Ravwork Link Web Application

A modern React + TypeScript + Vite application for service providers to manage their services, jobs, and profiles.

## Overview

This is a service provider platform built with:
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for UI components
- **Redux Toolkit** with RTK Query for state management
- **React Router** for navigation
- **React Hook Form** with Yup for form validation

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Layout wrappers
├── pages/          # Page components
├── routes/         # Routing configuration
├── rtk/            # Redux store & API endpoints
│   ├── endpoints/  # API definitions
│   ├── feature/    # Redux slices
│   └── services/   # RTK Query base API
├── types/          # TypeScript type definitions
└── utils/          # Helper functions & constants
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_BASE_URL=http://localhost:5173/api/v1
   VITE_PUBLIC_ENV=DEV
   VITE_AES_KEY=your_32_character_hex_key_here
   VITE_IV_KEY=your_32_character_hex_iv_here
   VITE_AES_SECRET_KEY=your_redux_persist_encryption_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

## Project Standards

This project follows modern React/TypeScript best practices. See [OPTIMIZATION.md](./OPTIMIZATION.md) for detailed documentation on:
- Type safety standards
- Redux patterns
- Code organization
- Best practices

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
