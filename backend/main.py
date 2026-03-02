# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
import httpx
import os
import json
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Snowflake Config
SNOWFLAKE_ACCOUNT = os.getenv("SNOWFLAKE_ACCOUNT")
SNOWFLAKE_TOKEN = os.getenv("SNOWFLAKE_TOKEN")
AGENT_DB = os.getenv("AGENT_DB", "CAREONE_CROWNPALACE")
AGENT_SCHEMA = os.getenv("AGENT_SCHEMA", "DATA")
AGENT_NAME = os.getenv("AGENT_NAME", "CAREONE_HOTEL_AGENT")

# Debug: Print config on startup
print("=" * 50)
print("🔧 BACKEND CONFIGURATION:")
print(f"   SNOWFLAKE_ACCOUNT: {SNOWFLAKE_ACCOUNT}")
print(f"   SNOWFLAKE_TOKEN: {'SET ✅' if SNOWFLAKE_TOKEN else 'NOT SET ❌'}")
print(f"   AGENT_DB: {AGENT_DB}")
print(f"   AGENT_SCHEMA: {AGENT_SCHEMA}")
print(f"   AGENT_NAME: {AGENT_NAME}")
print("=" * 50)


class Message(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    messages: List[Message]


class ChatResponse(BaseModel):
    text: str
    tableData: Optional[List[Any]] = None
    vegaChart: Optional[str] = None


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "snowflake_configured": bool(SNOWFLAKE_ACCOUNT and SNOWFLAKE_TOKEN)
    }


@app.post("/api/chat")
async def chat_with_agent(request: ChatRequest):
    print("\n" + "=" * 50)
    print("📨 NEW REQUEST RECEIVED")
    print(f"   Messages count: {len(request.messages)}")
    
    # Check configuration
    if not SNOWFLAKE_ACCOUNT:
        print("❌ ERROR: SNOWFLAKE_ACCOUNT not set")
        raise HTTPException(status_code=500, detail="SNOWFLAKE_ACCOUNT not configured")
    
    if not SNOWFLAKE_TOKEN:
        print("❌ ERROR: SNOWFLAKE_TOKEN not set")
        raise HTTPException(status_code=500, detail="SNOWFLAKE_TOKEN not configured")
    
    try:
        # Snowflake Agent API URL
        url = f"https://{SNOWFLAKE_ACCOUNT}.snowflakecomputing.com/api/v2/databases/{AGENT_DB}/schemas/{AGENT_SCHEMA}/agents/{AGENT_NAME}:run"
        print(f"🌐 Calling: {url}")
        
        headers = {
            "Authorization": f"Bearer {SNOWFLAKE_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Format messages for Snowflake
        formatted_messages = []
        for m in request.messages:
            formatted_messages.append({
                "role": "assistant" if m.role in ["bot", "assistant"] else "user",
                "content": [{"type": "text", "text": m.text}]
            })
        
        print(f"📤 Sending {len(formatted_messages)} messages to Snowflake")
        
        # Make API call
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json={"messages": formatted_messages}
            )
        
        print(f"📥 Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Snowflake Error: {response.text[:500]}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Snowflake API error: {response.text[:200]}"
            )
        
        # Parse Response
        raw_text = response.text
        bot_reply = ""
        extracted_data = None
        vega_chart = None
        
        lines = raw_text.strip().split('\n')
        for i, line in enumerate(lines):
            if line.strip() == "event: response" and i + 1 < len(lines):
                data_line = lines[i + 1]
                if data_line.startswith("data: "):
                    try:
                        parsed = json.loads(data_line.replace("data: ", ""))
                        
                        for item in parsed.get("content", []):
                            # Text
                            if item.get("type") == "text" and item.get("text"):
                                bot_reply += item["text"].strip() + "\n\n"
                            
                            # Vega Chart
                            if item.get("type") == "chart":
                                chart_data = item.get("chart", {})
                                if chart_data.get("chart_spec"):
                                    vega_chart = chart_data["chart_spec"]
                                    print("📈 Vega chart found!")
                            
                            # Table Data from tool_result
                            if item.get("type") == "tool_result":
                                tool_result = item.get("tool_result", {})
                                for tc in tool_result.get("content", []):
                                    if tc.get("type") == "json":
                                        json_data = tc.get("json", {})
                                        result_set = json_data.get("result_set")
                                        if result_set:
                                            rows = result_set.get("data", [])
                                            meta = result_set.get("resultSetMetaData", {})
                                            columns = meta.get("rowType", [])
                                            
                                            if rows and columns:
                                                extracted_data = []
                                                for row in rows:
                                                    obj = {}
                                                    for idx, col in enumerate(columns):
                                                        value = row[idx] if idx < len(row) else None
                                                        # Convert numeric strings
                                                        if isinstance(value, str):
                                                            try:
                                                                if '.' in value:
                                                                    value = float(value)
                                                                elif value.isdigit():
                                                                    value = int(value)
                                                            except:
                                                                pass
                                                        obj[col["name"]] = value
                                                    extracted_data.append(obj)
                                                print(f"📊 Extracted {len(extracted_data)} data rows")
                    except json.JSONDecodeError as e:
                        print(f"⚠️ JSON parse error: {e}")
                        continue
        
        if not bot_reply:
            bot_reply = "I received your message but couldn't generate a response."
        
        print(f"✅ Response ready: {len(bot_reply)} chars")
        print(f"   Data rows: {len(extracted_data) if extracted_data else 0}")
        print(f"   Has chart: {'Yes' if vega_chart else 'No'}")
        print("=" * 50 + "\n")
        
        return ChatResponse(
            text=bot_reply.strip(),
            tableData=extracted_data,
            vegaChart=vega_chart
        )
        
    except httpx.TimeoutException:
        print("❌ Timeout error")
        raise HTTPException(status_code=504, detail="Request to Snowflake timed out")
    
    except httpx.RequestError as e:
        print(f"❌ Request error: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to connect to Snowflake: {str(e)}")
    
    except Exception as e:
        print(f"❌ Unexpected error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)