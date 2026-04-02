'use client';

import { useState } from 'react';
import type { Comment } from '@/app/lib/models/post';

export function usePostCard(
  postId: string,
  initialLikes: string[],
  initialComments: Comment[],
  currentUserId: string,
) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [likeLoading, setLikeLoading] = useState(false);
  const isLiked = likes.includes(currentUserId);

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [replyText, setReplyTextMap] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});

  const [showDropdown, setShowDropdown] = useState(false);

  async function handleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    setLikes((prev) =>
      prev.includes(currentUserId)
        ? prev.filter((id) => id !== currentUserId)
        : [...prev, currentUserId],
    );
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch {
      setLikes((prev) =>
        prev.includes(currentUserId)
          ? prev.filter((id) => id !== currentUserId)
          : [...prev, currentUserId],
      );
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setCommentText('');
        setShowComments(true);
      }
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleCommentLike(commentId: string, currentLikes: string[]) {
    const hasLiked = currentLikes.includes(currentUserId);
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              likes: hasLiked
                ? c.likes.filter((id) => id !== currentUserId)
                : [...c.likes, currentUserId],
            }
          : c,
      ),
    );
    try {
      await fetch(`/api/posts/${postId}/comments/${commentId}/like`, { method: 'POST' });
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: hasLiked
                  ? [...c.likes, currentUserId]
                  : c.likes.filter((id) => id !== currentUserId),
              }
            : c,
        ),
      );
    }
  }

  async function handleReply(commentId: string) {
    const text = replyText[commentId]?.trim();
    if (!text || replyLoading[commentId]) return;
    setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setReplyTextMap((prev) => ({ ...prev, [commentId]: '' }));
        setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
      }
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  }

  async function handleReplyLike(commentId: string, replyId: string, replyLikes: string[]) {
    const hasLiked = replyLikes.includes(currentUserId);
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r._id === replyId
                  ? {
                      ...r,
                      likes: hasLiked
                        ? r.likes.filter((id) => id !== currentUserId)
                        : [...r.likes, currentUserId],
                    }
                  : r,
              ),
            }
          : c,
      ),
    );
    try {
      await fetch(`/api/posts/${postId}/comments/${commentId}/replies/${replyId}/like`, {
        method: 'POST',
      });
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === replyId
                    ? {
                        ...r,
                        likes: hasLiked
                          ? [...r.likes, currentUserId]
                          : r.likes.filter((id) => id !== currentUserId),
                      }
                    : r,
                ),
              }
            : c,
        ),
      );
    }
  }

  function toggleComment() {
    setShowComments((v) => !v);
  }

  function toggleReplyInput(commentId: string) {
    setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }

  function setReplyText(commentId: string, text: string) {
    setReplyTextMap((prev) => ({ ...prev, [commentId]: text }));
  }

  return {
    likes,
    likeLoading,
    isLiked,
    handleLike,
    comments,
    showComments,
    toggleComment,
    commentText,
    setCommentText,
    commentLoading,
    handleComment,
    handleCommentLike,
    replyText,
    showReplyInput,
    replyLoading,
    handleReply,
    handleReplyLike,
    toggleReplyInput,
    setReplyText,
    showDropdown,
    setShowDropdown,
  };
}
