import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { apiV1Url, getApiErrorMessage, requestJson } from "../../services/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { Button, Card, Field } from "../UI";
import { useTranslation } from "react-i18next";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();
  const redirectTo = location.state?.from?.pathname || "/lessons";
  const requestControllerRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => requestControllerRef.current?.abort();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    requestControllerRef.current?.abort();
    requestControllerRef.current = new AbortController();
    setIsSubmitting(true);

    try {
      const data = await requestJson(apiV1Url("/token/"), {
        method: "POST",
        signal: requestControllerRef.current.signal,
        body: JSON.stringify({
          username,
          password,
        }),
      });

      login({ access: data.access, refresh: data.refresh });

      toast.success(t("auth.loggedIn"));
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error?.status === 401
          ? t("auth.invalidCredentials")
          : getApiErrorMessage(error, t("auth.serverError"));

      if (message) {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-start justify-center px-4 pt-24 sm:pt-28">
      <Card className="w-full max-w-md border-2 border-border p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Secora</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label={t("auth.username")}
            id="login-username"
            type="text"
            placeholder={t("auth.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Field
            label={t("auth.password")}
            id="login-password"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base text-text-muted">
          {t("auth.newUser")}{" "}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover">
            {t("auth.registerHere")}
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
