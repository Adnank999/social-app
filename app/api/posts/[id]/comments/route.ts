import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import { pusherServer } from '@/app/lib/pusher';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await db.collection('posts').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $push: { comments: comment as any }, $set: { updatedAt: new Date() } } as any,
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

  // Notify post author (not when commenting on own post)
  if (result.authorId !== session.user.id) {
    const notification = {
      _id: new ObjectId(),
      recipientId: result.authorId as string,
      actorId: session.user.id,
      actorName: session.user.name,
      actorImage: session.user.image ?? null,
      type: 'comment' as const,
      postId: id,
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

  return Response.json({ comments: serializedComments }, { status: 201 });
}
