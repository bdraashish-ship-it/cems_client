import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { ChevronDown, Check, X } from "lucide-react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface MultiSelectFieldProps {
  label?: string;
  values?: (string | number)[];
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (values: (string | number)[]) => void;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  values = [],
  options,
  placeholder = "Select options",
  required,
  disabled,
  error,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleOption = (optValue: string | number) => {
    const newValues = values.includes(optValue)
      ? values.filter((v) => v !== optValue)
      : [...values, optValue];
    onChange?.(newValues);
  };

  const removeValue = (e: React.MouseEvent, optValue: string | number) => {
    e.stopPropagation();
    onChange?.(values.filter((v) => v !== optValue));
  };

  const selectedOptions = options.filter((o) => values.includes(o.value));

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
      <div
        className="select__trigger"
        style={{ minHeight: "42px", height: "auto", padding: "4px 12px", display: "flex", flexWrap: "wrap", gap: "4px" }}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((opt) => (
            <span 
              key={opt.value} 
              style={{ 
                background: "#f1f5f9", 
                color: "#475569", 
                fontSize: "0.75rem", 
                fontWeight: 600, 
                padding: "2px 8px", 
                borderRadius: "6px", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                border: "1px solid #e2e8f0"
              }}
            >
              {opt.label}
              {!disabled && (
                <X 
                  size={12} 
                  style={{ cursor: "pointer" }} 
                  onClick={(e) => removeValue(e, opt.value)} 
                />
              )}
            </span>
          ))
        ) : (
          <span className="placeholder" style={{ padding: "6px 0" }}>{placeholder}</span>
        )}
        <ChevronDown size={16} style={{ marginLeft: "auto", alignSelf: "center", color: "#94a3b8" }} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="select__menu" style={{ maxHeight: "250px", overflowY: "auto", zIndex: 100 }}>
          {options.length === 0 ? (
            <div style={{ padding: "12px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  "select__option",
                  values.includes(opt.value) && "is-selected"
                )}
                onClick={() => toggleOption(opt.value)}
              >
                <span>{opt.label}</span>
                {values.includes(opt.value) && <Check size={16} />}
              </button>
            ))
          )}
        </div>
      )}

      {error && <span className="select__error">{error}</span>}
    </div>
  );
};
