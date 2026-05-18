import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  UserX,
  AlertTriangle,
  Scale,
  Mail,
  ChevronRight,
  Shield,
  Gavel,
} from 'lucide-react';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6 text-pink-600">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CardList({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 bg-pink-50/40 rounded-2xl border border-pink-100/60"
        >
          <ChevronRight className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
          <span className="text-sm text-gray-700 font-medium leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function TermsOfUse() {
  const lastUpdate = '17 de maio de 2026';

  return (
    <div className="min-h-screen bg-pink-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-pink-100/50 p-5 sm:p-8 md:p-14 border border-white"
        >
          {/* Header */}
          <div className="mb-12 border-b border-pink-50 pb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-xs font-bold mb-6">
              <Gavel className="w-4 h-4" />
              <span>Contrato de Uso</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-handwritten font-bold text-gray-800 mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-400 text-sm">
              Última atualização:{' '}
              <span className="font-semibold">{lastUpdate}</span>
            </p>
          </div>

          <div className="space-y-16">
            {/* Introdução */}
            <section>
              <p className="text-gray-600 leading-relaxed">
                Bem-vinda à <strong>Déia Art Laços</strong>! Ao acessar e
                utilizar este site, você concorda integralmente com os Termos de
                Uso descritos abaixo. Caso não concorde com qualquer disposição,
                pedimos que não utilize nossos serviços. Estes termos estão em
                conformidade com o{' '}
                <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>{' '}
                e a <strong>LGPD (Lei nº 13.709/2018)</strong>.
              </p>
            </section>

            {/* 1. Sobre o site */}
            <Section
              icon={<FileText className="w-6 h-6" />}
              title="1. Sobre o site"
            >
              <p className="text-gray-600 leading-relaxed mb-4">
                O site <strong>Déia Art Laços</strong> é uma loja virtual
                especializada em laços artesanais feitos à mão. Nosso objetivo
                é oferecer produtos de qualidade com todo o amor e cuidado que
                sua princesa merece.
              </p>
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>Responsável:</strong> Déia Art Laços
                  <br />
                  <strong>Contato:</strong>{' '}
                  <a
                    href="mailto:andreafranco.com@gmail.com"
                    className="text-pink-500 hover:underline"
                  >
                    andreafranco.com@gmail.com
                  </a>
                  <br />
                  <strong>WhatsApp:</strong>{' '}
                  <a
                    href="https://wa.me/5527997948142"
                    className="text-pink-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (27) 99794-8142
                  </a>
                </p>
              </div>
            </Section>

            {/* 2. Cadastro e conta */}
            <Section
              icon={<Shield className="w-6 h-6" />}
              title="2. Cadastro e conta de usuário"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                Para realizar compras, você precisará criar uma conta. Ao se
                cadastrar, você se compromete a:
              </p>
              <CardList
                items={[
                  'Fornecer informações verdadeiras, completas e atualizadas',
                  'Manter o sigilo da sua senha e não compartilhá-la com terceiros',
                  'Notificar-nos imediatamente sobre qualquer uso não autorizado',
                  'Ser responsável por todas as atividades realizadas na sua conta',
                  'Ter pelo menos 18 anos, ou autorização de responsável legal',
                  'Não criar contas falsas ou múltiplas sem autorização',
                ]}
              />
            </Section>

            {/* 3. Produtos e pedidos */}
            <Section
              icon={<ShoppingBag className="w-6 h-6" />}
              title="3. Produtos e pedidos"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                Todos os laços são produzidos artesanalmente. Por serem itens
                exclusivos e feitos à mão, observe as condições abaixo:
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: 'Disponibilidade',
                    desc: 'Os produtos estão sujeitos à disponibilidade de estoque. Reservamos o direito de cancelar pedidos de itens esgotados, com reembolso integral.',
                  },
                  {
                    title: 'Variações artesanais',
                    desc: 'Por serem feitos à mão, cada produto é único. Pequenas variações de cor, tamanho e acabamento são características do artesanato e não constituem defeito.',
                  },
                  {
                    title: 'Preços',
                    desc: 'Os preços são exibidos em Reais (BRL) e podem ser alterados sem aviso prévio. O valor cobrado é o vigente no momento da confirmação do pedido.',
                  },
                  {
                    title: 'Imagens',
                    desc: 'As imagens dos produtos são fotos reais dos itens produzidos. As cores podem apresentar pequenas variações de acordo com as configurações do monitor de cada dispositivo.',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-gray-50 border border-gray-100"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 4. Pagamento */}
            <Section
              icon={<CreditCard className="w-6 h-6" />}
              title="4. Pagamento"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                O pagamento é processado de forma segura. Aceitamos as
                seguintes formas:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Pix', sub: 'Aprovação imediata' },
                  { label: 'Cartão de Crédito', sub: 'Até 12x' },
                  { label: 'Cartão de Débito', sub: 'À vista' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-pink-100 text-center bg-pink-50/30"
                  >
                    <p className="font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Pedidos somente serão processados após a confirmação do
                pagamento. Em caso de falha na transação, o pedido será
                automaticamente cancelado.
              </p>
            </Section>

            {/* 5. Entrega */}
            <Section
              icon={<Truck className="w-6 h-6" />}
              title="5. Entrega e frete"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                Realizamos envios para todo o Brasil. As condições de entrega
                são:
              </p>
              <CardList
                items={[
                  'O prazo de entrega começa a contar a partir do término da produção do laço.',
                  'Prazo de produção artesanal: até 5 dias úteis antes do envio.',
                  'O frete é calculado com base no CEP de destino.',
                  'O rastreamento é disponibilizado por whatsapp após o envio.',
                  'Atrasos dos Correios ou transportadoras são de responsabilidade das mesmas.',
                  'Endereços incorretos são de responsabilidade do comprador.',
                ]}
              />
            </Section>

            {/* 6. Trocas e devoluções */}
            <Section
              icon={<RefreshCw className="w-6 h-6" />}
              title="6. Trocas e devoluções"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                Seguimos o Código de Defesa do Consumidor. Você tem o direito de:
              </p>
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    Arrependimento (Compras online)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Desistência em até <strong>7 dias corridos</strong> após o
                    recebimento, sem necessidade de justificativa. O produto
                    deve ser devolvido sem sinais de uso, na embalagem original.
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    Produtos com defeito
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Prazo de <strong>30 dias</strong> para reclamar defeitos em
                    produtos não duráveis. Entre em contato via WhatsApp com
                    fotos do problema para análise.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Para mais detalhes, consulte nossa{' '}
                <a
                  href="/politica-troca"
                  className="text-pink-500 hover:underline font-medium"
                >
                  Política de Trocas e Devoluções
                </a>
                .
              </p>
            </Section>

            {/* 7. Conduta proibida */}
            <Section
              icon={<UserX className="w-6 h-6" />}
              title="7. Conduta proibida"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                É expressamente vedado ao usuário:
              </p>
              <CardList
                items={[
                  'Utilizar o site para fins ilegais ou fraudulentos',
                  'Tentar acessar áreas restritas sem autorização',
                  'Usar robôs, scrapers ou automações sem consentimento',
                  'Reproduzir conteúdo sem autorização expressa da Déia Art Laços',
                  'Difamar, caluniar ou assediar outros usuários ou a loja',
                  'Efetuar pedidos com dados falsos ou cartões clonados',
                  'Realizar engenharia reversa do sistema ou software',
                  'Compartilhar credenciais de acesso com terceiros',
                ]}
              />
            </Section>

            {/* 8. Propriedade intelectual */}
            <Section
              icon={<AlertTriangle className="w-6 h-6" />}
              title="8. Propriedade intelectual"
            >
              <p className="text-gray-600 leading-relaxed">
                Todo o conteúdo deste site — incluindo textos, imagens, logos,
                vídeos, design e código — é propriedade exclusiva da{' '}
                <strong>Déia Art Laços</strong> e protegido pela Lei de Direitos
                Autorais (Lei nº 9.610/1998). É proibida qualquer reprodução,
                distribuição ou modificação sem autorização prévia e por escrito.
              </p>
            </Section>

            {/* 9. Limitação de responsabilidade */}
            <Section
              icon={<Scale className="w-6 h-6" />}
              title="9. Limitação de responsabilidade"
            >
              <p className="text-gray-600 leading-relaxed mb-4">
                A <strong>Déia Art Laços</strong> não se responsabiliza por:
              </p>
              <CardList
                items={[
                  'Falhas de conexão à internet ou indisponibilidade temporária do site',
                  'Danos causados por vírus ou ataques cibernéticos de terceiros',
                  'Uso inadequado dos produtos após a entrega',
                  'Atrasos de entrega por motivos de força maior',
                  'Informações incorretas fornecidas pelo próprio usuário',
                ]}
              />
            </Section>

            {/* 10. Alterações */}
            <section className="p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-pink-500 to-pink-600 text-white relative overflow-hidden shadow-lg shadow-pink-200">
              <FileText className="absolute -top-4 -right-4 w-24 sm:w-32 h-24 sm:h-32 opacity-10 rotate-12" />
              <h2 className="text-xl sm:text-2xl font-bold mb-4 relative z-10 text-white drop-shadow-sm">
                10. Alterações destes Termos
              </h2>
              <p className="text-white/90 leading-relaxed text-sm relative z-10 font-medium">
                Podemos atualizar estes Termos de Uso a qualquer momento para
                refletir mudanças legais, operacionais ou de serviço. A versão
                mais recente sempre estará disponível nesta página. O uso
                continuado do site após alterações constitui aceite dos novos
                termos.
              </p>
            </section>

            {/* 11. Foro e legislação */}
            <section className="p-8 rounded-3xl border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3 mb-4 text-pink-600">
                <Gavel className="w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-800">
                  11. Foro e legislação aplicável
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Estes Termos são regidos pelas leis da{' '}
                <strong>República Federativa do Brasil</strong>. Quaisquer
                disputas serão submetidas ao foro da comarca de{' '}
                <strong>Vitória/ES</strong>, com renúncia expressa a qualquer
                outro, por mais privilegiado que seja.
              </p>
            </section>

            {/* Contato */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Mail className="w-6 h-6" />
                <h2 className="text-2xl font-bold text-gray-800">
                  12. Contato
                </h2>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm w-full">
                <p className="text-gray-600 mb-4">
                  Dúvidas sobre estes Termos? Entre em contato conosco:
                </p>
                <a
                  href="mailto:andreafranco.com@gmail.com"
                  className="text-sm sm:text-base font-bold text-pink-500 hover:text-pink-600 transition-colors"
                >
                  andreafranco.com@gmail.com
                </a>
                <p className="mt-3 text-sm text-gray-400">
                  Ou via WhatsApp:{' '}
                  <a
                    href="https://wa.me/5527997948142"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:underline font-medium"
                  >
                    (27) 99794-8142
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <p className="mt-16 pt-8 border-t border-pink-50 text-xs text-gray-400 text-center">
            Ao utilizar o site Déia Art Laços, você declara ter lido, entendido
            e concordado com todos os termos acima.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
