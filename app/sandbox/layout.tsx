export const metadata = {
  title: "LawnHQ",
  description: "AI lawn care, personalized to your grass type and zip code.",
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
