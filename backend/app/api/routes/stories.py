import base64
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["stories"])

# In-memory placeholder store, keyed by story id. Swap for a real database
# before relying on /stories/save for anything persistent.
_saved_stories: dict[str, dict[str, Any]] = {}


class SaveStoryRequest(BaseModel):
    story: dict[str, Any]


class ImportRequest(BaseModel):
    file_data: str  # base64-encoded file contents
    file_name: str
    file_type: str


class ExportRequest(BaseModel):
    story: dict[str, Any]
    format: str = "txt"
    options: dict[str, Any] = {}


def _new_chapter(title: str, content: str) -> dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "id": str(uuid.uuid4()),
        "title": title,
        "content": content,
        "wordCount": len(content.split()),
        "createdAt": now,
        "updatedAt": now,
    }


@router.post("/stories/save")
def save_story(payload: SaveStoryRequest) -> dict[str, Any]:
    story = payload.story
    story_id = story.get("id")
    if not story_id:
        raise HTTPException(status_code=400, detail="story.id is required")

    _saved_stories[story_id] = story
    return {"success": True}


@router.post("/stories/import")
def import_story(payload: ImportRequest) -> dict[str, Any]:
    try:
        raw_bytes = base64.b64decode(payload.file_data)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="file_data is not valid base64") from exc

    file_type = payload.file_type.lower()
    title = payload.file_name.rsplit(".", 1)[0]

    if file_type == "txt":
        text = raw_bytes.decode("utf-8", errors="replace")
    elif file_type == "pdf":
        try:
            from pypdf import PdfReader
            from io import BytesIO
        except ImportError as exc:
            raise HTTPException(
                status_code=501, detail="PDF import requires the 'pypdf' package"
            ) from exc
        reader = PdfReader(BytesIO(raw_bytes))
        text = "\n\n".join(page.extract_text() or "" for page in reader.pages)
    else:
        raise HTTPException(
            status_code=400, detail=f"Import format '{file_type}' is not supported yet"
        )

    return {"success": True, "story": {"chapters": [_new_chapter(title, text)]}}


@router.post("/stories/export")
def export_story(payload: ExportRequest) -> dict[str, Any]:
    if payload.format != "txt":
        raise HTTPException(
            status_code=400, detail=f"Export format '{payload.format}' is not supported yet"
        )

    story = payload.story
    parts = [story.get("title", "Untitled"), ""]
    for chapter in story.get("chapters", []):
        parts.append(chapter.get("title", "Untitled Chapter"))
        parts.append("")
        parts.append(chapter.get("content", ""))
        parts.append("")

    text = "\n".join(parts)
    file_data = base64.b64encode(text.encode("utf-8")).decode("ascii")

    return {"success": True, "file_data": file_data, "content_type": "text/plain"}
