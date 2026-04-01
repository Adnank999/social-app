'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PostDoc, Comment, Reply } from '@/app/lib/models/post';

interface PostCardProps {
  post: PostDoc;
  currentUserId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  // Post likes
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeLoading, setLikeLoading] = useState(false);
  const isLiked = likes.includes(currentUserId);

  // Comments
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Reply state per comment
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});

  // Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  async function handleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    // Optimistic
    setLikes((prev) =>
      prev.includes(currentUserId)
        ? prev.filter((id) => id !== currentUserId)
        : [...prev, currentUserId],
    );
    try {
      await fetch(`/api/posts/${post._id}/like`, { method: 'POST' });
    } catch {
      // revert on error
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
      const res = await fetch(`/api/posts/${post._id}/comments`, {
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
    // Optimistic
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
      await fetch(`/api/posts/${post._id}/comments/${commentId}/like`, { method: 'POST' });
    } catch {
      // revert
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
      const res = await fetch(`/api/posts/${post._id}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setReplyText((prev) => ({ ...prev, [commentId]: '' }));
        setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
      }
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  }

  async function handleReplyLike(commentId: string, replyId: string, replyLikes: string[]) {
    const hasLiked = replyLikes.includes(currentUserId);
    // Optimistic
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
      await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies/${replyId}/like`,
        { method: 'POST' },
      );
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

  console.log("comments:", comments);
  console.log("currentUserId:", currentUserId);

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        {/* Post Header */}
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              {post.authorImage ? (
                <Image
                  src={post.authorImage}
                  alt={post.authorName}
                  width={44}
                  height={44}
                  className="_post_img"
                />
              ) : (
                <div
                  className="_post_img"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#666',
                  }}
                >
                  {post.authorName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.authorName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo(post.createdAt)} &middot;{' '}
                <Link href="#">
                  {post.privacy === 'public' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}{' '}
                  {post.privacy}
                </Link>
              </p>
            </div>
          </div>

          {/* Dropdown */}
          <div className="_feed_inner_timeline_post_box_dropdown" ref={dropRef}>
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                className="_feed_timeline_post_dropdown_link"
                onClick={() => setShowDropdown((v) => !v)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            <div className={`_feed_timeline_dropdown _timeline_dropdown${showDropdown ? ' show' : ''}`}>
              <ul className="_feed_timeline_dropdown_list">
                {['Save Post', 'Turn On Notification', 'Hide', 'Edit Post', 'Delete Post'].map((item) => (
                  <li key={item} className="_feed_timeline_dropdown_item">
                    <Link href="#" className="_feed_timeline_dropdown_link" onClick={() => setShowDropdown(false)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Post Text */}
        {post.text && (
          <p className="_feed_inner_timeline_post_title" style={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </p>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="_feed_inner_timeline_image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt="Post"
            className="_time_img"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Reaction Summary */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_total_reacts_image">
          <Image src="/assets/images/react_img1.png" alt="" width={32} height={32} className="_react_img1" />
          <Image src="/assets/images/react_img2.png" alt="" width={32} height={32} className="_react_img" />
          <Image src="/assets/images/react_img3.png" alt="" width={32} height={32} className="_react_img _rect_img_mbl_none" />
          <p className="_feed_inner_timeline_total_reacts_para">{likes.length > 0 ? `${likes.length}` : ''}</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <button
              type="button"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}
              onClick={() => setShowComments((v) => !v)}
            >
              <span>{comments.length}</span> Comment{comments.length !== 1 ? 's' : ''}
            </button>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>0</span> Share
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="_feed_inner_timeline_reaction _padd_r24 _padd_l24">
        <button
          type="button"
          className={`_feed_reaction${isLiked ? ' _feed_reaction_active' : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={isLiked ? '#1877f2' : 'currentColor'} strokeWidth={2} className="_reaction_svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              {isLiked ? 'Liked' : 'Like'}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="_feed_reaction"
          onClick={() => setShowComments((v) => !v)}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form" onSubmit={handleComment}>
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <Image
                  src="/assets/images/comment_img.png"
                  alt=""
                  width={26}
                  height={26}
                  className="_comment_img"
                />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(e as unknown as React.FormEvent);
                    }
                  }}
                />
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={commentLoading || !commentText.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path fill="currentColor" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                </svg>
              </button>
              <button type="button" className="_feed_inner_comment_box_icon_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path fill="currentColor" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      {showComments && comments.length > 0 && (
        <div className="_timline_comment_main _padd_r24 _padd_l24">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              postId={post._id}
              replyText={replyText[comment._id] ?? ''}
              showReplyInput={showReplyInput[comment._id] ?? false}
              replyLoading={replyLoading[comment._id] ?? false}
              onLike={() => handleCommentLike(comment._id, comment.likes)}
              onToggleReply={() =>
                setShowReplyInput((prev) => ({
                  ...prev,
                  [comment._id]: !prev[comment._id],
                }))
              }
              onReplyTextChange={(text) =>
                setReplyText((prev) => ({ ...prev, [comment._id]: text }))
              }
              onReplySubmit={() => handleReply(comment._id)}
              onReplyLike={(replyId, replyLikes) =>
                handleReplyLike(comment._id, replyId, replyLikes)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  postId: string;
  replyText: string;
  showReplyInput: boolean;
  replyLoading: boolean;
  onLike: () => void;
  onToggleReply: () => void;
  onReplyTextChange: (text: string) => void;
  onReplySubmit: () => void;
  onReplyLike: (replyId: string, replyLikes: string[]) => void;
}

function CommentItem({
  comment,
  currentUserId,
  replyText,
  showReplyInput,
  replyLoading,
  onLike,
  onToggleReply,
  onReplyTextChange,
  onReplySubmit,
  onReplyLike,
}: CommentItemProps) {
  const isLiked = comment.likes.includes(currentUserId);

  return (
    <div className="_comment_main" style={{ marginBottom: 16 }}>
      <div className="_comment_image">
        {comment.authorImage ? (
          <Image
            src={comment.authorImage}
            alt={comment.authorName}
            width={40}
            height={40}
            className="_comment_img1"
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <div
            className="_comment_img1"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 16,
              color: '#666',
            }}
          >
            {comment.authorName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{comment.authorName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">{comment.text}</p>
          </div>
          {comment.likes.length > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1877f2" stroke="#1877f2" strokeWidth="1">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
              </div>
              <span className="_total">{comment.likes.length}</span>
            </div>
          )}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <button
                    type="button"
                    className="_time_link"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isLiked ? '#1877f2' : 'inherit',
                      fontWeight: isLiked ? 600 : 400,
                    }}
                    onClick={onLike}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="_time_link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                    onClick={onToggleReply}
                  >
                    Reply
                  </button>
                </li>
                <li>
                  <span className="_time_link">{timeAgo(comment.createdAt)}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'flex-start' }}>
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                style={{ flex: 1, minHeight: 36 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onReplySubmit();
                  }
                }}
              />
              <button
                type="button"
                className="_feed_reaction"
                style={{ whiteSpace: 'nowrap', padding: '4px 12px', fontSize: 13 }}
                onClick={onReplySubmit}
                disabled={replyLoading || !replyText.trim()}
              >
                {replyLoading ? '...' : 'Reply'}
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  currentUserId={currentUserId}
                  onLike={() => onReplyLike(reply._id, reply.likes)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReplyItemProps {
  reply: Reply;
  currentUserId: string;
  onLike: () => void;
}

function ReplyItem({ reply, currentUserId, onLike }: ReplyItemProps) {
  const isLiked = reply.likes.includes(currentUserId);

  return (
    <div className="_comment_main" style={{ marginBottom: 10 }}>
      <div className="_comment_image">
        {reply.authorImage ? (
          <Image
            src={reply.authorImage}
            alt={reply.authorName}
            width={32}
            height={32}
            className="_comment_img1"
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 13,
              color: '#666',
            }}
          >
            {reply.authorName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_name">
            <h4 className="_comment_name_title" style={{ fontSize: 13 }}>{reply.authorName}</h4>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">{reply.text}</p>
          </div>
          {reply.likes.length > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#1877f2" stroke="#1877f2" strokeWidth="1">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>
              </div>
              <span className="_total">{reply.likes.length}</span>
            </div>
          )}
          <div className="_comment_reply">
            <ul className="_comment_reply_list">
              <li>
                <button
                  type="button"
                  className="_time_link"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isLiked ? '#1877f2' : 'inherit',
                    fontWeight: isLiked ? 600 : 400,
                    fontSize: 12,
                  }}
                  onClick={onLike}
                >
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </li>
              <li>
                <span className="_time_link" style={{ fontSize: 12 }}>{timeAgo(reply.createdAt)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
