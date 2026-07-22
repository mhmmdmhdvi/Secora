from django.test import SimpleTestCase
from django.urls import resolve
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ChangePasswordView, DeleteAccountView, RegisterView


class AccountUrlTests(SimpleTestCase):
    def test_versioned_account_urls_resolve(self):
        self.assertIs(
            resolve("/api/v1/accounts/register/").func.view_class,
            RegisterView,
        )
        self.assertIs(
            resolve("/api/v1/accounts/change-password/").func.view_class,
            ChangePasswordView,
        )
        self.assertIs(
            resolve("/api/v1/accounts/delete-account/").func.view_class,
            DeleteAccountView,
        )

    def test_legacy_account_urls_remain_available(self):
        self.assertIs(
            resolve("/api/accounts/register/").func.view_class,
            RegisterView,
        )

    def test_versioned_and_legacy_token_urls_resolve(self):
        self.assertIs(
            resolve("/api/v1/token/").func.view_class,
            TokenObtainPairView,
        )
        self.assertIs(
            resolve("/api/v1/token/refresh/").func.view_class,
            TokenRefreshView,
        )
        self.assertIs(
            resolve("/api/token/").func.view_class,
            TokenObtainPairView,
        )
