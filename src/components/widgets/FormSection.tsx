import React from "react";
import clsx from "clsx";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;

  /** Number of columns for children layout */
  columns?: 1 | 2 | 3 | "auto";
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  columns = "auto",
}) => {
  return (
    <section className="form-section">
      {(title || description) && (
        <header className="form-section__header">
          {icon && <div className="form-section__icon">{icon}</div>}

          <div className="form-section__text">
            {title && <h3 className="form-section__title">{title}</h3>}
            {description && (
              <p className="form-section__description">{description}</p>
            )}
          </div>
        </header>
      )}

      <div
        className={clsx(
          "form-section__content",
          columns !== "auto" && `cols-${columns}`
        )}
      >
        {children}
      </div>
    </section>
  );
};
