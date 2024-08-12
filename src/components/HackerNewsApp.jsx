import React from 'react';
import StoryList from './StoryList';
import SearchBar from './SearchBar';
import { useHackerNewsStories } from '../hooks/useHackerNewsStories';
import { Newspaper } from 'lucide-react';

const HackerNewsApp = () => {
  const { stories, isLoading, error, searchStories } = useHackerNewsStories();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <Newspaper className="mr-2" />
              Hacker News Daily Top 100
            </h1>
            <SearchBar onSearch={searchStories} />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error.message}</p>
          </div>
        )}
        <StoryList stories={stories} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default HackerNewsApp;