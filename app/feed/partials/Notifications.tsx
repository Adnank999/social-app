'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Pusher from 'pusher-js';
import { getNotifications, markNotificationsRead } from '@/app/actions/notifications';

export interface Notification {
  _id: string;
  actorName: string;
  actorImage: string | null;
  type: 'like' | 'comment';
  postText: string;
  commentText?: string;
  read: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function notificationText(n: Notification): string {
  if (n.type === 'like') {
    return `${n.actorName} liked your post${n.postText ? `: "${n.postText}"` : ''}`;
  }
  return `${n.actorName} commented on your post${n.commentText ? `: "${n.commentText}"` : ''}`;
}

interface Props {
  userId: string | null;
}

export default function Notifications({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLLIElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Fetch existing notifications on mount
  useEffect(() => {
    if (!userId) return;
    getNotifications().then(setNotifications).catch(() => {});
  }, [userId]);

  // Subscribe to Pusher for real-time new notifications
  useEffect(() => {
    if (!userId) return;

    const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = client.subscribe(`user-${userId}`);

    channel.bind('notification', (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      client.unsubscribe(`user-${userId}`);
      client.disconnect();
    };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleOpen() {
    setOpen((prev) => !prev);

    // Mark all unread as read
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
    if (unreadIds.length > 0) {
      markNotificationsRead(unreadIds).catch(() => {});

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <li ref={ref} className="nav-item _header_nav_item" style={{ position: 'relative' }}>
      <span
        className="nav-link _header_nav_link _header_notify_btn"
        style={{ cursor: 'pointer' }}
        onClick={handleOpen}
      >
        Notifications
        {unread > 0 && <span className="_counting">{unread}</span>}
      </span>

      <div id="_notify_drop" className={`_notification_dropdown${open ? ' show' : ''}`}>
        <div className="_notifications_content">
          <h4 className="_notifications_content_title">Notifications</h4>
        </div>

        <div className="_notifications_drop_box">
          <div className="_notifications_all">
            {notifications.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: 14 }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="_notification_box"
                  style={{ background: n.read ? undefined : 'rgba(24,119,242,0.06)' }}
                >
                  <div className="_notification_image">
                    {n.actorImage ? (
                      <Image
                        src={n.actorImage}
                        alt={n.actorName}
                        width={40}
                        height={40}
                        className="_notify_img"
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <div
                        className="_notify_img"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: 16,
                          color: '#666',
                        }}
                      >
                        {n.actorName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="_notification_txt">
                    <p className="_notification_para">{notificationText(n)}</p>
                    <div className="_nitification_time">
                      <span>{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
