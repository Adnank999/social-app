'use server';

import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import { pusherServer } from '@/app/lib/pusher';
import type { Comment } from '@/app/types/Post';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

async function getSession() {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeComments(comments: any[]): Comment[] {
  return comments.map((c) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: (c.createdAt as Date).toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replies: (c.replies ?? []).map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: (r.createdAt as Date).toISOString(),
    })),
  }));
}

export async function addComment(
  postId: string,
  text: string,
): Promise<{ comments?: Comment[]; error?: string }> {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };
  if (!ObjectId.isValid(postId)) return { error: 'Invalid post id' };
  if (!text?.trim()) return { error: 'Text is required' };

  const comment = {
    _id: new ObjectId(),
    authorId: session.user.id,
    authorName: session.user.name,
    authorImage: session.user.image ?? null,
    text: text.trim(),
    likes: [] as string[],
    replies: [] as unknown[],
    createdAt: new Date(),
  };

  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await db.collection('posts').findOneAndUpdate(
    { _id: new ObjectId(postId) },
    { $push: { comments: comment as any }, $set: { updatedAt: new Date() } } as any,
    { returnDocument: 'after' },
  );

  if (!result) return { error: 'Post not found' };

  if (result.authorId !== session.user.id) {
    const notification = {
      _id: new ObjectId(),
      recipientId: result.authorId as string,
      actorId: session.user.id,
      actorName: session.user.name,
      actorImage: session.user.image ?? null,
      type: 'comment' as const,
      postId,
      postText: (result.text as string)?.slice(0, 60) ?? '',
      commentText: text.trim().slice(0, 60),
      read: false,
      createdAt: new Date(),
    };
    await db.collection('notifications').insertOne(notification);
    await pusherServer.trigger(`user-${result.authorId}`, 'notification', {
      ...notification,
      _id: notification._id.toString(),
      createdAt: notification.createdAt.toISOString(),
    });
  }

  return { comments: serializeComments(result.comments ?? []) };
}

export async function addReply(
  postId: string,
  commentId: string,
  text: string,
): Promise<{ comments?: Comment[]; error?: string }> {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };
  if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) return { error: 'Invalid id' };
  if (!text?.trim()) return { error: 'Text is required' };

  const reply = {
    _id: new ObjectId(),
    authorId: session.user.id,
    authorName: session.user.name,
    authorImage: session.user.image ?? null,
    text: text.trim(),
    likes: [] as string[],
    createdAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection('posts').findOneAndUpdate(
    { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) },
    { $push: { 'comments.$.replies': reply }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' },
  );

  if (!result) return { error: 'Post or comment not found' };

  return { comments: serializeComments(result.comments ?? []) };
}
