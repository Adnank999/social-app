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

  const db = await getDb();
  const collection = db.collection('posts');
  const post = await collection.findOne({ _id: new ObjectId(id) });

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  const userId = session.user.id;
  const likes: string[] = post.likes ?? [];
  const hasLiked = likes.includes(userId);

  if (hasLiked) {
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { likes: userId as unknown as never }, $set: { updatedAt: new Date() } },
    );
  } else {
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { likes: userId }, $set: { updatedAt: new Date() } },
    );

    // Notify the post author (not when liking own post)
    if (post.authorId !== userId) {
      const notification = {
        _id: new ObjectId(),
        recipientId: post.authorId as string,
        actorId: userId,
        actorName: session.user.name,
        actorImage: session.user.image ?? null,
        type: 'like' as const,
        postId: id,
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

  return Response.json({ liked: !hasLiked });
}
