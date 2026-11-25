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
    buscarNovosDados();
    window.addEventListener('mudouLocalidade', buscarNovosDados);
    const relogio = setInterval(buscarNovosDados, 60000);

    return () => {
      window.removeEventListener('mudouLocalidade', buscarNovosDados);
      clearInterval(relogio);
    };
  }, []);

  const dadosGrafico = [...dados].reverse();
  const leituraAtual = dados.length > 0 ? dados[0] : null;

  const formatarHoraCurta = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return dataString.slice(0, 5);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatarDataHora = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return dataString;
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='flex flex-col gap-6 px-2 py-4 md:p-8 max-w-7xl mx-auto'>
      {leituraAtual && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
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

      <div className='bg-white px-1 py-3 md:p-6 rounded-xl shadow-sm border border-slate-200 w-full'>
        <div className='w-full h-[300px] md:h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={dadosGrafico}
              margin={{ top: 10, right: 0, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />

              <XAxis
                dataKey='timestamp'
                tickFormatter={formatarHoraCurta}
                minTickGap={25}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />

              <YAxis
                yAxisId='esquerda'
                width={32}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `${Math.round(val)}`}
              />

              <YAxis
                yAxisId='direita'
                orientation='right'
                width={36}
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#22c55e' }}
                tickFormatter={(val) => `${Math.round(val)}`}
              />

              <Tooltip
                labelFormatter={(label) =>
                  `Horário: ${formatarDataHora(String(label))}`
                }
              />

              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

              <Line
                yAxisId='esquerda'
                type='monotone'
                dataKey='temperatura'
                name='Temp (°C)'
                stroke='#ef4444'
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId='esquerda'
                type='monotone'
                dataKey='umidade'
                name='Umid (%)'
                stroke='#3b82f6'
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId='esquerda'
                type='monotone'
                dataKey='vento'
                name='Vento (km/h)'
                stroke='#14b8a6'
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId='direita'
                type='monotone'
                dataKey='pressao'
                name='Pressão (hPa)'
                stroke='#22c55e'
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
