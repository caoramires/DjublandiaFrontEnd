//  app/historico/[indice]/page.tsx

'use client';

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Link from 'next/link';

const configMetricas: Record<string, { cor: string; label: string }> = {
  temperatura: { cor: '#ef4444', label: 'Temperatura (°C)' },
  umidade: { cor: '#3b82f6', label: 'Umidade (%)' },
  vento: { cor: '#14b8a6', label: 'Vento (km/h)' },
  pressao: { cor: '#a855f7', label: 'Pressão (hPa)' },
};

function HistoricoConteudo() {
  const params = useParams();
  const indice = (params.indice as string) || 'temperatura';
  const configAtual = configMetricas[indice] || configMetricas.temperatura;

  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState('');
  const [dia, setDia] = useState('');

  const [resultados, setResultados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const buscarDados = async () => {
    setCarregando(true);

    const loc = localStorage.getItem('localidadeSelecionada') || 'Campinas';

    // Constrói a URL dinamicamente injetando a localidade
    let url = `https://djublandiastation.onrender.com/api/sensores/pesquisa?localidade=${loc}&ano=${ano}`;
    if (mes) url += `&mes=${mes}`;
    if (mes && dia) url += `&dia=${dia}`;

    try {
      const resposta = await fetch(url);
      if (resposta.ok) {
        const dados = await resposta.json();
        setResultados(dados.reverse());
      }
    } catch (erro) {
      console.error('Erro na busca histórica:', erro);
    }
    setCarregando(false);
  };

  const formatarEixoX = (dataString: any) => {
    if (!dataString) return '';
    const d = new Date(dataString);
    if (!mes)
      return d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    if (!dia)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formataTooltip = (dataString: any) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    // Ajuste de padding responsivo
    <main className='p-4 md:p-8 max-w-5xl mx-auto min-h-screen text-slate-100'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 capitalize'>
        Histórico: {indice}
      </h1>

      {/* Menu de Navegação - Scroll horizontal no celular */}
      <div className='flex gap-2 md:gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
        {Object.keys(configMetricas).map((chave) => (
          <Link
            key={chave}
            href={`/historico/${chave}`}
            className={`px-4 py-2 rounded-md capitalize font-medium transition ${
              indice === chave
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {chave}
          </Link>
        ))}
      </div>

      {/* Filtros Livres - Organização flexível em telas menores */}
      <div className='bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border border-slate-700 mb-8 flex flex-col md:flex-row flex-wrap gap-4 md:items-end'>
        <div className='flex flex-col gap-2 w-full md:w-auto'>
          <label className='font-semibold text-slate-300 text-sm'>Ano</label>
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className='border border-slate-600 p-2 rounded-lg outline-none bg-slate-900 text-slate-100 focus:border-sky-500 w-full md:min-w-[100px]'
          >
            <option value='2024'>2024</option>
            <option value='2025'>2025</option>
            <option value='2026'>2026</option>
          </select>
        </div>

        <div className='flex flex-col gap-2 w-full md:w-auto'>
          <label className='font-semibold text-slate-300 text-sm'>Mês</label>
          <select
            value={mes}
            onChange={(e) => {
              setMes(e.target.value);
              setDia('');
            }}
            className='border border-slate-600 p-2 rounded-lg outline-none bg-slate-900 text-slate-100 focus:border-sky-500 w-full md:min-w-[140px]'
          >
            <option value=''>Ano Inteiro</option>
            <option value='1'>Janeiro</option>
            <option value='2'>Fevereiro</option>
            <option value='3'>Março</option>
            <option value='4'>Abril</option>
            <option value='5'>Maio</option>
            <option value='6'>Junho</option>
            <option value='7'>Julho</option>
            <option value='8'>Agosto</option>
            <option value='9'>Setembro</option>
            <option value='10'>Outubro</option>
            <option value='11'>Novembro</option>
            <option value='12'>Dezembro</option>
          </select>
        </div>

        {mes && (
          <div className='flex flex-col gap-2 w-full md:w-auto'>
            <label className='font-semibold text-slate-300 text-sm'>Dia</label>
            <select
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className='border border-slate-600 p-2 rounded-lg outline-none bg-slate-900 text-slate-100 focus:border-sky-500 w-full md:min-w-[120px]'
            >
              <option value=''>Mês Inteiro</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={buscarDados}
          className='bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition font-medium h-[42px] md:ml-auto border border-sky-500 w-full md:w-auto'
          disabled={carregando}
        >
          {carregando ? 'Buscando...' : 'Pesquisar Banco'}
        </button>
      </div>

      {/* Gráfico responsivo */}
      {resultados.length > 0 ? (
        <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] md:h-[500px] flex flex-col'>
          <div className='mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
            <h2 className='text-lg md:text-xl font-semibold text-slate-800'>
              Tendência Evolutiva
            </h2>
            <span className='text-xs md:text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium border border-slate-200 w-fit'>
              {resultados.length} leituras encontradas
            </span>
          </div>

          <div className='flex-1 min-h-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={resultados}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='timestamp'
                  tickFormatter={formatarEixoX}
                  minTickGap={30}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip
                  labelFormatter={formataTooltip}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey={indice}
                  name={configAtual.label}
                  stroke={configAtual.cor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className='text-center p-8 md:p-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed'>
          Selecione o período de tempo e clique em Pesquisar para ver as
          tendências.
        </div>
      )}
    </main>
  );
}

export default function HistoricoMedicoes() {
  return (
    <Suspense
      fallback={
        <div className='p-12 text-center text-slate-500'>
          Carregando histórico...
        </div>
      }
    >
      <HistoricoConteudo />
    </Suspense>
  );
}
