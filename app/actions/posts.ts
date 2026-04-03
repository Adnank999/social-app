'use server';

import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import type { PostDoc } from '@/app/types/Post';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { refresh } from 'next/cache';
import { pusherServer } from '@/app/lib/pusher';

export async function createPost(payload: {
  text: string;
  images: { url: string; publicId: string }[];
  privacy: 'public' | 'private';
}): Promise<{ error?: string }> {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) return { error: 'Unauthorized' };
  if (!payload.text?.trim()) return { error: 'Text is required' };

  const now = new Date();
  const post = {
    _id: new ObjectId(),
    authorId: session.user.id,
    authorName: session.user.name,
    authorImage: session.user.image ?? null,
    text: payload.text.trim(),
    images: payload.images,
    privacy: payload.privacy === 'private' ? 'private' : 'public',
    likes: [] as string[],
    comments: [] as unknown[],
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection('posts').insertOne(post);

  refresh();
  await pusherServer.trigger('feed', 'new-post', {});
  return {};
}

export async function getPosts(): Promise<PostDoc[]> {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) return [];

  const db = await getDb();
  const posts = await db
    .collection('posts')
    .find({
      $or: [
        { privacy: 'public' },
        { authorId: session.user.id, privacy: 'private' },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  return posts.map((p): PostDoc => ({
    _id: p._id.toString(),
    authorId: p.authorId,
    authorName: p.authorName,
    authorImage: p.authorImage ?? null,
    text: p.text,
    images: Array.isArray(p.images)
      ? p.images
      : p.image
        ? [{ url: p.image as string, publicId: '' }]
        : [],
    privacy: p.privacy,
    likes: p.likes ?? [],
    createdAt: (p.createdAt as Date).toISOString(),
    updatedAt: (p.updatedAt as Date).toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments: (p.comments ?? []).map((c: any) => ({
      _id: c._id.toString(),
      authorId: c.authorId,
      authorName: c.authorName,
      authorImage: c.authorImage ?? null,
      text: c.text,
      likes: c.likes ?? [],
      createdAt: (c.createdAt as Date).toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replies: (c.replies ?? []).map((r: any) => ({
        _id: r._id.toString(),
        authorId: r.authorId,
        authorName: r.authorName,
        authorImage: r.authorImage ?? null,
        text: r.text,
        likes: r.likes ?? [],
        createdAt: (r.createdAt as Date).toISOString(),
      })),
    })),
  }));
}
