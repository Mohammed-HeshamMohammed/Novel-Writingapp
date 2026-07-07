import React, { useState } from 'react';
import { Calendar, Clock, Bookmark, BookmarkCheck, Share2, Eye, Tag, Trash2 } from 'lucide-react';
import type { StoryMetadata } from '../../../shared/types/story';

interface StoryGridProps {
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
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m read`;
};

export const StoryGrid: React.FC<StoryGridProps> = ({
  story,
  onOpen,
  onBookmark,
  onDelete
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

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

  const coverImageUrl = story.coverImage || `https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop`;
  const progress = Math.max(0, Math.min(100, story.readingProgress || 0));

  const actionButtonClass =
    'p-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors';

  return (
    <div
      className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-200 dark:bg-gray-800"
      onClick={() => onOpen(story.id)}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        className={`absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        src={coverImageUrl}
        alt={`Cover for ${story.title}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />

      {progress > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-10">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2">{story.title}</h3>
        <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">{story.author || 'Anonymous Author'}</p>
      </div>

      <div
        className={`absolute inset-0 p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-br from-black/90 to-black/70 text-white transition-opacity duration-300 ${
          showPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2 flex-1">{story.title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleBookmark}
                className={actionButtonClass}
                disabled={isBookmarking}
                title={story.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                aria-label={story.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                {story.isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShare}
                className={actionButtonClass}
                title="Share story"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className={actionButtonClass}
                disabled={isDeleting}
                title="Delete story"
                aria-label="Delete story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-white/80 text-xs sm:text-sm font-medium mb-2">{story.author || 'Anonymous Author'}</p>

          {story.description && (
            <p className="hidden sm:block text-white/90 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-3">
              {story.description}
            </p>
          )}
        </div>

        <div>
          <div className="flex flex-col gap-1.5 mb-2 text-white/80 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {formatDate(story.updatedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 flex-shrink-0" />
              {formatReadingTime(story.readingTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 flex-shrink-0" />
              {story.chapterCount} chapters
            </span>
          </div>

          {story.category && (
            <div className="mb-2">
              <span className="inline-block px-2.5 py-0.5 bg-blue-500 text-white rounded-full text-[11px] font-medium">
                {story.category}
              </span>
            </div>
          )}

          {story.tags && story.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {story.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-lg text-[11px] text-white/90"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
