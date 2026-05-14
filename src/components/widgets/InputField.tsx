import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label?: string;
  name?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "date" | "textarea";
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
  rows = 3,
  required = false,
  className = "",
}) => {
  /* ---------------- PASSWORD TOGGLE ---------------- */
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isTextarea = type === "textarea";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`input-field ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label className="input-field__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`input-field__wrapper ${isTextarea ? "is-textarea" : ""}`}>
        {/* LEFT ICON */}
        {Icon && <Icon size={16} className="input-field__icon" style={isTextarea ? { top: '12px', transform: 'none' } : {}} />}

        {/* INPUT OR TEXTAREA */}
        {isTextarea ? (
          <textarea
            className="input-field__control textarea-control"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            disabled={disabled}
            rows={rows}
          />
        ) : (
          <input
            className="input-field__control"
            type={inputType}
            name={name}
            autoComplete="none"
            placeholder={placeholder}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            disabled={disabled}
          />
        )}

        {/* PASSWORD TOGGLE ICON */}
        {isPassword && (
          <button
            type="button"
            className="input-field__toggle"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      

      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
};
