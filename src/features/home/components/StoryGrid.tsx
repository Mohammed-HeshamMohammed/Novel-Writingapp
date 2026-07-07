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

  const MetaInfo = () => (
    <div className="story-meta">
      <div className="meta-item">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(story.updatedAt)}</span>
      </div>
      <div className="meta-item">
        <Clock className="w-4 h-4" />
        <span>{formatReadingTime(story.readingTime)}</span>
      </div>
      <div className="meta-item">
        <Eye className="w-4 h-4" />
        <span>{story.chapterCount} chapters</span>
      </div>
    </div>
  );

  const Actions = () => (
    <div className="story-actions">
      <button
        onClick={handleBookmark}
        className={`action-button ${story.isBookmarked ? 'bookmarked' : ''}`}
        disabled={isBookmarking}
        title={story.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        aria-label={story.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        {story.isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>
      <button 
        onClick={handleShare} 
        className="action-button"
        title="Share story"
        aria-label="Share story"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete} 
        className="action-button delete-button"
        disabled={isDeleting}
        title="Delete story"
        aria-label="Delete story"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const Tags = () => (
    story.tags && story.tags.length > 0 && (
      <div className="story-tags">
        {story.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="story-tag">
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>
    )
  );

  const ProgressBar = () => {
    const progress = Math.max(0, Math.min(100, story.readingProgress || 0));
    return (
      story.readingProgress && story.readingProgress > 0 && (
        <div className="reading-progress">
          <progress className="progress-bar" value={progress} max={100}>
            {progress}%
          </progress>
        </div>
      )
    );
  };

  return (
    <div
      className="story-card dark:bg-gray-800 dark:border-gray-700"
      onClick={() => onOpen(story.id)}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className="story-image-container">
        <div className={`story-image-skeleton ${imageLoaded ? 'loaded' : ''}`}>
          <div className="skeleton-shimmer dark:bg-gray-700"></div>
        </div>
        <img
          src={coverImageUrl}
          alt={`Cover for ${story.title}`}
          className={`story-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        <ProgressBar />

        <div className="story-title-overlay">
          <h3 className="story-title dark:text-white">{story.title}</h3>
          <p className="story-author dark:text-gray-300">{story.author || 'Anonymous Author'}</p>
        </div>

        <div className={`story-details-overlay ${showPreview ? 'visible' : ''}`}>
          <div className="story-details-content">
            <div className="story-header">
              <h3 className="story-title dark:text-white">{story.title}</h3>
              <Actions />
            </div>
            <p className="story-author dark:text-gray-300">{story.author || 'Anonymous Author'}</p>
            {story.description && (
              <p className="story-description dark:text-gray-300">{story.description}</p>
            )}
            <MetaInfo />
            {story.category && (
              <div className="story-category">
                <span className="category-badge dark:bg-gray-700 dark:text-gray-300">{story.category}</span>
              </div>
            )}
            <Tags />
          </div>
        </div>
      </div>
    </div>
  );
};