'use server';


import { getDb } from '@/app/lib/db';
import { createNotification } from '@/app/actions/notifications';
import { ObjectId } from 'mongodb';
import { getSession } from '../utils/user-session';


export async function likePost(postId: string): Promise<{ error?: string }> {
   const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };
  if (!ObjectId.isValid(postId)) return { error: 'Invalid post id' };

  const db = await getDb();
  const collection = db.collection('posts');
  const post = await collection.findOne({ _id: new ObjectId(postId) });
  if (!post) return { error: 'Post not found' };

  const userId = session.user.id;
  const hasLiked = (post.likes ?? []).includes(userId);

  if (hasLiked) {
    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId as unknown as never }, $set: { updatedAt: new Date() } },
    );
  } else {
    await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId }, $set: { updatedAt: new Date() } },
    );

    await createNotification({
      recipientId: post.authorId as string,
      actorId: userId,
      actorName: session.user.name,
      actorImage: session.user.image ?? null,
      type: 'like',
      postId,
      postText: (post.text as string)?.slice(0, 60) ?? '',
    });
  }

  return {};
}

export async function likeComment(
  postId: string,
  commentId: string,
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };
  if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) return { error: 'Invalid id' };

  const db = await getDb();
  const collection = db.collection('posts');
  const post = await collection.findOne({ _id: new ObjectId(postId) });
  if (!post) return { error: 'Post not found' };

  const userId = session.user.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comment = (post.comments ?? []).find((c: any) => c._id.toString() === commentId);
  if (!comment) return { error: 'Comment not found' };

  const hasLiked = (comment.likes ?? []).includes(userId);

  await collection.updateOne(
    { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) },
    hasLiked
      ? { $pull: { 'comments.$.likes': userId as unknown as never }, $set: { updatedAt: new Date() } }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : { $addToSet: { 'comments.$.likes': userId }, $set: { updatedAt: new Date() } } as any,
  );

  if (!hasLiked) {
    await createNotification({
      recipientId: comment.authorId as string,
      actorId: userId,
      actorName: session.user.name,
      actorImage: session.user.image ?? null,
      type: 'comment_like',
      postId,
      postText: (post.text as string)?.slice(0, 60) ?? '',
      commentText: (comment.text as string)?.slice(0, 60) ?? '',
    });
  }

  return {};
}

export async function likeReply(
  postId: string,
  commentId: string,
  replyId: string,
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };
  if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId) || !ObjectId.isValid(replyId))
    return { error: 'Invalid id' };

  const db = await getDb();
  const collection = db.collection('posts');
  const post = await collection.findOne({ _id: new ObjectId(postId) });
  if (!post) return { error: 'Post not found' };

  const userId = session.user.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comment = (post.comments ?? []).find((c: any) => c._id.toString() === commentId);
  if (!comment) return { error: 'Comment not found' };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reply = (comment.replies ?? []).find((r: any) => r._id.toString() === replyId);
  if (!reply) return { error: 'Reply not found' };

  const hasLiked = (reply.likes ?? []).includes(userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (collection.updateOne as any)(
    { _id: new ObjectId(postId) },
    hasLiked
      ? { $pull: { 'comments.$[c].replies.$[r].likes': userId }, $set: { updatedAt: new Date() } }
      : { $addToSet: { 'comments.$[c].replies.$[r].likes': userId }, $set: { updatedAt: new Date() } },
    {
      arrayFilters: [
        { 'c._id': new ObjectId(commentId) },
        { 'r._id': new ObjectId(replyId) },
      ],
    },
  );

  if (!hasLiked) {
    await createNotification({
      recipientId: reply.authorId as string,
      actorId: userId,
      actorName: session.user.name,
      actorImage: session.user.image ?? null,
      type: 'comment_like',
      postId,
      postText: (post.text as string)?.slice(0, 60) ?? '',
      commentText: (reply.text as string)?.slice(0, 60) ?? '',
    });
  }

  return {};
}
