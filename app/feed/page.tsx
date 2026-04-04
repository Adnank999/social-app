import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from './partials/Navbar';
import MobileNav from './partials/MobileNav';
import LeftSidebar from './partials/LeftSidebar';
import Stories from './partials/Stories';
import PostFeed from './partials/PostFeed';
import FeedRealtime from './partials/FeedRealtime';
import RightSidebar from './partials/RightSidebar';
import DarkModeToggle from '../components/DarkModeToggle';
import PostFeedSkeleton from '../components/PostFeedSkeleton';

export const metadata: Metadata = {
  title: 'Feed — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

export default function FeedPage() {
  return (
    <div className="_layout _layout_main_wrapper">
      <DarkModeToggle />

      <div className="_main_layout">
        <Navbar />
        <MobileNav />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <LeftSidebar />

              {/* Center Feed */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <Stories />
                    <FeedRealtime />
                    <Suspense fallback={<PostFeedSkeleton />}>
                      <PostFeed />
                    </Suspense>
                  </div>
                </div>
              </div>

              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
