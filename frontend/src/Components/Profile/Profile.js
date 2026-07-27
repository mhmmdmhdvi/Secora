import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../Auth/authFetch";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { getResponseErrorMessage } from "../../services/apiClient";
import { Button, Card, Field, LanguageToggle, ThemeToggle } from "../UI";
import { useTranslation } from "react-i18next";
import ProfileAchievementsCard from "./ProfileAchievementsCard";
import ProfileLevelCard from "./ProfileLevelCard";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const passwordControllerRef = useRef(null);
  const deleteControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      passwordControllerRef.current?.abort();
      deleteControllerRef.current?.abort();
    };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.warning(t("auth.passwordsDoNotMatch"));
      return;
    }

    if (isChangingPassword) {
      return;
    }

    passwordControllerRef.current?.abort();
    passwordControllerRef.current = new AbortController();
    setIsChangingPassword(true);

    try {
      const response = await authFetch("/accounts/change-password/", {
        method: "POST",
        signal: passwordControllerRef.current.signal,
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        toast.success(t("profile.passwordUpdated"));
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const message = await getResponseErrorMessage(
          response,
          t("profile.passwordUpdateFailed")
        );
        toast.error(message);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error(t("profile.passwordUpdateFailed"));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("profile.deleteConfirm"))) return;

    if (isDeletingAccount) {
      return;
    }

    deleteControllerRef.current?.abort();
    deleteControllerRef.current = new AbortController();
    setIsDeletingAccount(true);

    try {
      const response = await authFetch("/accounts/delete-account/", {
        method: "DELETE",
        signal: deleteControllerRef.current.signal,
      });

      if (response.ok) {
        logout();
        navigate("/");
      } else {
        const message = await getResponseErrorMessage(
          response,
          t("profile.deleteFailed")
        );
        toast.error(message);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error(t("profile.deleteFailed"));
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto md:ms-0 md:me-auto py-4 sm:py-6">
      <ProfileLevelCard />
      <ProfileAchievementsCard />

      <Card className="p-5 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold text-text">{t("profile.appearance")}</h2>
        <p className="text-text-muted mt-1 mb-4">
          {t("profile.appearanceDescription")}
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-text">{t("profile.theme")}</p>
            <ThemeToggle />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-text">{t("profile.language")}</p>
            <LanguageToggle />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold text-text">{t("profile.password")}</h2>
        <p className="text-text-muted mt-1 mb-4">
          {t("profile.passwordDescription")}
        </p>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <Field
            label={t("profile.newPassword")}
            id="profile-new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Field
            label={t("profile.confirmPassword")}
            id="profile-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full sm:w-32"
            variant="secondary"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? t("profile.saving") : t("profile.save")}
          </Button>
        </form>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-text">{t("profile.deleteAccount")}</h2>
        <p className="text-text-muted mt-1 mb-4 max-w-xl leading-7">
          {t("profile.deleteDescription")}
        </p>

        <Button
          onClick={handleDeleteAccount}
          className="w-full sm:w-40"
          variant="danger"
          disabled={isDeletingAccount}
        >
          {isDeletingAccount ? t("profile.deleting") : t("profile.deleteAccount")}
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
