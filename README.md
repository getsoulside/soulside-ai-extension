# Soulside AI Chrome Extension

A Chrome extension designed for behavioral health professionals using the Soulside AI platform. This extension seamlessly integrates with healthcare platforms like AdvancedMD and AllevaSoft to enhance workflow efficiency and provide AI-powered assistance.

## Project Structure

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Chrome browser (latest version recommended)
- Basic knowledge of React, TypeScript, and Chrome extensions

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd soulside-ai-extension
```

2. Install dependencies:

```bash
# Install main extension dependencies
npm install

# Install content app dependencies
cd src/content-app && npm install
```

3. Set up environment variables:

```bash
# Create environment files
cp env/.env.example env/.env
cp env/.env.development.example env/.env.development
cp env/.env.production.example env/.env.production
```

## Development

### Local Development

The project supports different development environments:

```bash
# Development environment
npm run local:dev        # Runs both extension and content app in dev mode
npm run extension:local:dev  # Runs only extension in dev mode
npm run content:local:dev    # Runs only content app in dev mode

# Production-like environment
npm run local:prod      # Runs both in production-like mode
npm run extension:local:prod
npm run content:local:prod
```

Development servers:

- Extension webpack server: http://localhost:9000
- Content app Vite server: http://localhost:5174

### Building for Production

```bash
# Development build
npm run build:dev       # Creates development build with source maps

# Production build
npm run build:prod     # Creates minified production build
```

Build outputs:

- Development: `build/extension-build-dev.zip`
- Production: `build/extension-build-prod.zip`

## Environment Configuration

The project uses a multi-layered environment configuration:

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `.env`             | Base variables shared across all environments |
| `.env.development` | Development-specific variables                |
| `.env.production`  | Production-specific variables                 |
| `.env.*.local`     | Local overrides (git-ignored)                 |

Important environment variables:

```bash
API_URL=https://api.example.com
APP_ENV=dev|prod
```

## Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked" (top-left button)
4. Select the appropriate build folder:
   - Development: `build/extension-local-dev` or `build/extension-build-dev`
   - Production: `build/extension-local-prod` or `build/extension-build-prod`

## Features

### Core Functionality

- Seamless integration with healthcare platforms
- Real-time updates and notifications
- Secure data handling and transmission
- Custom UI components with Material-UI
- Cross-platform compatibility

### Technical Features

- Shadow DOM isolation for CSS/JS
- Hot Module Replacement (HMR) support
- TypeScript type checking
- Redux state management
- Environment-specific builds

## Technical Stack

### Frontend

- React 18
- Material-UI v6
- Redux Toolkit
- React Router v7
- TypeScript 5

### Build Tools

- Webpack 5
- Vite 6
- TypeScript Compiler
- Babel

### Development Tools

- ESLint
- Webpack Dev Server
- Vite Dev Server
- Chrome Extension APIs

## Security Measures

### Content Security

- Content Security Policy (CSP) implementation
- Secure cookie handling
- Shadow DOM isolation
- CORS configuration
- Environment-specific security settings

### Data Protection

- Secure storage handling
- API request encryption
- Token-based authentication
- Sensitive data encryption

## Troubleshooting

Common issues and solutions:

### Build Issues

```bash
# Clear build cache
rm -rf build/
rm -rf node_modules/.cache

# Reinstall dependencies
npm ci
cd src/content-app && npm ci
```

### Development Server Issues

```bash
# Reset webpack dev server
npm run extension:local:dev -- --reset-cache

# Check ports
lsof -i :9000  # Check if webpack port is in use
lsof -i :5174  # Check if Vite port is in use
```

## Authors

- Uttam Darji @ Soulside AI
