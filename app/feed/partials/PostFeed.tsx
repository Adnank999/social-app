import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import { getPosts } from '@/app/actions/posts';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

export const dynamic = 'force-dynamic';

export default async function PostFeed() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const posts = await getPosts();

  const currentUser = {
    id: session!.user.id,
    name: session!.user.name,
    image: session!.user.image ?? null,
  };

  return (
    <>
      <CreatePost currentUser={currentUser} />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} currentUserId={currentUser.id} />
      ))}
      {posts.length === 0 && (
        <div
          className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b16"
          style={{ textAlign: 'center', color: '#8a8a8a' }}
        >
          No posts yet. Be the first to post!
        </div>
      )}
    </>
  );
}
