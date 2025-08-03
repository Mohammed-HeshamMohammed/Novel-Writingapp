from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import base64
from models import *
from storage import StorageManager
from parser import FileParser
from exporter import FileExporter

app = FastAPI(title="Story Writer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

storage = StorageManager()
parser = FileParser()
exporter = FileExporter()

@app.post("/stories/save")
async def save_story(request: SaveRequest):
    try:
        file_path = storage.save_story(request.story, request.file_path)
        return {"success": True, "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stories/load")
async def load_story(request: LoadRequest):
    try:
        story = storage.load_story(request.file_path)
        return {"success": True, "story": story}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stories/import")
async def import_story(request: ImportRequest):
    try:
        file_data = base64.b64decode(request.file_data)
        story = parser.parse_file(file_data, request.file_name, request.file_type)
        return {"success": True, "story": story}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stories/export")
async def export_story(request: ExportRequest):
    try:
        file_data = exporter.export_story(request.story, request.format, request.options)
        encoded_data = base64.b64encode(file_data).decode('utf-8')
        
        content_types = {
            'txt': 'text/plain',
            'pdf': 'application/pdf',
            'epub': 'application/epub+zip'
        }
        
        return {
            "success": True,
            "file_data": encoded_data,
            "content_type": content_types.get(request.format, 'application/octet-stream')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stories/recent")
async def get_recent_stories(limit: int = 10):
    try:
        stories = storage.get_recent_stories(limit)
        return {"success": True, "stories": stories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/stories/{story_id}")
async def delete_story(story_id: str):
    try:
        file_path = storage.stories_dir / f"{story_id}.json"
        success = storage.delete_story(str(file_path))
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)