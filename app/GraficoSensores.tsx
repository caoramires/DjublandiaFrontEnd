// Grafico\sensores.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Leitura = {
  temperatura: number;
  umidade: number;
  vento: number;
  pressao: number;
  timestamp: string;
  localidade?: string;
};

export default function GraficoSensores() {
  const [dados, setDados] = useState<Leitura[]>([]);

  const buscarNovosDados = async () => {
    try {
      // Captura a localidade do navegador ou usa Campinas como padrão
      const loc = localStorage.getItem('localidadeSelecionada') || 'Campinas';

      const resposta = await fetch(
        `https://djublandiastation.onrender.com/api/sensores/recentes?localidade=${loc}`,
      );
      if (resposta.ok) {
        const dadosAtualizados = await resposta.json();
        setDados(dadosAtualizados);
      }
    } catch (erro) {
      console.error('Erro:', erro);
    }
  };

  useEffect(() => {
    // 1. Busca imediatamente ao carregar a tela
    buscarNovosDados();

    // 2. Escuta o evento customizado disparado pela Navbar ao trocar de cidade
    window.addEventListener('mudouLocalidade', buscarNovosDados);

    // 3. Relógio para atualizar a cada 60 segundos automaticamente
    const relogio = setInterval(buscarNovosDados, 60000);

    // Limpeza ao desmontar o componente
    return () => {
      window.removeEventListener('mudouLocalidade', buscarNovosDados);
      clearInterval(relogio);
    };
  }, []);

  const dadosGrafico = [...dados].reverse();

  const formatarHora = (dataString: any) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const leituraAtual = dados.length > 0 ? dados[0] : null;

  return (
    // Padrão celular: padding menor (p-4). Desktop: padding maior (md:p-8)
    <div className='flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto'>
      {leituraAtual && (
        // Padrão celular: 2 colunas. Desktop: 4 colunas
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
          <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-500'>
            <h3 className='text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider'>
              Temperatura
            </h3>
            <div className='mt-2 flex items-baseline gap-1 md:gap-2'>
              <p className='text-2xl md:text-4xl font-bold text-slate-800'>
                {leituraAtual.temperatura}
              </p>
              <p className='text-sm md:text-xl text-slate-500'>°C</p>
            </div>
          </div>

          <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500'>
            <h3 className='text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider'>
              Umidade
            </h3>
            <div className='mt-2 flex items-baseline gap-1 md:gap-2'>
              <p className='text-2xl md:text-4xl font-bold text-slate-800'>
                {leituraAtual.umidade}
              </p>
              <p className='text-sm md:text-xl text-slate-500'>%</p>
            </div>
          </div>

          <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-teal-500'>
            <h3 className='text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider'>
              Vento
            </h3>
            <div className='mt-2 flex items-baseline gap-1 md:gap-2'>
              <p className='text-2xl md:text-4xl font-bold text-slate-800'>
                {leituraAtual.vento}
              </p>
              <p className='text-sm md:text-xl text-slate-500'>km/h</p>
            </div>
          </div>

          <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-green-500'>
            <h3 className='text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider'>
              Pressão
            </h3>
            <div className='mt-2 flex items-baseline gap-1 md:gap-2'>
              <p className='text-2xl md:text-4xl font-bold text-slate-800'>
                {leituraAtual.pressao}
              </p>
              <p className='text-sm md:text-xl text-slate-500'>hPa</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico: altura menor no celular, maior no desktop */}
      <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] md:h-[500px]'>
        <h2 className='text-lg md:text-xl font-semibold mb-6'>
          Monitoramento em Tempo Real
        </h2>

        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='timestamp'
              tickFormatter={formatarHora}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />

            <YAxis
              yAxisId='esquerda'
              tick={{ fontSize: 12, fill: '#64748b' }}
            />

            <YAxis
              yAxisId='direita'
              orientation='right'
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: '#22c55e' }}
            />

            <Tooltip
              labelFormatter={formatarHora}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />

            <Line
              yAxisId='esquerda'
              type='monotone'
              dataKey='temperatura'
              name='Temp (°C)'
              stroke='#ef4444'
              strokeWidth={3}
              dot={false}
            />
            <Line
              yAxisId='esquerda'
              type='monotone'
              dataKey='umidade'
              name='Umidade (%)'
              stroke='#3b82f6'
              strokeWidth={3}
              dot={false}
            />
            <Line
              yAxisId='direita'
              type='monotone'
              dataKey='pressao'
              name='Pressão (hPa)'
              stroke='#22c55e'
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
