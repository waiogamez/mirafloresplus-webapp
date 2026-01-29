import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/1cc1d9002fe4f269e47f84471215202a7d9070a9.png';

export function Logo({ className }: { className?: string }) {
  return (
    <ImageWithFallback 
      src={logoImage} 
      alt="Miraflores Plus - Tu salud, a un clic de distancia" 
      className={className || "w-full h-auto"}
    />
  );
}
