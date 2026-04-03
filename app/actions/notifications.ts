'use server';

import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import type { Notification } from '@/app/feed/partials/Notifications';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

async function getSession() {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}

export async function getNotifications(): Promise<Notification[]> {
  const session = await getSession();
  if (!session?.user) return [];

  const db = await getDb();
  const notifications = await db
    .collection('notifications')
    .find({ recipientId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return notifications.map((n) => ({
    ...n,
    _id: n._id.toString(),
    createdAt: (n.createdAt as Date).toISOString(),
  })) as Notification[];
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
  const session = await getSession();
  if (!session?.user || !ids.length) return;

  const db = await getDb();
  await db.collection('notifications').updateMany(
    {
      _id: { $in: ids.map((id) => new ObjectId(id)) },
      recipientId: session.user.id,
    },
    { $set: { read: true } },
  );
}
