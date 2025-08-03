import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import ebooklib
from ebooklib import epub
from models import Story

class FileExporter:
    def __init__(self):
        self.styles = getSampleStyleSheet()
    
    def export_story(self, story: Story, format: str, options: Dict[str, Any] = None) -> bytes:
        try:
            if format == 'txt':
                return self._export_txt(story, options or {})
            elif format == 'pdf':
                return self._export_pdf(story, options or {})
            elif format == 'epub':
                return self._export_epub(story, options or {})
            else:
                raise ValueError(f"Unsupported export format: {format}")
        except Exception as e:
            raise Exception(f"Failed to export story: {str(e)}")
    
    def _export_txt(self, story: Story, options: Dict[str, Any]) -> bytes:
        try:
            output = []
            
            output.append(f"Title: {story.title}")
            output.append(f"Author: {story.author}")
            output.append(f"Description: {story.description}")
            output.append("\n" + "="*50 + "\n")
            
            for chapter in sorted(story.chapters, key=lambda x: x.order):
                output.append(f"\n{chapter.title}\n")
                output.append("-" * len(chapter.title))
                output.append(f"\n{chapter.content}\n")
            
            return '\n'.join(output).encode('utf-8')
        except Exception as e:
            raise Exception(f"Failed to export TXT: {str(e)}")
    
    def _export_pdf(self, story: Story, options: Dict[str, Any]) -> bytes:
        try:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            content = []
            
            title_style = self.styles['Title']
            heading_style = self.styles['Heading1']
            normal_style = self.styles['Normal']
            
            content.append(Paragraph(story.title, title_style))
            content.append(Spacer(1, 12))
            content.append(Paragraph(f"Author: {story.author}", normal_style))
            content.append(Paragraph(f"Description: {story.description}", normal_style))
            content.append(Spacer(1, 24))
            
            for chapter in sorted(story.chapters, key=lambda x: x.order):
                content.append(Paragraph(chapter.title, heading_style))
                content.append(Spacer(1, 12))
                
                paragraphs = chapter.content.split('\n\n')
                for para in paragraphs:
                    if para.strip():
                        content.append(Paragraph(para.strip(), normal_style))
                        content.append(Spacer(1, 12))
                
                content.append(Spacer(1, 24))
            
            doc.build(content)
            buffer.seek(0)
            return buffer.read()
        except Exception as e:
            raise Exception(f"Failed to export PDF: {str(e)}")
    
    def _export_epub(self, story: Story, options: Dict[str, Any]) -> bytes:
        try:
            book = epub.EpubBook()
            
            book.set_identifier(story.id)
            book.set_title(story.title)
            book.set_language('en')
            book.add_author(story.author)
            book.add_metadata('DC', 'description', story.description)
            
            chapters = []
            spine = ['nav']
            
            for chapter in sorted(story.chapters, key=lambda x: x.order):
                epub_chapter = epub.EpubHtml(
                    title=chapter.title,
                    file_name=f'chapter_{chapter.order + 1}.xhtml',
                    lang='en'
                )
                
                content = f"<h1>{chapter.title}</h1>"
                paragraphs = chapter.content.split('\n\n')
                for para in paragraphs:
                    if para.strip():
                        content += f"<p>{para.strip()}</p>"
                
                epub_chapter.content = content
                book.add_item(epub_chapter)
                chapters.append(epub_chapter)
                spine.append(epub_chapter)
            
            book.toc = [(epub.Link(f'chapter_{i+1}.xhtml', chapter.title, f'chapter_{i+1}'), []) 
                       for i, chapter in enumerate(sorted(story.chapters, key=lambda x: x.order))]
            
            book.add_item(epub.EpubNcx())
            book.add_item(epub.EpubNav())
            
            style = '''
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            p { margin: 1em 0; line-height: 1.6; }
            '''
            nav_css = epub.EpubItem(uid="nav_css", file_name="style/nav.css", media_type="text/css", content=style)
            book.add_item(nav_css)
            
            book.spine = spine
            
            buffer = io.BytesIO()
            epub.write_epub(buffer, book)
            buffer.seek(0)
            return buffer.read()
        except Exception as e:
            raise Exception(f"Failed to export EPUB: {str(e)}")