// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    // bg-slate-900 (fundo escuro), text-white (texto branco), shadow-md (sombra)
    <nav className='bg-slate-900 text-white shadow-md'>
      <div className='max-w-5xl mx-auto flex justify-between items-center p-4'>
        {/* Lado Esquerdo: Logo */}
        <div className='font-bold text-xl tracking-wider text-sky-400'>
          ⛅ DjublandiaStation
        </div>

        {/* Lado Direito: Links */}
        <div className='flex gap-6'>
          {/* O Link do Next.js navega sem recarregar a tela inteira */}
          <Link href='/' className='hover:text-sky-400 transition-colors'>
            Painel Geral
          </Link>
          <Link
            href='/historico/temperatura'
            className='hover:text-sky-400 transition-colors'
          >
            Histórico
          </Link>
          <Link
            href='/configuracoes'
            className='hover:text-sky-400 transition-colors'
          >
            Configurações
          </Link>
        </div>
      </div>
    </nav>
  );
}
