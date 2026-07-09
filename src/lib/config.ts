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

interface OrderableProduct {
  name: string;
  price: number | string;
  slug: string;
}

// DRF serializes DecimalField as a JSON string (e.g. "3000.00"), so price
// can arrive as a string at runtime even though the TS type says number —
// coerce defensively before formatting or doing arithmetic.
const toNumber = (value: number | string) => (typeof value === 'string' ? parseFloat(value) : value);
const formatFcfa = (value: number | string) => `${toNumber(value).toLocaleString('fr-FR')} FCFA`;

/** Builds the pre-filled WhatsApp message for a single-product purchase and
 * opens WhatsApp immediately — no quartier/city step on the site anymore,
 * that's handled naturally inside the WhatsApp conversation. */
export function buildProductOrderMessage(product: OrderableProduct, quantity: number): string {
  const total = toNumber(product.price) * quantity;
  const productUrl = `${window.location.origin}/produits/${product.slug}`;
  return (
    `Bonjour ! Je suis intéressé(e) par :\n\n` +
    `*Produit :* ${product.name}\n` +
    `*Prix unitaire :* ${formatFcfa(product.price)}\n` +
    `*Quantité :* ${quantity}\n` +
    `*Total :* ${formatFcfa(total)}\n` +
    `*Lien :* ${productUrl}\n\n` +
    `Je souhaite commander ce produit.`
  );
}

/** Same idea for a full cart (multiple products). */
export function buildCartOrderMessage(
  items: { product: OrderableProduct; quantity: number }[]
): string {
  const lines = items.map(
    ({ product, quantity }) => `- ${product.name} x${quantity} = ${formatFcfa(toNumber(product.price) * quantity)}`
  );
  const total = items.reduce((sum, { product, quantity }) => sum + toNumber(product.price) * quantity, 0);
  return (
    `Bonjour ! Je souhaite commander :\n\n` +
    `${lines.join('\n')}\n\n` +
    `*Total :* ${formatFcfa(total)}\n\n` +
    `Merci de me confirmer la disponibilité et les frais de livraison.`
  );
}
