import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const EXAMPLES = [
  'Réfrigérateur Oscar...',
  'Machine à laver Hisense...',
  'Pistolet de massage...',
  'Écran plasma...',
  'Lampe UV séchage ongles...',
];

export function SearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIndex((i) => (i + 1) % EXAMPLES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/produits?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative mt-8 lg:-mt-10 z-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full bg-white p-2 shadow-2xl shadow-gray-900/10 border border-gray-100"
        >
          <div className="flex items-center gap-3 flex-1 px-4">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={EXAMPLES[placeholderIndex]}
              className="w-full py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Rechercher</span>
          </button>
        </form>
      </motion.div>
    </section>
  );
}
