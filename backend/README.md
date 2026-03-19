# Aquila Hotel AI - Backend

FastAPI-based backend service that serves as the bridge between the React frontend and Snowflake AI agents. This service handles authentication, API communication, and data processing for the hotel intelligence chat system.

## Features

- **FastAPI Framework**: High-performance async web API
- **Snowflake Integration**: Direct communication with Snowflake Cortex AI agents
- **CORS Support**: Cross-origin requests enabled for frontend integration
- **Data Processing**: Automatic parsing of AI responses including text, tables, and charts
- **Error Handling**: Comprehensive error management with detailed logging
- **Health Monitoring**: System health checks and configuration validation
- **Environment Configuration**: Secure credential management

## Tech Stack

- **FastAPI**: Modern Python web framework
- **httpx**: Async HTTP client for API calls
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable loading
- **uvicorn**: ASGI server

## Prerequisites

- Python 3.8+
- Snowflake account with AI agent configured
- API token with appropriate permissions

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Create a `.env` file in the backend directory:

```env
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
SNOWFLAKE_TOKEN=your-api-token-here
AGENT_DB=CAREONE_CROWNPALACE
AGENT_SCHEMA=DATA
AGENT_NAME=CAREONE_HOTEL_AGENT
```

### Configuration Parameters

- `SNOWFLAKE_ACCOUNT`: Your Snowflake account URL (without https://)
- `SNOWFLAKE_TOKEN`: Bearer token for API authentication
- `AGENT_DB`: Database name containing the AI agent
- `AGENT_SCHEMA`: Schema name where the agent is located
- `AGENT_NAME`: Name of the configured AI agent

## Running the Server

### Development Mode
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### GET /health
Health check endpoint that validates configuration.

**Response:**
```json
{
  "status": "ok",
  "snowflake_configured": true
}
```

### POST /api/chat
Main chat endpoint for communicating with Snowflake AI agent.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "text": "Show me room occupancy for today"
    }
  ]
}
```

**Response:**
```json
{
  "text": "Here is the current room occupancy...",
  "tableData": [
    {
      "room_number": "101",
      "status": "occupied",
      "guest_name": "John Doe"
    }
  ],
  "vegaChart": "{ \"mark\": \"bar\", ... }"
}
```

## Data Processing

The backend automatically processes Snowflake AI responses to extract:

- **Text Content**: Natural language responses
- **Table Data**: Structured data from SQL queries
- **Charts**: Vega-Lite specifications for visualization

## Error Handling

The API returns appropriate HTTP status codes:

- `400`: Bad Request (invalid input)
- `500`: Internal Server Error (Snowflake issues)
- `502`: Bad Gateway (connection problems)
- `504`: Gateway Timeout (request timeout)

## Logging

The server provides detailed logging for:

- Configuration status on startup
- Incoming requests and message counts
- API calls to Snowflake
- Response processing and data extraction
- Error conditions with stack traces

## Security

- API tokens are loaded from environment variables only
- CORS is configured for frontend origin
- Input validation using Pydantic models
- HTTPS recommended for production

## Dependencies

Key packages in `requirements.txt`:

```
fastapi>=0.104.0
httpx>=0.25.0
pydantic>=2.0.0
python-dotenv>=1.0.0
uvicorn[standard]>=0.24.0
```

## Development

### Running Tests
```bash
python -m pytest
```

### Code Formatting
```bash
pip install black
black main.py
```

### Type Checking
```bash
pip install mypy
mypy main.py
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Systemd Service
Create `/etc/systemd/system/aquila-backend.service`:

```ini
[Unit]
Description=Aquila Hotel AI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Common Issues

**Snowflake Connection Failed:**
- Verify account URL and token
- Check network connectivity
- Ensure agent exists and is accessible

**Timeout Errors:**
- Increase timeout in httpx client
- Check Snowflake service status
- Verify agent performance

**CORS Errors:**
- Confirm frontend URL in CORS origins
- Check request headers

### Debug Mode
Enable detailed logging by modifying print statements or adding logging configuration.

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints for new functions
3. Update documentation for API changes
4. Test thoroughly before submitting PRs</content>
<parameter name="filePath">H:\Analytx4t\snowflake_Intelligence\website connect db\WebChat(fullstack_snowflake)\chat_snowflake_code_02(addon)\vscode_running\aquila-hotel-ai\backend\README.md