// ui/button.tsx (or similar file)
import { Button } from "./ui/button";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode; // Add this line
  iconPosition?: "left" | "right"; // Add this line
  // Add other props as needed
}

export const AuthButton: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  className,
  style,
  disabled,
  children,
  icon,
  iconPosition = "left",
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={className}
      style={style}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="icon">{icon}</span>}
    </Button>
  );
};
