import React, { useState } from "react";
import clsx from "clsx";
import { Maximize2, Minimize2 } from "lucide-react";

export type FormWidth = "sm" | "md" | "lg" | "full";

interface FormTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  width?: FormWidth;
  className?: string;

  /** Enable fullscreen toggle */
  fullscreenEnabled?: boolean;
}

export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  description,
  children,
  footer,
  headerActions,
  onSubmit,
  width = "md",
  className,
  fullscreenEnabled = true,
}) => {
  const Wrapper: React.ElementType = onSubmit ? "form" : "section";
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Wrapper
      className={clsx(
        "form-template",
        `form-template--${width}`,
        {
          "form-template--fullscreen": isFullscreen,
        },
        className
      )}
      onSubmit={onSubmit}
    >
      {/* Header */}
      <header className="form-template__header">
        <div className="form-template__header-left">
          <h1 className="form-template__title">{title}</h1>
          {description && (
            <p className="form-template__description">{description}</p>
          )}
        </div>

        <div className="form-template__header-right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {headerActions}
          {/* Fullscreen toggle */}
          {fullscreenEnabled && (
            <button
              type="button"
              className="form-template__fullscreen-btn"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="form-template__body">{children}</div>

      {/* Footer */}
      {footer && (
        <footer className="form-template__footer">{footer}</footer>
      )}
    </Wrapper>
  );
};
