import React, { useState } from "react";
import { Eye, X } from "lucide-react";


interface EyeViewModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

const EyeViewModal: React.FC<EyeViewModalProps> = ({
  open,
  onClose,
  url,
  title = "Document Preview",
}) => {
  const [loading, setLoading] = useState(true);

  if (!open) return null;

  const isPdf = url.toLowerCase().endsWith(".pdf");

  return (
    <div className="eyeview__overlay" onClick={onClose}>
      <div
        className="eyeview__modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="eyeview__header">
          <h3>{title}</h3>
          <button
            className="eyeview__close"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="eyeview__content">
          {/* ✅ Loader */}
          {loading && (
            <div className="eyeview__loader">
              Loading preview…
            </div>
          )}

          {isPdf ? (
            <iframe
              src={url}
              title="PDF Preview"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <img
              src={url}
              alt="Document Preview"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="eyeview__footer">
          <button
            className="eyeview__footer-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
interface EyeViewProps {
  url?: string;
  label?: string;
  title?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EyeView: React.FC<EyeViewProps> = ({
  url,
  label = "View",
  title,
  disabled = false,
  size = "md",
}) => {
  const [open, setOpen] = useState(false);

  if (!url) {
    return <span className="eyeview__empty">Not uploaded</span>;
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`eyeview__button eyeview__button--${size}`}
        onClick={() => setOpen(true)}
      >
        <Eye size={size === "sm" ? 14 : 16} />
        {label}
      </button>

      <EyeViewModal
        open={open}
        onClose={() => setOpen(false)}
        url={url}
        title={title}
      />
    </>
  );
};
