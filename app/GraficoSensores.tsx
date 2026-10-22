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
};

// 1. Removemos o parâmetro dadosIniciais
export default function GraficoSensores() {
  // 2. O estado começa como uma lista vazia []
  const [dados, setDados] = useState<Leitura[]>([]);

  useEffect(() => {
    const buscarNovosDados = async () => {
      try {
        const resposta = await fetch(
          'https://djublandiastation.onrender.com/api/sensores/recentes',
        );
        if (resposta.ok) {
          const dadosAtualizados = await resposta.json();
          setDados(dadosAtualizados);
        }
      } catch (erro) {
        console.error('Erro:', erro);
      }
    };

    // 3. CRÍTICO: Chama a função imediatamente assim que a tela abre
    buscarNovosDados();

    // 4. E depois liga o relógio para atualizar a cada 60 segundos
    const relogio = setInterval(buscarNovosDados, 60000);
    return () => clearInterval(relogio);
  }, []);

  const dadosGrafico = [...dados].reverse();

  const formatarHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const leituraAtual = dados.length > 0 ? dados[0] : null;

  return (
    <div className='flex flex-col gap-6'>
      {/* 1. Mudei para md:grid-cols-4 para caberem os 4 cards */}
      {leituraAtual && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-500'>
            <h3 className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
              Temperatura
            </h3>
            <div className='mt-2 flex items-baseline gap-2'>
              <p className='text-4xl font-bold text-slate-800'>
                {leituraAtual.temperatura}
              </p>
              <p className='text-xl text-slate-500'>°C</p>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500'>
            <h3 className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
              Umidade
            </h3>
            <div className='mt-2 flex items-baseline gap-2'>
              <p className='text-4xl font-bold text-slate-800'>
                {leituraAtual.umidade}
              </p>
              <p className='text-xl text-slate-500'>%</p>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-teal-500'>
            <h3 className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
              Vento
            </h3>
            <div className='mt-2 flex items-baseline gap-2'>
              <p className='text-4xl font-bold text-slate-800'>
                {leituraAtual.vento}
              </p>
              <p className='text-xl text-slate-500'>km/h</p>
            </div>
          </div>

          {/* NOVO CARD: Pressão Atmosférica */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500'>
            <h3 className='text-slate-500 text-sm font-medium uppercase tracking-wider'>
              Pressão
            </h3>
            <div className='mt-2 flex items-baseline gap-2'>
              <p className='text-4xl font-bold text-slate-800'>
                {leituraAtual.pressao}
              </p>
              <p className='text-xl text-slate-500'>hPa</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Atualização do Gráfico com Eixo Y Secundário */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[450px]'>
        <h2 className='text-xl font-semibold mb-6'>
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

            {/* Eixo Esquerdo (Para Temp e Umidade: 0 a 100) */}
            <YAxis
              yAxisId='esquerda'
              tick={{ fontSize: 12, fill: '#64748b' }}
            />

            {/* Eixo Direito (Para Pressão: 1000 a 1030) */}
            <YAxis
              yAxisId='direita'
              orientation='right'
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: '#8b5cf6' }}
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

            {/* Nova linha de Pressão apontando para o Eixo Direito */}
            <Line
              yAxisId='direita'
              type='monotone'
              dataKey='pressao'
              name='Pressão (hPa)'
              stroke='#8b5cf6'
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
