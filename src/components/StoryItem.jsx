import React, { useState } from 'react';
import { ArrowUpCircle, ExternalLink, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import StoryComments from './StoryComments';

const StoryItem = ({ story }) => {
  const [showComments, setShowComments] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 transition duration-300 hover:shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">{story.title}</h2>
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 space-x-4">
          <div className="flex items-center">
            <ArrowUpCircle className="w-4 h-4 mr-1 text-orange-500" />
            <span>{story.score} points</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-500" />
            <span>{formatDate(story.time)}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1 text-green-500" />
            <span>{story.descendants || 0} comments</span>
          </div>
        </div>
        <div className="flex space-x-4">
          {story.url && (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Read more
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center text-green-600 hover:text-green-800 transition duration-300"
          >
            {showComments ? 'Hide comments' : 'Show comments'}
            {showComments ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
      {showComments && (
        <div className="bg-gray-50 border-t border-gray-200">
          <StoryComments storyId={story.id} />
        </div>
      )}
    </div>
  );
};

export default StoryItem;