'use client';

// 1. Importamos os "Hooks" do React (ferramentas de interatividade)
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
  timestamp: string;
};

// Agora chamamos a propriedade de "dadosIniciais"
export default function GraficoSensores({
  dadosIniciais,
}: {
  dadosIniciais: Leitura[];
}) {
  // 2. ESTADO: Criamos uma variável 'dados' que, toda vez que for atualizada
  // usando o 'setDados', fará o gráfico se redesenhar sozinho na tela.
  const [dados, setDados] = useState<Leitura[]>(dadosIniciais);

  // 3. EFEITO: O useEffect é o nosso "motor de fundo". Ele roda quando o gráfico aparece na tela.
  useEffect(() => {
    // Função que vai até a API Python buscar os dados
    const buscarNovosDados = async () => {
      try {
        const resposta = await fetch('http://127.0.0.1:8000/api/sensores');
        if (resposta.ok) {
          const dadosAtualizados = await resposta.json();
          setDados(dadosAtualizados); // Injeta os novos dados no Estado!
        }
      } catch (erro) {
        console.error('Erro ao buscar dados na API:', erro);
      }
    };

    // Cria um relógio (intervalo) que executa a função acima a cada 5000ms (5 segundos)
    const relogio = setInterval(buscarNovosDados, 5000);

    // Função de limpeza: se o usuário mudar de página, desligamos o relógio para não gastar memória
    return () => clearInterval(relogio);
  }, []); // Os colchetes vazios significam: "Ligue esse motor apenas uma vez ao carregar a página"

  // O resto do código continua igual, apenas preparando os dados para o gráfico
  const dadosGrafico = [...dados].reverse();

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
      <h2 className='text-xl font-semibold mb-6'>
        Monitoramento em Tempo Real (5s)
      </h2>

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

          {/* O Recharts já tem animação nativa! Quando os dados mudam, 
              ele cria uma transição suave (isAnimationActive é true por padrão) */}
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
