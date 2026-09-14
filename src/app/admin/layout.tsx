export const metadata = { title: 'PetBhar Admin', robots: 'noindex, nofollow' };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {children}
    </div>
  );
}
