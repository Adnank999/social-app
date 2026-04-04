import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import Register from '@/app/auth/register/partials/Register';

export const metadata: Metadata = {
  title: 'Register — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect('/feed');

  return <Register />;
}
