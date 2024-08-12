import React, { useState } from 'react';
import { ArrowUpCircle, ExternalLink, Clock, MessageSquare } from 'lucide-react';
import StoryComments from './StoryComments';

const StoryItem = ({ story }) => {
  const [showComments, setShowComments] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
      <div className="flex items-center text-gray-600 mb-2 space-x-4">
        <div className="flex items-center">
          <ArrowUpCircle className="w-4 h-4 mr-1" />
          <span>{story.score} points</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{formatDate(story.time)}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{story.descendants || 0} comments</span>
        </div>
      </div>
      <div className="flex space-x-4">
        {story.url && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            Read more
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-600 hover:underline"
        >
          {showComments ? 'Hide comments' : 'Show comments'}
        </button>
      </div>
      {showComments && <StoryComments storyId={story.id} />}
    </div>
  );
};

export default StoryItem;