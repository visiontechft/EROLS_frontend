import wordmark from '../assets/images/logo-bg-white.png';
import icon from '../assets/images/erols.png';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return <img src={icon} alt="EROLS" className={className} />;
  }
  return <img src={wordmark} alt="EROLS" className={className} />;
}
