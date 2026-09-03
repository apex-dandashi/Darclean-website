import { redirect } from 'next/navigation';

export default function RootPage() {
  // Arabic is the default language as specified in requirements
  redirect('/ar');
}
