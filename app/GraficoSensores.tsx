'use client'; // 2. CLIENT COMPONENT: A diretiva que diz ao Next.js para enviar este JS ao navegador

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

// Definimos o tipo de dado que esperamos receber (TypeScript)
type Leitura = {
  temperatura: number;
  umidade: number;
  vento: number;
  timestamp: string;
};

export default function GraficoSensores({ dados }: { dados: Leitura[] }) {
  // A API Python manda do mais novo pro mais velho.
  // Pro gráfico, invertemos para a linha do tempo ir da esquerda pra direita.
  const dadosGrafico = [...dados].reverse();

  // Formatador simples para a hora
  const formatarHora = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[450px]'>
      <h2 className='text-xl font-semibold mb-6'>Temperatura e Umidade</h2>

      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />

          <XAxis
            dataKey='timestamp'
            tickFormatter={formatarHora}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />

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
            type='monotone'
            dataKey='temperatura'
            name='Temp (°C)'
            stroke='#ef4444'
            strokeWidth={3}
            dot={false}
          />
          <Line
            type='monotone'
            dataKey='umidade'
            name='Umidade (%)'
            stroke='#3b82f6'
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
