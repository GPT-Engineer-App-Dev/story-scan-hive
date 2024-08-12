import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchTopStories = async (query = '') => {
  const response = await fetch(
    `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${Math.floor(
      Date.now() / 1000
    ) - 86400}&hitsPerPage=100&query=${query}&sort=points_desc`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  return response.json();
};

export const useHackerNewsStories = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['topHackerNewsStories', searchQuery],
    queryFn: () => fetchTopStories(searchQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchStories = (query) => {
    setSearchQuery(query);
  };

  return {
    stories: data?.hits || [],
    isLoading,
    error,
    searchStories,
  };
};