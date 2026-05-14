import React, { useState, useRef, useEffect } from "react";

interface MultiImageUploadProps {
  label?: string;
  values?: File[];
  onChange?: (files: File[]) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  accept?: string;
  className?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  multiple?: boolean;
  size?: "sm" | "md" | "full";
  width?: "sm" | "md" | "lg" | "full" | number | string;
  error?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label,
  values = [],
  onChange,
  required = false,
  disabled = false,
  placeholder = "Upload file(s)",
  accept = "image/*,application/pdf",
  className = "",
  maxSizeMB = 5,
  maxFiles = 5,
  multiple = true,
  size = "md",
  width = "full",
  error: externalError,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------- PREVIEWS -------------------- */
  useEffect(() => {
    const urls = values.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach(URL.revokeObjectURL);
  }, [values]);

  /* -------------------- FILE TYPE VALIDATION -------------------- */
  const isValidFileType = (file: File) => {
    const acceptTypes = accept.split(",").map(t => t.trim());

    return acceptTypes.some(type => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", "/"));
      }
      if (type.includes("/")) {
        return file.type === type;
      }
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return false;
    });
  };

  /* -------------------- CLICK -------------------- */
  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  /* -------------------- FILE CHANGE -------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!isValidFileType(file)) {
        setInternalError("Only images or PDF files are allowed");
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setInternalError(`Each file must be under ${maxSizeMB}MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const finalFiles = multiple
      ? [...values, ...validFiles].slice(0, maxFiles)
      : validFiles.slice(0, 1);

    setInternalError(null);
    onChange?.(finalFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* -------------------- REMOVE -------------------- */
  const handleRemove = (index: number) => {
    onChange?.(values.filter((_, i) => i !== index));
  };

  /* -------------------- WIDTH -------------------- */
  const resolveWidth = () => {
    if (typeof width === "number") return `${width}px`;
    if (typeof width === "string") {
      if (["sm", "md", "lg"].includes(width))
        return { sm: "320px", md: "480px", lg: "640px" }[width];
      if (width === "full") return "100%";
      return width;
    }
    return "100%";
  };

  const errorToShow = externalError || internalError;

  /* -------------------- JSX -------------------- */
  return (
    <div
      className={`multi-image-upload size-${size} ${
        disabled ? "is-disabled" : ""
      } ${errorToShow ? "has-error" : ""} ${className}`}
      style={{ width: resolveWidth() }}
    >
      {label && (
        <label className="multi-image-upload__label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className="multi-image-upload__container" onClick={handleClick}>
        {values.length === 0 && (
          <div className="multi-image-upload__placeholder">
            {placeholder}
          </div>
        )}

        {values.map((file, index) => (
          <div key={index} className="multi-image-upload__thumb">
            {file.type === "application/pdf" ? (
              <div className="multi-image-upload__pdf">
                📄
                <span>{file.name}</span>
              </div>
            ) : (
              <img src={previews[index]} alt={file.name} />
            )}

            {!disabled && (
              <button
                type="button"
                className="multi-image-upload__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {errorToShow && (
        <span className="multi-image-upload__error">{errorToShow}</span>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};
