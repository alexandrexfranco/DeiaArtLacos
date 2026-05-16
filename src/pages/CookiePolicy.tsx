import { motion } from 'framer-motion';
import { Cookie, ShieldCheck, Clock, Share2, Info } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-pink-50/30">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-pink-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <Cookie className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Política de Cookies</h1>
          </div>

          <p className="text-gray-600 mb-10 leading-relaxed">
            Esta Política de Cookies explica como a <strong>Déia Art Laços</strong> utiliza cookies e tecnologias semelhantes para reconhecê-lo quando você visita nosso site. Ela explica o que são essas tecnologias, por que as usamos e seus direitos de controlar o nosso uso delas.
          </p>

          <div className="space-y-12">
            {/* O que são cookies */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-pink-600">
                <Info className="w-5 h-5" />
                <h2 className="text-xl font-bold">O que são cookies?</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Cookies são pequenos arquivos de dados que são colocados no seu computador ou dispositivo móvel quando você visita um site. Eles são amplamente utilizados pelos proprietários de sites para fazer seus sites funcionarem, ou para funcionar de forma mais eficiente, bem como para fornecer informações de relatórios.
              </p>
            </section>

            {/* Categorias de Cookies */}
            <section>
              <div className="flex items-center gap-3 mb-6 text-pink-600">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl font-bold">Categorias de Cookies que Utilizamos</h2>
              </div>
              
              <div className="grid gap-6">
                {/* Essenciais */}
                <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100">
                  <h3 className="font-bold text-gray-800 mb-2">1. Cookies Essenciais</h3>
                  <p className="text-sm text-gray-600 mb-4">Necessários para o funcionamento do site e para fornecer os serviços que você solicita (como o carrinho de compras e login).</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: Sessão / 1 ano</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Supabase (Auth)</span>
                  </div>
                </div>

                {/* Preferências */}
                <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">2. Cookies de Preferências</h3>
                  <p className="text-sm text-gray-600 mb-4">Permitem que o site lembre de informações que mudam a forma como o site se comporta ou é exibido (como seu idioma ou região).</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: 6 meses</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Interno</span>
                  </div>
                </div>

                {/* Analytics */}
                <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">3. Cookies Analíticos</h3>
                  <p className="text-sm text-gray-600 mb-4">Ajudam-nos a entender como os visitantes interagem com o site, coletando e relatando informações de forma anônima.</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: 2 anos</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Google Analytics</span>
                  </div>
                </div>

                {/* Marketing */}
                <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">4. Cookies de Marketing</h3>
                  <p className="text-sm text-gray-600 mb-4">Usados para rastrear visitantes em sites para que os editores possam exibir anúncios relevantes e envolventes.</p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Retenção: 1 ano</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> Terceiros: Facebook Pixel</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Como controlar */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-pink-600">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl font-bold">Como você pode controlar os cookies?</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Você tem o direito de decidir se aceita ou rejeita cookies não essenciais. Você pode exercer suas preferências de cookies através do nosso banner de consentimento que aparece na sua primeira visita ou limpando os dados do seu navegador para visualizá-lo novamente.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Além disso, a maioria dos navegadores permite que você recuse ou aceite cookies através das configurações do próprio navegador.
              </p>
            </section>

            <footer className="pt-8 border-t border-gray-100 text-sm text-gray-500">
              <p>Última atualização: Maio de 2024</p>
              <p className="mt-2">Déia Art Laços - CNPJ: 00.000.000/0001-00</p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper to avoid import error if Settings icon is missing
function Settings({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
