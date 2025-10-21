# EasyBuy Dubai - Frontend

React TypeScript chatbot application with modern architecture and Azure-ready deployment.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Docker Development

From the root directory:
```bash
docker-compose up
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ChatMessage/     # Individual message component
│   │   ├── ChatInput/       # Message input with validation
│   │   ├── ChatWindow/      # Chat display container
│   │   └── Header/          # App header
│   ├── hooks/               # Custom React hooks
│   │   └── useChat.ts       # Chat state management hook
│   ├── services/            # External services
│   │   └── api.service.ts   # API client with retry logic
│   ├── store/               # Zustand state management
│   │   └── chatStore.ts     # Chat state and actions
│   ├── types/               # TypeScript definitions
│   │   ├── chat.types.ts    # Chat-related types
│   │   └── api.types.ts     # API types
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # LocalStorage wrapper
│   │   └── helpers.ts       # Helper utilities
│   ├── config/              # Configuration
│   │   └── environment.ts   # Environment variables
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── Dockerfile               # Production build
├── Dockerfile.dev           # Development build
└── nginx.conf               # Nginx configuration
```

## Environment Variables

Copy `.env.example` to `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=EasyBuy Dubai Chatbot
VITE_ENABLE_MARKDOWN=true
VITE_MAX_MESSAGE_LENGTH=2000
```

## Features

- **Modern Stack**: React 18, TypeScript, Vite
- **State Management**: Zustand with localStorage persistence
- **Markdown Support**: Rich text rendering with react-markdown
- **Type Safety**: Strict TypeScript configuration
- **Responsive Design**: Mobile-first UI
- **Error Handling**: Retry logic and error states
- **Path Aliases**: Clean imports using `@` prefix

## Build

```bash
npm run build
```

Output in `dist/` directory

## Docker

### Development
```bash
docker build -f Dockerfile.dev -t easybuydubai-frontend:dev .
docker run -p 3000:3000 easybuydubai-frontend:dev
```

### Production
```bash
docker build -t easybuydubai-frontend:prod .
docker run -p 80:80 easybuydubai-frontend:prod
```

## License

Proprietary - EasyBuy Dubai
