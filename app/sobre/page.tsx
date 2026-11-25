import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className='max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6'>
      {/* Cabeçalho da página */}
      <div className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200'>
        <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>
          Sobre o Projeto
        </h1>
        <p className='mt-3 text-slate-600 leading-relaxed'>
          Em 2021, em plena pandemia, depois de criar alguns dispositios com
          microprocessadores, tive a ideia de fazer uma estação meteorológica
          para o sitio do Eduardo e Denise em São Francisco Xavier.
        </p>
        <p className='mt-3 text-slate-600 leading-relaxed'>
          O problema é que eu não programava há mais de 40 anos. Foi então que
          eu passei a estudar HTML, Python, JavaScript, SQL,.... e me apaixonei.
          Voltei a desenvolver de forma compulsiva.
        </p>
        <p className='mt-3 text-slate-600 leading-relaxed'>
          Havia esquecido do desafio. Mas depois de desenvolver sistemas bem
          mais complexos, envolvendo IA, Machine Learning, scraping,... fui
          convidado para um novo projeto envolvendo tecnologias que não
          dominava. Foi assim que para estudar Next.js, MongoDB em ambiente
          Dokku, resolvi fechar o ciclo.
        </p>
        <p className='mt-3 text-slate-600 leading-relaxed'>
          Djublandia Station é um protótipo de uma estação climática para estudo
          das variações meteorológicas ao longo do tempo. Num momento onde o
          mundo discute aquecimento global, vou poder pesquisar, com dados
          próprios, como o clima vem se comportando em diferentes regiões.
        </p>
        <p className='mt-3 text-slate-600 leading-relaxed'>
          Pretendo ainda aplicar os dados a modelos de previsão, a medida que a
          base de dados tiver uma amostra consistente.
        </p>
      </div>

      {/* Seção de Arquitetura / Hardware */}
      <div className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200'>
        <h2 className='text-xl font-semibold text-slate-800 mb-3'>
          Arquitetura e Hardware
        </h2>
        <p className='text-slate-600 leading-relaxed mb-4'>
          Detalhe como os dados viajam dos sensores até a tela do celular:
        </p>
        <ul className='list-disc list-inside space-y-2 text-slate-600'>
          <li>
            <strong>Coleta em campo:</strong> Microcontrolador ESP32 com
            sensores de temperatura, umidade e pressão atmosférica.
          </li>
          <li>
            <strong>Backend & Banco de Dados:</strong> API em FastAPI com
            armazenamento no MongoDB Atlas.
          </li>
          <li>
            <strong>Frontend & PWA:</strong> Interface responsiva construída em
            Next.js e Tailwind CSS.
          </li>
        </ul>
      </div>

      {/* Seção de Referências */}
      <div className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200'>
        <h2 className='text-xl font-semibold text-slate-800 mb-3'>
          Referências e Links Úteis
        </h2>
        <ul className='space-y-2 text-slate-600'>
          <li>
            <a
              href='https://nextjs.org/docs'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Documentação oficial do Next.js
            </a>
          </li>
          <li>
            <a
              href='https://docs.espressif.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Documentação Espressif (ESP32)
            </a>
          </li>
        </ul>
      </div>

      {/* Botão simples para voltar ao painel */}
      <div>
        <Link
          href='/'
          className='inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'
        >
          ← Voltar para o painel de sensores
        </Link>
      </div>
    </main>
  );
}
