import json
import os
from datetime import datetime
from typing import List, Optional
from pathlib import Path
from models import Story, StoryMetadata

class StorageManager:
    def __init__(self, stories_dir: str = "stories"):
        self.stories_dir = Path(stories_dir)
        self.stories_dir.mkdir(exist_ok=True)
        
    def save_story(self, story: Story, file_path: Optional[str] = None) -> str:
        try:
            if not file_path:
                file_path = self.stories_dir / f"{story.id}.json"
            else:
                file_path = Path(file_path)
                
            story.updated_at = datetime.now()
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(story.model_dump(), f, indent=2, default=str)
                
            return str(file_path)
        except Exception as e:
            raise Exception(f"Failed to save story: {str(e)}")
    
    def load_story(self, file_path: str) -> Story:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return Story(**data)
        except Exception as e:
            raise Exception(f"Failed to load story: {str(e)}")
    
    def get_recent_stories(self, limit: int = 10) -> List[StoryMetadata]:
        try:
            stories = []
            for file_path in self.stories_dir.glob("*.json"):
                try:
                    story = self.load_story(file_path)
                    metadata = StoryMetadata(
                        id=story.id,
                        title=story.title,
                        author=story.author,
                        description=story.description,
                        chapter_count=len(story.chapters),
                        created_at=story.created_at,
                        updated_at=story.updated_at,
                        file_path=str(file_path)
                    )
                    stories.append(metadata)
                except:
                    continue
            
            stories.sort(key=lambda x: x.updated_at, reverse=True)
            return stories[:limit]
        except Exception as e:
            raise Exception(f"Failed to get recent stories: {str(e)}")
    
    def delete_story(self, file_path: str) -> bool:
        try:
            Path(file_path).unlink()
            return True
        except Exception as e:
            raise Exception(f"Failed to delete story: {str(e)}")
    
    def story_exists(self, file_path: str) -> bool:
        return Path(file_path).exists()