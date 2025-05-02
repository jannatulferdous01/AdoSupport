import { HeartHandshake } from "lucide-react";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-sm",
    },
    md: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    lg: {
      container: "w-10 h-10",
      icon: "h-6 w-6",
      text: "text-2xl",
    },
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`${sizeClasses[size].container} bg-primary rounded-md flex items-center justify-center shadow-sm`}
      >
        <HeartHandshake
          className={`${sizeClasses[size].icon} text-primary-foreground`}
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <h1
          className={`${sizeClasses[size].text} font-bold text-gray-800 tracking-tight`}
        >
          AdoSupport
        </h1>
      )}
    </div>
  );
};

export default Logo;
