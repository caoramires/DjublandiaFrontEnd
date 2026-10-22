// components/navbar.tsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [localidade, setLocalidade] = useState('Campinas');

  useEffect(() => {
    const salva = localStorage.getItem('localidadeSelecionada');
    if (salva) setLocalidade(salva);
  }, []);

  const mudarLocalidade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nova = e.target.value;
    setLocalidade(nova);
    localStorage.setItem('localidadeSelecionada', nova);
    // Dispara um aviso para os gráficos recarregarem os dados
    window.dispatchEvent(new Event('mudouLocalidade'));
  };

  return (
    <nav className='bg-slate-900 text-slate-100 p-4 shadow-md sticky top-0 z-50'>
      <div className='max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4'>
        <Link href='/' className='text-xl font-bold text-sky-400'>
          DjublandiaStation
        </Link>

        <div className='flex items-center gap-6 text-sm font-medium'>
          <Link
            href='/historico/temperatura'
            className='text-slate-300 hover:text-white transition'
          >
            Histórico
          </Link>

          {/* Seletor de Localidade em vez de Configurações */}
          <div className='flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <span className='text-slate-400'>📍</span>
            <select
              value={localidade}
              onChange={mudarLocalidade}
              className='bg-transparent text-white outline-none cursor-pointer'
            >
              <option value='Campinas'>Campinas</option>
              <option value='Itajubá'>Itajubá</option>
              <option value='São Paulo'>São Paulo</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
