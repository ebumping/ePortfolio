import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'lain@void:~$ portfolio',
  description: 'Systems programmer, ML engineer, and full-stack developer. Building distributed systems, AI/ML pipelines, and security tools.',
  keywords: ['Rust', 'Python', 'TypeScript', 'Machine Learning', 'Distributed Systems', 'Security'],
  authors: [{ name: 'lain' }],
  openGraph: {
    title: 'lain@void:~$ portfolio',
    description: 'Systems programmer, ML engineer, and full-stack developer.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
