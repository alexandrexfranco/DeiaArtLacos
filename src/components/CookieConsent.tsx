import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    console.log('🍪 CookieConsent: Verificando consentimento...');
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      console.log('🍪 CookieConsent: Consentimento não encontrado, exibindo banner.');
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    saveConsent(allAccepted);
  };

  const handleSaveSettings = () => {
    saveConsent(settings);
  };

  const saveConsent = (userSettings: CookieSettings) => {
    localStorage.setItem('cookie-consent', JSON.stringify(userSettings));
    setIsVisible(false);
    // Aqui você integraria com scripts de terceiros (GTM, Pixel, etc)
    console.log('Consentimento salvo:', userSettings);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[9999]"
        >
          <div className="glass-card bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-pink-100 shadow-2xl shadow-pink-200/50">
            {!showSettings ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 font-sans">Privacidade & Cookies</h3>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  Valorizamos sua privacidade! Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar ofertas especiais para você. Escolha como deseja prosseguir:
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleAcceptAll}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Aceitar Todos
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm border border-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Configurar
                    </button>
                    <button
                      onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
                      className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-500 font-medium rounded-xl text-sm border border-gray-100 transition-all"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">Preferências</h3>
                  <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Necessários */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center text-white cursor-not-allowed">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Necessários</p>
                      <p className="text-xs text-gray-500">Essenciais para o site funcionar corretamente.</p>
                    </div>
                  </div>

                  {/* Analíticos */}
                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-pink-50 cursor-pointer hover:bg-pink-50/30 transition-colors">
                    <div className="mt-0.5 relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.analytics}
                        onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                      />
                      <div className="w-5 h-5 border-2 border-pink-200 rounded peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-all"></div>
                      <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Analíticos</p>
                      <p className="text-xs text-gray-500">Nos ajudam a entender como você usa o site.</p>
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-pink-50 cursor-pointer hover:bg-pink-50/30 transition-colors">
                    <div className="mt-0.5 relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.marketing}
                        onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                      />
                      <div className="w-5 h-5 border-2 border-pink-200 rounded peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-all"></div>
                      <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Marketing</p>
                      <p className="text-xs text-gray-500">Para ofertas personalizadas e anúncios relevantes.</p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all"
                >
                  Salvar Preferências
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
