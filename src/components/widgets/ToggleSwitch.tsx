// src/components/widgets/ToggleSwitch.tsx
import React from "react";
import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  id?: string;
  label?: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "blue" | "green" | "purple"; // customize accent color
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id = "toggle",
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = "",
  size = "md",
  color = "indigo",
}) => {
  return (
    <div
      className={`
        toggle-switch-wrapper
        toggle-switch--${size}
        ${disabled ? "disabled" : ""}
        ${className}
      `}
    >
      <label
        htmlFor={id}
        className="toggle-switch-label"
        onClick={!disabled ? onChange : undefined}
      >
        <div className="toggle-switch-control">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="toggle-switch-input"
          />
          <span
            className={`
              toggle-switch-slider
              toggle-switch-slider--${color}
              ${checked ? "checked" : ""}
            `}
          />
        </div>

        {(label || description) && (
          <div className="toggle-switch-text">
            {label && <div className="toggle-switch-title">{label}</div>}
            {description && (
              <div className="toggle-switch-description">{description}</div>
            )}
          </div>
        )}
      </label>
    </div>
  );
};