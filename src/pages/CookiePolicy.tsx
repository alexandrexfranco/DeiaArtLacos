import { motion } from 'framer-motion';
import { Cookie, ShieldCheck, Clock, Share2, Info, Scale, UserCheck, Mail } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-pink-50/30 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-pink-100"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <Cookie className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Política de Cookies</h1>
              <p className="text-pink-500 text-sm font-medium uppercase tracking-wider">Conformidade LGPD (Lei 13.709/2018)</p>
            </div>
          </div>

          <p className="text-gray-600 mb-10 leading-relaxed">
            Na <strong>Déia Art Laços</strong>, prezamos pela transparência e respeito à sua privacidade. Esta política descreve como tratamos dados através de cookies, as finalidades e como você pode exercer seus direitos.
          </p>

          <div className="space-y-12">
            {/* 1. Identificação Jurídica */}
            <section className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-gray-800">
                <UserCheck className="w-5 h-5" />
                <h2 className="text-xl font-bold">1. Identificação do Controlador</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Razão Social:</strong> Déia Art Laços</p>
                  <p><strong>CNPJ:</strong> [00.000.000/0000-00]</p>
                </div>
                <div>
                  <p><strong>Sede:</strong> Cariacica / ES</p>
                  <p><strong>Responsável (DPO):</strong> Andréa O. S. Franco</p>
                </div>
              </div>
            </section>

            {/* 2. Bases Legais */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Scale className="w-5 h-5" />
                <h2 className="text-xl font-bold">2. Bases Legais para o Tratamento</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                De acordo com a LGPD, o tratamento de seus dados através de cookies é fundamentado nas seguintes bases legais:
              </p>
              <div className="grid gap-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-pink-50/30 border border-pink-100">
                  <div className="font-bold text-pink-500">A.</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Execução de Contrato (Art. 7º, V):</p>
                    <p className="text-xs text-gray-600">Para cookies necessários que permitem o funcionamento do carrinho, login e finalização de pedidos.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-pink-50/30 border border-pink-100">
                  <div className="font-bold text-pink-500">B.</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Consentimento (Art. 7º, I):</p>
                    <p className="text-xs text-gray-600">Para cookies de marketing e personalização, coletado de forma clara e revogável a qualquer momento.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-pink-50/30 border border-pink-100">
                  <div className="font-bold text-pink-500">C.</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Legítimo Interesse (Art. 7º, IX):</p>
                    <p className="text-xs text-gray-600">Para cookies técnicos que garantem a segurança do site e a proteção contra fraudes.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Categorias e Retenção */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl font-bold">3. Categorias e Retenção</h2>
              </div>

              <div className="grid gap-6">
                <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">Cookies Essenciais</h3>
                  <p className="text-sm text-gray-600 mb-4">Garantem a navegação e segurança.</p>
                  <div className="flex flex-wrap gap-4 text-[11px] font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: Sessão / 12 meses</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Supabase</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">Cookies de Marketing</h3>
                  <p className="text-sm text-gray-600 mb-4">Exibição de anúncios relevantes e ofertas personalizadas.</p>
                  <div className="flex flex-wrap gap-4 text-[11px] font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: 6 a 12 meses</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Facebook Pixel</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Direitos do Titular dos Dados */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <Info className="w-5 h-5" />
                <h2 className="text-xl font-bold">4. Seus Direitos como Titular</h2>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                A LGPD garante a você total controle sobre suas informações. Na Déia Art Laços, você pode exercer os seguintes direitos:
              </p>
              
              <div className="grid gap-4">
                {[
                  {
                    title: 'Confirmação e Acesso',
                    desc: 'Você pode confirmar se tratamos seus dados e solicitar uma cópia de todas as informações que temos sobre você.'
                  },
                  {
                    title: 'Correção',
                    desc: 'Solicite a alteração de dados que estejam incompletos, inexatos ou desatualizados em nosso sistema.'
                  },
                  {
                    title: 'Anonimização ou Bloqueio',
                    desc: 'Caso identifique dados desnecessários ou tratados em desconformidade, pode solicitar que sejam anonimizados ou bloqueados.'
                  },
                  {
                    title: 'Exclusão',
                    desc: 'Você tem o direito de solicitar a exclusão de dados pessoais tratados com base no seu consentimento.'
                  },
                  {
                    title: 'Portabilidade',
                    desc: 'Pode solicitar a transferência dos seus dados para outro fornecedor de serviços ou produtos.'
                  },
                  {
                    title: 'Informação sobre Compartilhamento',
                    desc: 'Saiba exatamente com quais entidades públicas ou privadas compartilhamos seus dados.'
                  },
                  {
                    title: 'Revogação do Consentimento',
                    desc: 'Você pode retirar seu consentimento a qualquer momento, o que interromperá o tratamento de dados baseados nele.'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-pink-200 transition-colors">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Contato */}
            <section className="bg-pink-500 rounded-[32px] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6" />
                <h2 className="text-xl font-bold">Como exercer seus direitos?</h2>
              </div>
              <p className="text-pink-50 leading-relaxed mb-6">
                Para qualquer solicitação referente à privacidade, entre em contato diretamente com nossa Encarregada de Dados:
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block">
                <p className="font-bold">E-mail: andreafranco.com@gmail.com</p>
                <p className="text-sm text-pink-100">Assunto: Solicitação LGPD</p>
              </div>
            </section>

            <footer className="pt-8 text-center text-xs text-gray-400">
              <p>Última atualização: 16 de Maio de 2024</p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
