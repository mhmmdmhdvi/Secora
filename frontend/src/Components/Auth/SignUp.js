import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiV1Url, getApiErrorMessage, requestJson } from "../../services/apiClient";
import { Button, Card, Field } from "../UI";
import { useTranslation } from "react-i18next";

function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestControllerRef = useRef(null);

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);

    return () => requestControllerRef.current?.abort();
  }, []);

  const refreshCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning(t("auth.passwordsDoNotMatch"));
      return;
    }

    if (parseInt(captchaAnswer) !== num1 + num2) {
      toast.warning(t("auth.captchaIncorrect"));
      refreshCaptcha();
      return;
    }

    if (isSubmitting) {
      return;
    }

    requestControllerRef.current?.abort();
    requestControllerRef.current = new AbortController();
    setIsSubmitting(true);

    try {
      await requestJson(apiV1Url("/accounts/register/"), {
        method: "POST",
        signal: requestControllerRef.current.signal,
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      toast.success(t("auth.accountCreated"));
      navigate("/login");
    } catch (error) {
      const message = getApiErrorMessage(error, t("auth.registrationFailed"));

      if (message) {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-start justify-center px-4 pt-24 sm:pt-28">
      <Card className="w-full max-w-md border-2 border-border p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6">Secora</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label={t("auth.username")}
            id="signup-username"
            type="text"
            placeholder={t("auth.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Field
            label={t("auth.email")}
            id="signup-email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Field
            label={t("auth.password")}
            id="signup-password"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Field
            label={t("auth.confirmPassword")}
            id="signup-confirm-password"
            type="password"
            placeholder={t("auth.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Field
            label={`${num1} + ${num2} =`}
            id="signup-captcha"
            type="text"
            placeholder={t("auth.captchaAnswer")}
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.creatingAccount") : t("auth.signUp")}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base text-text-muted">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-hover">
            {t("auth.loginHere")}
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default SignUp;
