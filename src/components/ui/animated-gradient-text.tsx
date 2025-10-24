import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string;
}

export const AnimatedGradientText = ({ 
  children, 
  className,
  colors = "from-blue-500 via-purple-500 to-pink-500"
}: AnimatedGradientTextProps) => {
  return (
    <span 
      className={cn(
        "inline-block bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x",
        colors,
        className
      )}
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
};
