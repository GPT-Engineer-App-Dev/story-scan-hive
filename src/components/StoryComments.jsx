import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Loader } from 'lucide-react';

const fetchComments = async (ids) => {
  const comments = await Promise.all(
    ids.slice(0, 10).map(async (id) => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      if (!response.ok) throw new Error('Failed to fetch comment');
      return response.json();
    })
  );
  return comments;
};

const Comment = ({ comment }) => (
  <div className="mb-4 p-4 bg-white rounded-lg shadow">
    <div className="flex items-center mb-2 text-sm text-gray-600">
      <User className="w-4 h-4 mr-2" />
      <span>{comment.by}</span>
    </div>
    <div dangerouslySetInnerHTML={{ __html: comment.text }} className="text-gray-800 prose prose-sm max-w-none" />
  </div>
);

const StoryComments = ({ storyId }) => {
  const { data: story, isLoading: storyLoading, error: storyError } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`).then(res => res.json()),
  });

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: () => fetchComments(story.kids || []),
    enabled: !!story && !!story.kids,
  });

  if (storyLoading || commentsLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (storyError || commentsError) {
    return (
      <div className="p-4 text-red-500">
        Error loading comments. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Comments</h3>
      {comments && comments.length > 0 ? (
        comments.map((comment) => <Comment key={comment.id} comment={comment} />)
      ) : (
        <p className="text-gray-600">No comments yet.</p>
      )}
    </div>
  );
};

export default StoryComments;