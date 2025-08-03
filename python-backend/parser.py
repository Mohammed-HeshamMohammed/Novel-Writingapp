import re
import uuid
from datetime import datetime
from typing import List
from pathlib import Path
import PyPDF2
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from models import Story, Chapter

class FileParser:
    def __init__(self):
        self.chapter_patterns = [
            r'^Chapter\s+\d+',
            r'^CHAPTER\s+\d+',
            r'^\d+\.',
            r'^Part\s+\d+',
            r'^Section\s+\d+'
        ]
    
    def parse_file(self, file_data: bytes, file_name: str, file_type: str) -> Story:
        try:
            if file_type == 'txt':
                return self._parse_txt(file_data, file_name)
            elif file_type == 'pdf':
                return self._parse_pdf(file_data, file_name)
            elif file_type == 'epub':
                return self._parse_epub(file_data, file_name)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            raise Exception(f"Failed to parse file: {str(e)}")
    
    def _parse_txt(self, file_data: bytes, file_name: str) -> Story:
        try:
            text = file_data.decode('utf-8')
            chapters = self._split_into_chapters(text)
            
            return Story(
                id=str(uuid.uuid4()),
                title=Path(file_name).stem,
                author="Unknown",
                description="Imported from text file",
                chapters=chapters,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        except Exception as e:
            raise Exception(f"Failed to parse TXT: {str(e)}")
    
    def _parse_pdf(self, file_data: bytes, file_name: str) -> Story:
        try:
            from io import BytesIO
            
            pdf_reader = PyPDF2.PdfReader(BytesIO(file_data))
            text = ""
            
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            chapters = self._split_into_chapters(text)
            
            return Story(
                id=str(uuid.uuid4()),
                title=Path(file_name).stem,
                author="Unknown",
                description="Imported from PDF file",
                chapters=chapters,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        except Exception as e:
            raise Exception(f"Failed to parse PDF: {str(e)}")
    
    def _parse_epub(self, file_data: bytes, file_name: str) -> Story:
        try:
            from io import BytesIO
            
            book = epub.read_epub(BytesIO(file_data))
            chapters = []
            
            for item in book.get_items():
                if item.get_type() == ebooklib.ITEM_DOCUMENT:
                    soup = BeautifulSoup(item.get_content(), 'html.parser')
                    content = soup.get_text()
                    
                    if content.strip():
                        chapters.append(Chapter(
                            id=str(uuid.uuid4()),
                            title=f"Chapter {len(chapters) + 1}",
                            content=content.strip(),
                            order=len(chapters)
                        ))
            
            if not chapters:
                chapters = [Chapter(
                    id=str(uuid.uuid4()),
                    title="Chapter 1",
                    content="No content found",
                    order=0
                )]
            
            return Story(
                id=str(uuid.uuid4()),
                title=book.get_metadata('DC', 'title')[0][0] if book.get_metadata('DC', 'title') else Path(file_name).stem,
                author=book.get_metadata('DC', 'creator')[0][0] if book.get_metadata('DC', 'creator') else "Unknown",
                description=book.get_metadata('DC', 'description')[0][0] if book.get_metadata('DC', 'description') else "Imported from EPUB file",
                chapters=chapters,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        except Exception as e:
            raise Exception(f"Failed to parse EPUB: {str(e)}")
    
    def _split_into_chapters(self, text: str) -> List[Chapter]:
        try:
            lines = text.split('\n')
            chapters = []
            current_chapter = []
            current_title = "Chapter 1"
            chapter_num = 1
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                is_chapter_start = any(re.match(pattern, line, re.IGNORECASE) for pattern in self.chapter_patterns)
                
                if is_chapter_start and current_chapter:
                    chapters.append(Chapter(
                        id=str(uuid.uuid4()),
                        title=current_title,
                        content='\n'.join(current_chapter).strip(),
                        order=len(chapters)
                    ))
                    current_chapter = []
                    current_title = line
                    chapter_num += 1
                else:
                    if is_chapter_start:
                        current_title = line
                    else:
                        current_chapter.append(line)
            
            if current_chapter:
                chapters.append(Chapter(
                    id=str(uuid.uuid4()),
                    title=current_title,
                    content='\n'.join(current_chapter).strip(),
                    order=len(chapters)
                ))
            
            if not chapters:
                chapters = [Chapter(
                    id=str(uuid.uuid4()),
                    title="Chapter 1",
                    content=text.strip(),
                    order=0
                )]
            
            return chapters
        except Exception as e:
            raise Exception(f"Failed to split into chapters: {str(e)}")