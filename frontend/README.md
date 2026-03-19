# Aquila Hotel AI - Frontend

A modern React-based chat interface for interacting with Snowflake-powered hotel intelligence AI. This frontend provides a conversational UI with speech recognition, real-time chat, data visualization, and an animated AI avatar.

## Features

- **Real-time Chat**: Interactive conversation with Snowflake AI agent
- **Speech Recognition**: Voice input support with visual feedback
- **AI Avatar**: Animated robot avatar that responds to different states (idle, listening, thinking, speaking)
- **Data Visualization**: Automatic rendering of charts (Vega-Lite) and tables from AI responses
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Authentication**: Login system for secure access
- **Sidebar Navigation**: Easy access to chat history and settings

## Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Speech Recognition** - Voice input functionality
- **Vega & Vega-Lite** - Declarative data visualization
- **Recharts** - Additional charting capabilities

## Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend README)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks


## Key Components

### App.jsx
Main application component managing:
- Authentication state
- Chat conversation flow
- AI avatar status updates
- Speech recognition integration

### ChatArea.jsx
Displays chat messages with support for:
- Text responses
- Data tables
- Interactive Vega charts

### ChatInput.jsx
Handles user input with:
- Text typing
- Voice recording
- Send button with loading states

### Sidebar.jsx
Provides navigation and additional features:
- Chat history
- Settings panel
- User profile

## API Integration

The frontend communicates with the backend API:

- `POST /api/chat` - Send messages to Snowflake AI agent
- `GET /health` - Health check endpoint

Expected response format:
```json
{
  "text": "AI response text",
  "tableData": [...], // Optional table data
  "vegaChart": "..."  // Optional Vega-Lite spec
}
```


## Speech Recognition

Voice input requires:
- HTTPS connection (required by browsers)
- Microphone permissions
- Supported browsers: Chrome, Edge, Safari

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test on multiple browsers
4. Ensure responsive design works on mobile

## License

This project is part of the Aquila Hotel AI system. See root directory for license information.
