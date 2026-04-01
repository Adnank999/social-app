import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, commentId } = await params;
  if (!ObjectId.isValid(id) || !ObjectId.isValid(commentId)) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  const db = await getDb();
  const collection = db.collection('posts');
  const post = await collection.findOne({ _id: new ObjectId(id) });

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  const userId = session.user.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comment = (post.comments ?? []).find((c: any) => c._id.toString() === commentId);
  if (!comment) {
    return Response.json({ error: 'Comment not found' }, { status: 404 });
  }

  const likes: string[] = comment.likes ?? [];
  const hasLiked = likes.includes(userId);

  await collection.updateOne(
    { _id: new ObjectId(id), 'comments._id': new ObjectId(commentId) },
    hasLiked
      ? { $pull: { 'comments.$.likes': userId }, $set: { updatedAt: new Date() } }
      : { $addToSet: { 'comments.$.likes': userId }, $set: { updatedAt: new Date() } },
  );

  return Response.json({ liked: !hasLiked });
}
