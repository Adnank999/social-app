'use client';

import Pusher from 'pusher-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FeedRealtime() {
  const router = useRouter();

  useEffect(() => {
    const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = client.subscribe('feed');

    channel.bind('new-post', () => {
      router.refresh();
    });

    return () => {
      client.unsubscribe('feed');
      client.disconnect();
    };
  }, [router]);

  return null;
}
