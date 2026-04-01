import type { Metadata } from 'next';
import Register from '@/app/auth/register/partials/Register';

export const metadata: Metadata = {
  title: 'Register — Buddy Script',
  icons: { icon: '/assets/images/logo-copy.svg' },
};

export default function Page() {
  return <Register />;
}
