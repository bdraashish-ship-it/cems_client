import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label?: string;
  value?: string | number;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string | number) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  placeholder = "Select option",
  required,
  disabled,
  error,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        "select",
        open && "is-open",
        disabled && "is-disabled",
        error && "has-error"
      )}
    >
      {label && (
        <label className="select__label">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        className="select__trigger"
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className={clsx(!selected && "placeholder")}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="select__menu">
          {options.length === 0 ? (
            <div style={{ padding: "12px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
              No data available
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  "select__option",
                  value === opt.value && "is-selected"
                )}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check size={16} />}
              </button>
            ))
          )}
        </div>
      )}

      {error && <span className="select__error">{error}</span>}
    </div>
  );
};
