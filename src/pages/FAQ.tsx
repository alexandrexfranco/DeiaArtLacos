import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Quais são as formas de pagamento?",
        answer: "Aceitamos pagamentos via PIX, cartão de crédito em até 3x sem juros e boleto bancário."
    },
    {
        question: "Qual o prazo de entrega?",
        answer: "O prazo de entrega varia de acordo com a sua região e a modalidade de envio escolhida (Sedex ou PAC). O frete é por conta do cliente! O prazo de produção é de 3 a 5 dias úteis, pois todas as peças são feitas à mão."
    },
    {
        question: "Os laços machucam a cabeça?",
        answer: "Não! Nossos laços são feitos pensando no conforto da sua princesa. As faixinhas são de meia de seda super macia e os bicos de pato são forrados ou encapados para não machucar."
    },
    {
        question: "Vocês fazem encomendas personalizadas?",
        answer: "Sim! Entre em contato conosco pelo WhatsApp para solicitar um modelo personalizado ou cores diferentes das disponíveis no site."
    },
    {
        question: "Como posso rastrear meu pedido?",
        answer: "Assim que seu pedido for postado, você receberá um código de rastreio por e-mail para acompanhar a entrega no site dos Correios. Lembrando que o frete é por conta do cliente!"
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="pt-24 pb-12 container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                    <HelpCircle size={32} />
                </div>
                <h1 className="text-3xl md:text-5xl font-handwritten font-bold text-gray-800 mb-4">
                    Dúvidas Frequentes
                </h1>
                <p className="text-gray-600">
                    Aqui você encontra as respostas para as perguntas mais comuns.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-pink-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                        >
                            <span className="font-bold text-gray-800">{faq.question}</span>
                            {openIndex === index ? (
                                <Minus className="text-pink-500 flex-shrink-0" />
                            ) : (
                                <Plus className="text-gray-400 flex-shrink-0" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
