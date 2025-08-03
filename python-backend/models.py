from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Chapter(BaseModel):
    id: str
    title: str
    content: str
    order: int

class Story(BaseModel):
    id: str
    title: str
    author: str
    description: str
    chapters: List[Chapter]
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, Any] = {}

class StoryMetadata(BaseModel):
    id: str
    title: str
    author: str
    description: str
    chapter_count: int
    created_at: datetime
    updated_at: datetime
    file_path: str

class ImportRequest(BaseModel):
    file_data: bytes
    file_name: str
    file_type: str

class ExportRequest(BaseModel):
    story: Story
    format: str
    options: Dict[str, Any] = {}

class SaveRequest(BaseModel):
    story: Story
    file_path: Optional[str] = None

class LoadRequest(BaseModel):
    file_path: str