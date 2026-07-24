import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura — Everyday Personal Life Dashboard',
  description: 'A beautiful, production-grade personal productivity web application inspired by Apple, Notion, Things 3, and Linear. Combines tasks, multi-list shopping, meal planning, pantry inventory, calendar, notes, goals, and recurring chores.',
  keywords: ['Personal Life Dashboard', 'Things 3 web app', 'Notion personal dashboard', 'Smart quick add', 'Meal planner', 'Pantry inventory', 'Shopping list'],
  authors: [{ name: 'Eve Amram' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-teal-500/30 selection:text-white bg-atlas-950">
        {children}
      </body>
    </html>
  );
}
