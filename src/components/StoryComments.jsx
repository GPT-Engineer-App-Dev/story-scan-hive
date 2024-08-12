import React from 'react';
import { useQuery } from '@tanstack/react-query';

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
  <div className="mb-4 p-4 bg-gray-100 rounded-lg">
    <p className="text-sm text-gray-600 mb-2">By: {comment.by}</p>
    <div dangerouslySetInnerHTML={{ __html: comment.text }} className="text-gray-800" />
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

  if (storyLoading || commentsLoading) return <div>Loading comments...</div>;
  if (storyError || commentsError) return <div>Error loading comments</div>;

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {comments && comments.length > 0 ? (
        comments.map((comment) => <Comment key={comment.id} comment={comment} />)
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default StoryComments;