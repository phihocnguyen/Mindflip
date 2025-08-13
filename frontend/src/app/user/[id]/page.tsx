import UserDetailClient from './UserDetailClient';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  console.log('Received params:', params);
  const { id } = await params;
  console.log('Received params id:', id);
  console.log('Type of id:', typeof id);

  return <UserDetailClient userId={id} />;
}