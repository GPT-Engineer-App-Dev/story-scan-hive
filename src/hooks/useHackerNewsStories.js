import { useState, useMemo } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';

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
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

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
          return ids.slice(0, 100);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    ],
  })[0];

  const storyQueries = useQueries({
    queries: (topStoriesQuery.data || []).map((id) => ({
      queryKey: ['story', id],
      queryFn: () => fetchStoryDetails(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
    enabled: !!topStoriesQuery.data,
  });

  const filteredStories = useMemo(() => {
    const stories = storyQueries
      .filter((query) => query.status === 'success')
      .map((query) => query.data);

    if (stories.length === 0) return [];

    const oneDayAgo = Date.now() / 1000 - 86400;
    return stories
      .filter((story) => story.time > oneDayAgo)
      .filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (story.url && story.url.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }, [storyQueries, searchQuery]);

  const isLoading = topStoriesQuery.isLoading || storyQueries.some((query) => query.isLoading);
  const error = topStoriesQuery.error || storyQueries.find((query) => query.error)?.error;

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