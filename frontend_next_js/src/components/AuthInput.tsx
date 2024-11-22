import { Input } from "./ui/input"; // Custom Input component
import { Label } from "./ui/label"; // Custom Label component

type AuthInputProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const AuthInput = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
}: AuthInputProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
};

export default AuthInput;
