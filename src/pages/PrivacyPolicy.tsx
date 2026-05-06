import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="pt-24 pb-12 container mx-auto px-6 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-pink-50"
            >
                <h1 className="text-3xl md:text-4xl font-handwritten font-bold text-gray-800 mb-8 border-b-2 border-pink-100 pb-4">
                    Política de Privacidade
                </h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>
                        A sua privacidade é importante para nós. É política do <strong>Déia Art Laços</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://deiaartlacos.com.br" className="text-pink-500 hover:underline">Déia Art Laços</a>, e outros sites que possuímos e operamos.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">Coleta de Informações</h2>
                    <p>
                        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">Uso de Dados</h2>
                    <p>
                        Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                    </p>
                    <p>
                        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">Compromisso do Usuário</h2>
                    <p>
                        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Déia Art Laços oferece no site e com caráter enunciativo, mas não limitativo:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                        <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                        <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Déia Art Laços, de seus fornecedores ou terceiros.</li>
                    </ul>

                    <p className="mt-8 text-sm italic">
                        Esta política é efetiva a partir de <strong>Fevereiro/2026</strong>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
