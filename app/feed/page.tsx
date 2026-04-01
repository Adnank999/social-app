import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import { getDb } from '@/app/lib/db';
import type { PostDoc } from '@/app/lib/models/post';
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');

  const db = await getDb();
  const rawPosts = await db
    .collection('posts')
    .find({
      $or: [
        { privacy: 'public' },
        { authorId: session.user.id, privacy: 'private' },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  const posts: PostDoc[] = rawPosts.map((p) => ({
    _id: p._id.toString(),
    authorId: p.authorId,
    authorName: p.authorName,
    authorImage: p.authorImage ?? null,
    text: p.text,
    image: p.image ?? null,
    privacy: p.privacy,
    likes: p.likes ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments: (p.comments ?? []).map((c: any) => ({
      _id: c._id.toString(),
      authorId: c.authorId,
      authorName: c.authorName,
      authorImage: c.authorImage ?? null,
      text: c.text,
      likes: c.likes ?? [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replies: (c.replies ?? []).map((r: any) => ({
        _id: r._id.toString(),
        authorId: r.authorId,
        authorName: r.authorName,
        authorImage: r.authorImage ?? null,
        text: r.text,
        likes: r.likes ?? [],
        createdAt: (r.createdAt as Date).toISOString(),
      })),
      createdAt: (c.createdAt as Date).toISOString(),
    })),
    createdAt: (p.createdAt as Date).toISOString(),
    updatedAt: (p.updatedAt as Date).toISOString(),
  }));

  const currentUser = {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image ?? null,
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
