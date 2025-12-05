import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '+2250700000000'; // Replace with actual WhatsApp number

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const predefinedMessages = [
    'Bonjour, j\'ai une question sur un produit',
    'Je souhaite passer une commande',
    'J\'ai besoin d\'aide pour ma commande',
    'Je veux faire une demande spéciale',
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || message;
    if (!messageText.trim()) return;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Service Client EROLS</h3>
                <p className="text-xs text-green-100">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-600 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Welcome Message */}
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                Bonjour! Comment pouvons-nous vous aider aujourd'hui?
              </p>
            </div>

            {/* Predefined Messages */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                Messages rapides:
              </p>
              {predefinedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(msg)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                Ou écrivez votre message:
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                rows={3}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!message.trim()}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer sur WhatsApp
              </button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 text-center">
              Nous répondons généralement en quelques minutes
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Contacter sur WhatsApp"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {/* Pulse animation */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          </>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-6 right-20 sm:right-24 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Besoin d'aide? Chattez avec nous!
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
            <div className="w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      )}
    </>
  );
}
