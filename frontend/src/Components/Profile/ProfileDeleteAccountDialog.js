import React from "react";
import { Button } from "../UI";

function ProfileDeleteAccountDialog({
  isDeleting = false,
  onCancel,
  onConfirm,
  t,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-dialog-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/25">
        <div className="border-b border-border bg-danger/10 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-danger">
            {t("profile.dangerZone")}
          </p>
          <h2
            id="delete-account-dialog-title"
            className="mt-2 text-2xl font-bold text-text"
          >
            {t("profile.deleteDialogTitle")}
          </h2>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="leading-7 text-text-muted">
            {t("profile.deleteDialogDescription")}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-auto"
              disabled={isDeleting}
              onClick={onCancel}
              variant="secondary"
            >
              {t("profile.cancelDelete")}
            </Button>

            <Button
              className="w-full whitespace-nowrap sm:w-auto"
              disabled={isDeleting}
              onClick={onConfirm}
              variant="danger"
            >
              {isDeleting
                ? t("profile.deleting")
                : t("profile.confirmDeleteAccount")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDeleteAccountDialog;
