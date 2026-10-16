import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Painel Estação',
  description: 'Monitoramento IoT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body className='bg-slate-50 text-slate-900'>
        {/* 2. Coloque a Navbar ANTES das páginas (children) */}
        <Navbar />

        {/* 3. Aqui é onde o Next.js vai injetar o conteúdo de cada page.tsx */}
        {children}
      </body>
    </html>
  );
}
