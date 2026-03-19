# Aquila Hotel AI

A full-stack AI-powered chat application for hotel management using Snowflake intelligence. This system provides a conversational interface to interact with hotel data, generate insights, and visualize information through natural language queries.

## Architecture

This project consists of two main components:

### Backend (FastAPI)
- **Location**: `backend/`
- **Technology**: Python FastAPI with async HTTP client
- **Purpose**: API server that communicates with Snowflake AI agents
- **Port**: 8000

### Frontend (React)
- **Location**: `frontend/`
- **Technology**: React 19 with Vite, Tailwind CSS
- **Purpose**: Modern web interface with chat functionality and data visualization
- **Port**: 5173 (development)

## Features

### Core Functionality
- **Natural Language Chat**: Conversational AI powered by Snowflake Cortex
- **Data Visualization**: Automatic chart generation using Vega-Lite
- **Table Display**: Structured data presentation from database queries
- **Voice Input**: Speech-to-text integration for hands-free interaction
- **Real-time Responses**: Streaming responses with status indicators

### User Interface
- **Animated AI Avatar**: Visual feedback showing AI state (idle, listening, thinking, speaking)
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Theme**: Modern UI with Tailwind CSS
- **Authentication**: Secure login system
- **Chat History**: Persistent conversation tracking

### Technical Features
- **CORS Enabled**: Cross-origin requests for frontend-backend communication
- **Error Handling**: Comprehensive error management and user feedback
- **Health Checks**: System monitoring endpoints
- **Environment Configuration**: Secure credential management with .env files

## Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **httpx**: Async HTTP client for Snowflake API calls
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management
- **uvicorn**: ASGI server for production deployment

### Frontend
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Speech Recognition**: Voice input functionality
- **Vega & Vega-Lite**: Declarative data visualization
- **Recharts**: Additional charting library

## Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Snowflake Account** with AI agent configured
- **Git** for version control

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aquila-hotel-ai
```

### 2. Backend Setup

Navigate to backend directory:
```bash
cd backend
```

Create virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure environment variables by creating `.env` file:
```env
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
SNOWFLAKE_TOKEN=your-snowflake-token
AGENT_DB=CAREONE_CROWNPALACE
AGENT_SCHEMA=DATA
AGENT_NAME=CAREONE_HOTEL_AGENT
```

Start the backend server:
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

Navigate to frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## API Documentation

### Health Check
```http
GET /health
```
Returns system status and configuration validation.

### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "text": "Show me today's bookings"
    }
  ]
}
```

**Response:**
```json
{
  "text": "Here are today's bookings...",
  "tableData": [
    {"room": "101", "guest": "John Doe", "checkin": "2024-01-15"}
  ],
  "vegaChart": "{...vega-spec...}"
}
```

## Configuration

### Snowflake Setup
1. Ensure you have a Snowflake account with Cortex enabled
2. Create or configure an AI agent in your database
3. Generate an API token with appropriate permissions
4. Update environment variables in `backend/.env`

### Environment Variables
- `SNOWFLAKE_ACCOUNT`: Your Snowflake account URL
- `SNOWFLAKE_TOKEN`: API authentication token
- `AGENT_DB`: Database containing the AI agent
- `AGENT_SCHEMA`: Schema where agent is located
- `AGENT_NAME`: Name of the configured AI agent

## Development

### Running Tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm run lint
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend (using Docker or direct deployment)
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Deployment

### Backend Deployment
- Use uvicorn or gunicorn for production
- Configure reverse proxy (nginx) for SSL termination
- Set up environment variables securely
- Enable logging and monitoring

### Frontend Deployment
- Build static files with `npm run build`
- Serve with any static file server
- Configure API base URL for production backend

## Security Considerations

- Store API keys securely (never commit to version control)
- Use HTTPS in production
- Implement proper CORS policies
- Validate user inputs
- Monitor API usage and rate limits

## Troubleshooting

### Common Issues

**Backend Connection Errors:**
- Verify Snowflake credentials in `.env`
- Check network connectivity to Snowflake
- Ensure agent exists and is accessible

**Frontend Build Issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**Speech Recognition Not Working:**
- Requires HTTPS in production
- Check browser microphone permissions
- Verify browser compatibility

### Debug Mode
Enable debug logging by setting environment variables or modifying print statements in the code.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Add your license information here]

## Support

For support and questions:
- Check the troubleshooting section
- Review Snowflake documentation
- Open an issue in the repository</content>
<parameter name="filePath">H:\Analytx4t\snowflake_Intelligence\website connect db\WebChat(fullstack_snowflake)\chat_snowflake_code_02(addon)\vscode_running\aquila-hotel-ai\README.md