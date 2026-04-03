'use server';

import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import { pusherServer } from '@/app/lib/pusher';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

async function getSession() {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}

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

    if (post.authorId !== userId) {
      const notification = {
        _id: new ObjectId(),
        recipientId: post.authorId as string,
        actorId: userId,
        actorName: session.user.name,
        actorImage: session.user.image ?? null,
        type: 'like' as const,
        postId,
        postText: (post.text as string)?.slice(0, 60) ?? '',
        read: false,
        createdAt: new Date(),
      };
      await db.collection('notifications').insertOne(notification);
      await pusherServer.trigger(`user-${post.authorId}`, 'notification', {
        ...notification,
        _id: notification._id.toString(),
        createdAt: notification.createdAt.toISOString(),
      });
    }
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
      ? { $pull: { 'comments.$.likes': userId }, $set: { updatedAt: new Date() } }
      : { $addToSet: { 'comments.$.likes': userId }, $set: { updatedAt: new Date() } },
  );

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

  await collection.updateOne(
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

  return {};
}
