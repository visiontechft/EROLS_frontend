import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-orange-100 text-orange-800',
  secondary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-cyan-100 text-cyan-800',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-orange-500',
  secondary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-cyan-500',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
  dot = false,
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const classes = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && (
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}

// Order status badge helper
interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'En attente' },
    confirmed: { variant: 'info', label: 'Confirmée' },
    processing: { variant: 'secondary', label: 'En traitement' },
    shipped: { variant: 'primary', label: 'Expédiée' },
    delivered: { variant: 'success', label: 'Livrée' },
    cancelled: { variant: 'danger', label: 'Annulée' },
    refunded: { variant: 'default', label: 'Remboursée' },
  };

  const config = statusMap[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}

// Payment status badge helper
interface PaymentStatusBadgeProps {
  status: string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'En attente' },
    paid: { variant: 'success', label: 'Payé' },
    failed: { variant: 'danger', label: 'Échoué' },
    refunded: { variant: 'default', label: 'Remboursé' },
  };

  const config = statusMap[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Stock status badge helper
interface StockBadgeProps {
  stock: number;
  threshold?: number;
}

export function StockBadge({ stock, threshold = 5 }: StockBadgeProps) {
  if (stock === 0) {
    return <Badge variant="danger">Rupture de stock</Badge>;
  }

  if (stock <= threshold) {
    return <Badge variant="warning">Stock limité ({stock})</Badge>;
  }

  return <Badge variant="success">En stock</Badge>;
}
