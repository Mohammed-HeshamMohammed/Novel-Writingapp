import React, { useState } from 'react';
import { Calendar, Clock, Eye, Bookmark, BookmarkCheck, Share2, Trash2, Tag, TrendingUp } from 'lucide-react';
import type { StoryMetadata } from '../../../shared/types/story';

interface StoryListProps {
  story: StoryMetadata;
  onOpen: (id: string) => void;
  onBookmark: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: Date) => {
  const diffTime = Math.abs(new Date().getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const formatReadingTime = (minutes: number = 0) => {
  if (minutes < 60) return `${minutes}m read`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m read`;
};

export const StoryList: React.FC<StoryListProps> = ({ 
  story, 
  onOpen, 
  onBookmark, 
  onDelete
}) => {
  const [imgError, setImgError] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = async (e: React.MouseEvent, action: () => Promise<void>, setter: (value: boolean) => void) => {
    e.stopPropagation();
    if (isBookmarking || isDeleting) return;
    
    try {
      setter(true);
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setter(false);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => 
    handleAction(e, async () => onBookmark(story.id), setIsBookmarking);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting || !window.confirm('Are you sure you want to delete this story?')) return;
    
    try {
      setIsDeleting(true);
      await onDelete(story.id);
    } catch (error) {
      console.error('Delete failed:', error);
      setIsDeleting(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex h-full">
        <div className="relative flex-shrink-0 overflow-hidden w-48">
          <img
            src={imgError ? `https://picsum.photos/256/160?random=${story.id}` : 
                 story.coverImage || `https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop`}
            alt={`Cover for ${story.title}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {story.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/70 backdrop-blur-sm text-white">
                {story.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between cursor-pointer" onClick={() => onOpen(story.id)}>
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-3">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-lg mb-1">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {story.author || 'Anonymous Author'}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleBookmark}
                  disabled={isBookmarking}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={story.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  {story.isBookmarked ? 
                    <BookmarkCheck className="w-4 h-4 text-blue-500" /> :
                    <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  }
                </button>
                <button 
                  onClick={handleShare} 
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-500"
                  title="Share story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-500 hover:text-red-500"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {story.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {story.description}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(story.updatedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatReadingTime(story.readingTime)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {story.chapterCount} chapters
              </span>
              {story.popularity && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {story.popularity}
                </span>
              )}
            </div>

            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {story.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {story.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{story.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {story.readingProgress && story.readingProgress > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Reading Progress</span>
                  <span>{Math.round(story.readingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, story.readingProgress || 0))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};