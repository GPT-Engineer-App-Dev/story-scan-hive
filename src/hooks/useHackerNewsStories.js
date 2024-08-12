import { useState, useMemo } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';

// Function to fetch details of a single story
const fetchStoryDetails = async (id) => {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch story details');
  }
  return response.json();
};

export const useHackerNewsStories = () => {
  // State for storing the search query
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch top 100 story IDs
  const topStoriesQuery = useQueries({
    queries: [
      {
        queryKey: ['topStories'],
        queryFn: async () => {
          const response = await fetch(
            'https://hacker-news.firebaseio.com/v0/topstories.json'
          );
          if (!response.ok) {
            throw new Error('Failed to fetch top stories');
          }
          const ids = await response.json();
          return ids.slice(0, 100); // Get only top 100 IDs
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      },
    ],
  })[0];

  // Fetch details for each story ID
  const storyQueries = useQueries({
    queries: (topStoriesQuery.data || []).map((id) => ({
      queryKey: ['story', id],
      queryFn: () => fetchStoryDetails(id),
      staleTime: 5 * 60 * 1000, // Cache each story for 5 minutes
    })),
    enabled: !!topStoriesQuery.data, // Only run if we have story IDs
  });

  // Filter and sort stories based on time, search query, and score
  const filteredStories = useMemo(() => {
    const stories = storyQueries
      .filter((query) => query.status === 'success')
      .map((query) => query.data);

    if (stories.length === 0) return [];

    const oneDayAgo = Date.now() / 1000 - 86400; // 24 hours ago in seconds
    return stories
      .filter((story) => story.time > oneDayAgo) // Filter stories from last 24 hours
      .filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (story.url && story.url.toLowerCase().includes(searchQuery.toLowerCase()))
      ) // Apply search filter
      .sort((a, b) => b.score - a.score) // Sort by score (descending)
      .slice(0, 100); // Limit to top 100
  }, [storyQueries, searchQuery]);

  // Determine loading state
  const isLoading = topStoriesQuery.isLoading || storyQueries.some((query) => query.isLoading);
  
  // Determine error state
  const error = topStoriesQuery.error || storyQueries.find((query) => query.error)?.error;

  // Function to update search query
  const searchStories = (query) => {
    setSearchQuery(query);
  };

  return {
    stories: filteredStories,
    isLoading,
    error,
    searchStories,
  };
};