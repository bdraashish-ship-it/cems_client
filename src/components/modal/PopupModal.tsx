import React, { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface PopupModalProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  open,
  title,
  children,
  footer,
  onClose,
  size = "md",
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="popup-modal__backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={clsx("popup-modal", `popup-modal--${size}`)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button – ALWAYS top right */}
        <button
          className="popup-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        {title && (
          <header className="popup-modal__header">
            <h3 className="popup-modal__title">{title}</h3>
          </header>
        )}

        {/* Body */}
        <div className="popup-modal__body">{children}</div>

        {/* Footer */}
        {footer && <footer className="popup-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
};
