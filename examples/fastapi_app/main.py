"""Example FastAPI application with Agentation."""

import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from agentation import AgentationMiddleware

# Enable Agentation
os.environ["AGENTATION_ENABLED"] = "true"

app = FastAPI(title="Agentation FastAPI Example")

# Add Agentation middleware
app.add_middleware(AgentationMiddleware)

# Templates
templates = Jinja2Templates(directory=Path(__file__).parent / "templates")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/status")
async def status():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
