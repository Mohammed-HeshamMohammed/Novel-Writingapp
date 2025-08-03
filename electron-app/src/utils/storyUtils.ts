import type { Story, Chapter } from '../types/story';

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const calculateWordCount = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

export const calculateReadingTime = (wordCount: number) => Math.ceil(wordCount / 225);

export const createNewChapter = (title = 'New Chapter', content = ''): Chapter => {
  const now = new Date();
  return {
    id: generateId(),
    title,
    content,
    wordCount: calculateWordCount(content),
    createdAt: now,
    updatedAt: now,
  };
};

export const createNewStory = (title = 'New Story', description = ''): Story => {
  const now = new Date();
  const categories = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Thriller'];
  const tags = ['adventure', 'drama', 'comedy', 'action', 'suspense', 'historical', 'contemporary'];
  
  return {
    id: generateId(),
    title,
    description,
    chapters: [],
    characters: [],
    locations: [],
    timeline: [],
    createdAt: now,
    updatedAt: now,
    totalWords: 0,
    author: 'Anonymous Author',
    category: categories[Math.floor(Math.random() * categories.length)],
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
    readingTime: 0,
    isBookmarked: false,
    readingProgress: Math.floor(Math.random() * 100),
    popularity: Math.floor(Math.random() * 1000),
  };
};

export const updateStoryWordCount = (story: Story): Story => {
  const totalWords = story.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
  const readingTime = calculateReadingTime(totalWords);
  
  return {
    ...story,
    totalWords,
    readingTime,
    updatedAt: new Date(),
  };
};

export const parseTextIntoChapters = (text: string): Chapter[] => {
  try {
    const chapters: Chapter[] = [];
    const chapterRegex = /(?:^|\n)(?:Chapter|CHAPTER|Ch\.|Ch)\s*(\d+|[IVX]+)[:\s]*(.*?)(?=\n(?:Chapter|CHAPTER|Ch\.|Ch)\s*(?:\d+|[IVX]+)|$)/gis;
    
    let match;
    
    while ((match = chapterRegex.exec(text)) !== null) {
      const chapterNumber = match[1];
      const chapterTitle = match[2]?.trim() || `Chapter ${chapterNumber}`;
      const chapterContent = match[0].replace(/^(?:Chapter|CHAPTER|Ch\.|Ch)\s*(\d+|[IVX]+)[:\s]*.*?\n?/i, '').trim();
      
      chapters.push(createNewChapter(chapterTitle, chapterContent));
    }
    
    if (chapters.length === 0) {
      chapters.push(createNewChapter('Chapter 1', text.trim()));
    }
    
    return chapters;
  } catch (error) {
    console.error('Error parsing text into chapters:', error);
    return [createNewChapter('Chapter 1', text.trim())];
  }
};

export const exportStoryAsText = (story: Story) => {
  try {
    let output = `${story.title}\n${'='.repeat(story.title.length)}\n\n`;
    
    if (story.author) output += `By: ${story.author}\n\n`;
    if (story.description) output += `${story.description}\n\n`;
    
    story.chapters.forEach((chapter, index) => {
      output += `Chapter ${index + 1}: ${chapter.title}\n${'-'.repeat(chapter.title.length + 12)}\n\n${chapter.content}\n\n`;
    });
    
    return output;
  } catch (error) {
    console.error('Error exporting story as text:', error);
    return `Error exporting story: ${story.title}`;
  }
};

export const downloadTextFile = (content: string, filename: string) => {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading text file:', error);
  }
};