'use client';

import type { PostDoc } from '@/app/types/Post';
import { usePostCard } from '../../hooks/usePostCard';
import PostHeader from './post-card/PostHeader';
import PostImages from './post-card/PostImages';
import PostReactionBar from './post-card/PostReactionBar';
import PostActions from './post-card/PostActions';
import PostCommentInput from './post-card/PostCommentInput';
import CommentItem from './post-card/CommentItem';

interface PostCardProps {
  post: PostDoc;
  currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const {
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
  } = usePostCard(post._id, post.likes, post.comments, currentUserId);

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader
          authorName={post.authorName}
          authorImage={post.authorImage}
          createdAt={post.createdAt}
          privacy={post.privacy}
          showDropdown={showDropdown}
          onToggleDropdown={() => setShowDropdown((v) => !v)}
          onCloseDropdown={() => setShowDropdown(false)}
        />
        {post.text && (
          <p className="_feed_inner_timeline_post_title" style={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </p>
        )}
      </div>

      <PostImages images={post.images} />

      <PostReactionBar
        likesCount={likes.length}
        commentsCount={comments.length}
        onToggleComments={toggleComment}
      />

      <PostActions
        isLiked={isLiked}
        likeLoading={likeLoading}
        onLike={handleLike}
        onToggleComments={toggleComment}
      />

      <PostCommentInput
        value={commentText}
        loading={commentLoading}
        onChange={setCommentText}
        onSubmit={handleComment}
      />

      {showComments && comments.length > 0 && (
        <div className="_timline_comment_main _padd_r24 _padd_l24">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              replyText={replyText[comment._id] ?? ''}
              showReplyInput={showReplyInput[comment._id] ?? false}
              replyLoading={replyLoading[comment._id] ?? false}
              onLike={() => handleCommentLike(comment._id, comment.likes)}
              onToggleReply={() => toggleReplyInput(comment._id)}
              onReplyTextChange={(text) => setReplyText(comment._id, text)}
              onReplySubmit={() => handleReply(comment._id)}
              onReplyLike={(replyId, replyLikes) => handleReplyLike(comment._id, replyId, replyLikes)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
