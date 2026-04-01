import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: 'Invalid post id' }, { status: 400 });
  }

  const { text } = await request.json();
  if (!text?.trim()) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }

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
  const result = await db.collection('posts').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $push: { comments: comment }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' },
  );

  if (!result) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedComments = (result.comments ?? []).map((c: any) => ({
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

  return Response.json({ comments: serializedComments }, { status: 201 });
}
