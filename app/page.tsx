// app/page.tsx
import GraficoSensores from './GraficoSensores';

export default function Home() {
  return (
    <main className='p-8 bg-slate-100 min-h-screen text-slate-900'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold mb-2'>Estação Meteorológica</h1>
        <p className='text-slate-500 mb-8'>
          Monitoramento em tempo real via ESP32 e Python
        </p>

        {/* O componente agora é independente e busca os dados sozinho */}
        <GraficoSensores />
      </div>
    </main>
  );
}
