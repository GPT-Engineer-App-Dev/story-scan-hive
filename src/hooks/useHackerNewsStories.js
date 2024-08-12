import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchTopStories = async () => {
  const response = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch top stories');
  }
  const ids = await response.json();
  return ids.slice(0, 100); // Get top 100 story IDs
};

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

  const { data: storyIds, isLoading: isLoadingIds, error: idsError } = useQuery({
    queryKey: ['topStoryIds'],
    queryFn: fetchTopStories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: stories, isLoading: isLoadingStories, error: storiesError } = useQuery({
    queryKey: ['storyDetails', storyIds],
    queryFn: async () => {
      if (!storyIds) return [];
      const storyPromises = storyIds.map(fetchStoryDetails);
      return Promise.all(storyPromises);
    },
    enabled: !!storyIds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredStories = useMemo(() => {
    if (!stories) return [];
    const oneDayAgo = Date.now() / 1000 - 86400;
    return stories
      .filter(story => story.time > oneDayAgo)
      .filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.url && story.url.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }, [stories, searchQuery]);

  const isLoading = isLoadingIds || isLoadingStories;
  const error = idsError || storiesError;

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