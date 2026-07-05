export const CONTACT = {
  whatsappNumber: '237659270205',
  whatsappDisplay: '+237 65 92 70 205',
  phoneNumber: '+237 65 92 70 205',
  email: 'contact@erols.com',
  supportEmail: 'services_client@erols.com',
  address: 'Bafoussam, Cameroun',
} as const;

export function buildWhatsAppUrl(number: string, message?: string): string {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
