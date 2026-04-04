import type { Metadata } from 'next';
import { Suspense } from 'react';
import Stories from './partials/Stories';
import PostFeed from './partials/PostFeed';
import FeedRealtime from './partials/FeedRealtime';
import PostFeedSkeleton from '../components/PostFeedSkeleton';

export const metadata: Metadata = {
  title: 'Feed — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

export default function FeedPage() {
  return (
    <>
      <Stories />
      <FeedRealtime />
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed />
      </Suspense>
    </>
  );
}
