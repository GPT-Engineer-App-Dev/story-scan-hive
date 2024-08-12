import React from 'react';
import StoryList from './StoryList';
import SearchBar from './SearchBar';
import { useHackerNewsStories } from '../hooks/useHackerNewsStories';

const HackerNewsApp = () => {
  // Use our custom hook to fetch and manage Hacker News stories
  const { stories, isLoading, error, searchStories } = useHackerNewsStories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Top 100 Daily Hacker News Stories</h1>
      {/* Search component */}
      <SearchBar onSearch={searchStories} />
      {/* Error handling */}
      {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
      {/* Story list component */}
      <StoryList stories={stories} isLoading={isLoading} />
    </div>
  );
};

export default HackerNewsApp;