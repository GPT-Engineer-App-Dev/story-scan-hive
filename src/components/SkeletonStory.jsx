import React from 'react';

const SkeletonStory = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonStory;