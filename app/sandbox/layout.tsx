export const metadata = {
  title: "LawnHQ - The Smartest Way to Care for Your Lawn",
  description: "Get your free 90-day lawn care plan. Personalized to your grass, your climate, your goals.",
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  );
}
