import GraficoSensores from './GraficoSensores';

// 1. SERVER COMPONENT: Esta função roda apenas no servidor Node.js.
// Ela acessa sua API Python internamente.
async function getDados() {
  // O cache: 'no-store' força o Next.js a buscar dados novos a cada refresh
  const resposta = await fetch('http://127.0.0.1:8000/api/sensores', {
    cache: 'no-store',
  });

  if (!resposta.ok) {
    throw new Error('Falha ao buscar dados da API Python');
  }

  return resposta.json();
}

export default async function Home() {
  // O componente espera a busca dos dados terminar
  const dados = await getDados();

  // O HTML já vai para o navegador do usuário com os dados injetados
  return (
    <main className='p-8 bg-slate-100 min-h-screen text-slate-900'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold mb-2'>
          Estação Meteorológica Djublândia
        </h1>
        <p className='text-slate-500 mb-8'>
          Monitoramento em tempo real by Carlos Ramires
        </p>

        {/* 
          Passamos os dados crus do servidor para o componente de gráfico 
          (que rodará no cliente/navegador)
        */}
        <GraficoSensores dadosIniciais={dados} />
      </div>
    </main>
  );
}
