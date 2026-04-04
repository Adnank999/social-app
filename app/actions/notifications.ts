'use server';

import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import { pusherServer } from '@/app/lib/pusher';
import type { Notification } from '@/app/feed/partials/Notifications';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { getSession } from '../utils/user-session';



export type NotificationInput = {
  recipientId: string;
  actorId: string;
  actorName: string;
  actorImage: string | null;
  type: 'like' | 'comment' | 'comment_like' | 'reply';
  postId: string;
  postText: string;
  commentText?: string;
};

export async function createNotification(input: NotificationInput): Promise<void> {
  if (!input.recipientId || input.recipientId === input.actorId) return;

  const db = await getDb();
  const notification = {
    _id: new ObjectId(),
    recipientId: input.recipientId,
    actorId: input.actorId,
    actorName: input.actorName,
    actorImage: input.actorImage,
    type: input.type,
    postId: input.postId,
    postText: input.postText,
    commentText: input.commentText,
    read: false,
    createdAt: new Date(),
  };

  await db.collection('notifications').insertOne(notification);

  try {
    await pusherServer.trigger(`user-${input.recipientId}`, 'notification', {
      ...notification,
      _id: notification._id.toString(),
      createdAt: notification.createdAt.toISOString(),
    });
  } catch {}
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
