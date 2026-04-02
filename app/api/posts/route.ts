import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  const serialized = posts.map((p) => ({
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

  return Response.json(serialized);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { text, images, privacy } = body as {
    text: string;
    images?: { url: string; publicId: string }[];
    privacy: 'public' | 'private';
  };

  if (!text?.trim()) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }

  const normalizedImages = Array.isArray(images)
    ? images.filter(
        (img): img is { url: string; publicId: string } =>
          !!img && typeof img.url === 'string' && typeof img.publicId === 'string'
      )
    : [];

  const now = new Date();

  const post = {
    _id: new ObjectId(),
    authorId: session.user.id,
    authorName: session.user.name,
    authorImage: session.user.image ?? null,
    text: text.trim(),
    images: normalizedImages,
    privacy: privacy === 'private' ? 'private' : 'public',
    likes: [] as string[],
    comments: [] as unknown[],
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection('posts').insertOne(post);

  return Response.json(
    {
      ...post,
      _id: post._id.toString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    { status: 201 }
  );
}
