import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import type { PostDoc } from '@/app/types/Post';
import Navbar from './partials/Navbar';
import MobileNav from './partials/MobileNav';
import LeftSidebar from './partials/LeftSidebar';
import Stories from './partials/Stories';
import CreatePost from './partials/CreatePost';
import PostCard from './partials/PostCard';
import RightSidebar from './partials/RightSidebar';
import DarkModeToggle from '../components/DarkModeToggle';

export const metadata: Metadata = {
  title: 'Feed — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

export default async function FeedPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const res = await fetch(`${process.env.BASE_URL}/api/posts`, {
    headers: { cookie: headersList.get('cookie') ?? '' },
  });
  const posts: PostDoc[] = await res.json();

  const currentUser = {
    id: session!.user.id,
    name: session!.user.name,
    image: session!.user.image ?? null,
  };

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
                    <CreatePost currentUser={currentUser} />
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} currentUserId={currentUser.id} />
                    ))}
                    {posts.length === 0 && (
                      <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b16" style={{ textAlign: 'center', color: '#8a8a8a' }}>
                        No posts yet. Be the first to post!
                      </div>
                    )}
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
