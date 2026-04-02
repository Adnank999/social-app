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
  const notifications = await db
    .collection('notifications')
    .find({ recipientId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return Response.json(
    notifications.map((n) => ({
      ...n,
      _id: n._id.toString(),
      createdAt: (n.createdAt as Date).toISOString(),
    }))
  );
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ids } = await request.json() as { ids: string[] };

  const db = await getDb();
  await db.collection('notifications').updateMany(
    {
      _id: { $in: ids.map((id) => new ObjectId(id)) },
      recipientId: session.user.id,
    },
    { $set: { read: true } }
  );

  return Response.json({ ok: true });
}
