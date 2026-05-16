import { motion } from 'framer-motion';
import { 
  Shield, 
  Info, 
  Settings, 
  Share2, 
  Clock, 
  UserCheck, 
  RefreshCcw, 
  Mail,
  ExternalLink,
  ChevronRight,
  Globe,
  Database,
  PieChart,
  Target
} from 'lucide-react';

export default function CookiePolicy() {
  const lastUpdate = "16 de maio de 2026";

  const browserLinks = [
    { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
    { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam' },
    { name: 'Safari', url: 'https://support.apple.com/pt-br/guide/safari/sfri11471/mac' },
    { name: 'Microsoft Edge', url: 'https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }
  ];

  const partners = [
    { name: 'Vercel', url: 'https://vercel.com', desc: 'Hospedagem e Analytics' },
    { name: 'Stripe', url: 'https://stripe.com/br', desc: 'Processamento de Pagamentos' },
    { name: 'Supabase', url: 'https://supabase.com', desc: 'Banco de Dados e Autenticação' },
    { name: 'Google', url: 'https://google.com', desc: 'Analytics e Publicidade' },
    { name: 'Meta', url: 'https://meta.com', desc: 'Marketing (Instagram/Facebook)' }
  ];

  return (
    <div className="min-h-screen bg-pink-50 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-pink-100/50 p-8 md:p-14 border border-white"
        >
          {/* Header */}
          <div className="mb-12 border-b border-pink-50 pb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-xs font-bold mb-6">
              <Shield className="w-4 h-4" />
              <span>Transparência & Segurança</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-handwritten font-bold text-gray-800 mb-4">
              Política de Cookies
            </h1>
            <p className="text-gray-400 text-sm">
              Última atualização: <span className="font-semibold">{lastUpdate}</span>
            </p>
          </div>

          <div className="space-y-16">
            {/* Introdução */}
            <section>
              <p className="text-gray-600 leading-relaxed">
                A <strong>Déia Art Laços</strong> valoriza a privacidade e a transparência no tratamento de dados pessoais dos usuários. Esta política explica o que são cookies, como os utilizamos e como você pode gerenciar suas preferências, em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
              </p>
            </section>

            {/* 1. O que são cookies */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Info className="w-6 h-6" />
                <h2 className="text-2xl font-bold">1. O que são cookies?</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cookies são pequenos arquivos de texto armazenados no seu navegador ou dispositivo quando você visita um site. Eles servem para:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Melhorar a experiência do usuário',
                  'Lembrar suas preferências',
                  'Analisar desempenho do site',
                  'Fornecer funcionalidades essenciais',
                  'Personalizar conteúdos e anúncios'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-pink-50/30 rounded-2xl border border-pink-100/50">
                    <ChevronRight className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Quais cookies utilizamos */}
            <section>
              <div className="flex items-center gap-3 mb-8 text-pink-600">
                <Settings className="w-6 h-6" />
                <h2 className="text-2xl font-bold">2. Quais cookies utilizamos?</h2>
              </div>
              
              <div className="space-y-6">
                {/* 2.1 Essenciais */}
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4 text-gray-800">
                    <Database className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold">2.1 Cookies Essenciais</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Necessários para o funcionamento adequado do site. Permitem navegação segura, carregamento de páginas e funcionamento de formulários.
                  </p>
                  <div className="bg-white p-3 rounded-xl inline-block border border-gray-100 text-[10px] font-bold text-pink-500 uppercase tracking-wider">
                    Base Legal: Execução do Serviço e Legítimo Interesse
                  </div>
                </div>

                {/* 2.2 Desempenho */}
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4 text-gray-800">
                    <PieChart className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold">2.2 Cookies de Desempenho e Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Ajudam a entender como os visitantes utilizam o site (páginas visitadas, tempo de navegação). Ferramentas: Google Analytics e Vercel Analytics.
                  </p>
                  <div className="bg-pink-100 p-3 rounded-xl inline-block text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                    Base Legal: Consentimento do Usuário
                  </div>
                </div>

                {/* 2.3 Marketing */}
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4 text-gray-800">
                    <Target className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold">2.3 Cookies de Marketing e Publicidade</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Utilizados para exibir anúncios personalizados e remarketing. Ferramentas: Meta Pixel, TikTok Pixel e Google Ads.
                  </p>
                  <div className="bg-pink-100 p-3 rounded-xl inline-block text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                    Base Legal: Consentimento do Usuário
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Compartilhamento */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Share2 className="w-6 h-6" />
                <h2 className="text-2xl font-bold">3. Compartilhamento de dados</h2>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Alguns cookies coletam dados compartilhados com fornecedores terceirizados para garantir nossa infraestrutura:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners.map((partner, i) => (
                  <a 
                    key={i} 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-pink-200 hover:shadow-md transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{partner.name}</h4>
                      <p className="text-xs text-gray-400">{partner.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
                  </a>
                ))}
              </div>
            </section>

            {/* 4. Como gerenciar */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Settings className="w-6 h-6" />
                <h2 className="text-2xl font-bold">4. Como gerenciar cookies</h2>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Você pode aceitar ou recusar cookies não essenciais através do nosso banner. Além disso, pode gerenciar diretamente no seu navegador:
              </p>
              <div className="flex flex-wrap gap-3">
                {browserLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:text-pink-500 hover:border-pink-200 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    {link.name}
                  </a>
                ))}
              </div>
            </section>

            {/* 5. Retenção */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Clock className="w-6 h-6" />
                <h2 className="text-2xl font-bold">5. Retenção dos cookies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-2">Sessão (Temporários)</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Removidos automaticamente quando você fecha o seu navegador.</p>
                </div>
                <div className="p-6 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-2">Persistentes</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Permanecem até expirarem ou serem excluídos manualmente por você.</p>
                </div>
              </div>
            </section>

            {/* 6. Direitos */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <UserCheck className="w-6 h-6" />
                <h2 className="text-2xl font-bold">6. Direitos do titular de dados</h2>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">Nos termos da LGPD, você pode exercer seus direitos através de nossa Central de Atendimento:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Confirmação', 'Acesso', 'Correção', 'Exclusão', 'Portabilidade', 'Revogação'].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl text-center text-xs font-bold text-gray-500 border border-gray-100">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Alterações */}
            <section className="p-10 rounded-[2rem] bg-gradient-to-br from-pink-500 to-pink-600 text-white relative overflow-hidden">
              <RefreshCcw className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
              <h2 className="text-2xl font-bold mb-4 relative z-10">7. Alterações desta Política</h2>
              <p className="text-pink-100 leading-relaxed text-sm relative z-10">
                Esta Política poderá ser atualizada periodicamente para refletir alterações legais ou tecnológicas. Recomendamos a consulta regular desta página.
              </p>
            </section>

            {/* 8. Contato */}
            <section className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6 text-pink-600">
                <Mail className="w-6 h-6" />
                <h2 className="text-2xl font-bold">8. Contato</h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm inline-block">
                <p className="text-gray-600 mb-4">Dúvidas sobre seus dados? Fale com nosso DPO:</p>
                <a href="mailto:andreafranco.com@gmail.com" className="text-xl md:text-2xl font-bold text-pink-500 hover:text-pink-600 transition-colors">
                  andreafranco.com@gmail.com
                </a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
