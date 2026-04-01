import type { Metadata } from 'next';
import Navbar from './partials/Navbar';
import MobileNav from './partials/MobileNav';
import LeftSidebar from './partials/LeftSidebar';
import Stories from './partials/Stories';
import CreatePost from './partials/CreatePost';
import PostCard from './partials/PostCard';
import RightSidebar from './partials/RightSidebar';
import type { Post } from './partials/PostCard';
import DarkModeToggle from '../components/DarkModeToggle';

export const metadata: Metadata = {
  title: 'Feed — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

const posts: Post[] = [
  {
    id: 1,
    author: 'Karim Saif',
    authorImage: '/assets/images/post_img.png',
    time: '5 minutes ago',
    privacy: 'Public',
    title: 'Excited to share my latest project with the community!',
    postImage: '/assets/images/timeline_img.png',
    reactions: 9,
    comments: 12,
    shares: 122,
  },
  {
    id: 2,
    author: 'Dylan Field',
    authorImage: '/assets/images/profile.png',
    time: '1 hour ago',
    privacy: 'Public',
    title: 'Just launched a new design system. Check it out!',
    reactions: 24,
    comments: 8,
    shares: 54,
  },
];

export default function FeedPage() {
  return (
    <div className="_layout _layout_main_wrapper">
      {/* Dark / Light mode switcher */}
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
                    <CreatePost />
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
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
