import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchStories = async (query = '') => {
  const response = await fetch(
    `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=100&query=${query}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  return response.json();
};

export const useHackerNewsStories = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['hackerNewsStories', searchQuery],
    queryFn: () => fetchStories(searchQuery),
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