'use server';


import { getDb } from '@/app/lib/db';
import { createNotification } from '@/app/actions/notifications';
import type { Comment } from '@/app/types/Post';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { getSession } from '../utils/user-session';



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

  await createNotification({
    recipientId: result.authorId as string,
    actorId: session.user.id,
    actorName: session.user.name,
    actorImage: session.user.image ?? null,
    type: 'comment',
    postId,
    postText: (result.text as string)?.slice(0, 60) ?? '',
    commentText: text.trim().slice(0, 60),
  });

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
  const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
  if (!post) return { error: 'Post or comment not found' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comment = (post.comments ?? []).find((c: any) => c._id.toString() === commentId);
  if (!comment) return { error: 'Post or comment not found' };

  const result = await db.collection('posts').findOneAndUpdate(
    { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) },
    { $push: { 'comments.$.replies': reply as any }, $set: { updatedAt: new Date() } } as any,
    { returnDocument: 'after' },
  );

  if (!result) return { error: 'Post or comment not found' };

  await createNotification({
    recipientId: comment.authorId as string,
    actorId: session.user.id,
    actorName: session.user.name,
    actorImage: session.user.image ?? null,
    type: 'reply',
    postId,
    postText: (post.text as string)?.slice(0, 60) ?? '',
    commentText: text.trim().slice(0, 60),
  });

  return { comments: serializeComments(result.comments ?? []) };
}
