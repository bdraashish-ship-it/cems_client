import React, { useEffect, useState } from "react";
import "./ConfirmDialog.css";
import { Button } from "../widgets/Button";
import { CheckCircle, XCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Yes, Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset state whenever modal closes
  useEffect(() => {
    if (!open) {
      setApiMessage(null);
      setSuccess(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setApiMessage(null);
    setSuccess(null);

    try {
      const res = await onConfirm();
      setSuccess(res.success);
      setApiMessage(res.message);
    } catch (err: any) {
      setSuccess(false);
      setApiMessage(
        err?.message || "Something went wrong while processing request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div
        className={`confirm-content ${
          success === true ? "success-modal" : ""
        } ${success === false ? "error-modal" : ""}`}
      >
        {/* Icon centered */}
        <div className="confirm-icon-wrapper">
          {success === true && <CheckCircle className="confirm-icon success-icon" />}
          {success === false && <XCircle className="confirm-icon error-icon" />}
        </div>

        {/* Title: show only before clicking "Yes" */}
        {!loading && success === null && (
          <div className="confirm-title">{title}</div>
        )}

        {/* Description / API message */}
        {(apiMessage || (!loading && success === null && description)) && (
          <div className="confirm-description">
            {apiMessage || description}
          </div>
        )}

        {/* Buttons */}
        {success === null && (
          <div className="confirm-buttons">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={loading}>
              {loading ? "Processing..." : confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
