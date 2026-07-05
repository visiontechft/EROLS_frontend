import React from 'react';
import { MapPin, MessageCircle, X, Clock } from 'lucide-react';
import type { City } from '../types';

interface QuartierSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  quartiers: City[];
  onSelect: (city: City) => void | Promise<void>;
  submittingId?: number | null;
  title?: string;
  subtitle?: string;
  footerNote?: React.ReactNode;
}

export function QuartierSelectModal({
  isOpen,
  onClose,
  quartiers,
  onSelect,
  submittingId = null,
  title = 'Votre quartier ?',
  subtitle = 'Sélectionnez votre quartier à Bafoussam pour finaliser votre commande sur WhatsApp.',
  footerNote,
}: QuartierSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 sm:p-8 relative animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-300 shadow-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col">
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        <button
          onClick={onClose}
          className="absolute right-4 sm:right-6 top-4 sm:top-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
            <MapPin className="text-orange-600" size={32} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-2 text-center sm:text-left">{title}</h3>
          <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">{subtitle}</p>
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <div className="space-y-3 pb-4">
            {quartiers.map((city) => (
              <button
                key={city.id}
                onClick={() => onSelect(city)}
                disabled={submittingId === city.id}
                className="w-full p-4 sm:p-5 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 active:scale-98 flex justify-between items-center transition-all group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <MapPin className="text-orange-600" size={20} />
                  </div>
                  <span className="font-bold text-gray-800 text-base sm:text-lg">{city.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {submittingId === city.id ? (
                    <span className="text-xs font-bold text-orange-600">Redirection...</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline text-xs font-bold text-gray-400 group-hover:text-green-600 transition-colors">
                        Livraison express
                      </span>
                      <MessageCircle className="text-gray-300 group-hover:text-green-600 transition-colors" size={20} />
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {footerNote && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock size={16} className="text-orange-500" />
              <span className="font-bold">{footerNote}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
