import React, { useState } from "react";
import { authFetch } from "../Auth/authFetch";
import { toast } from "react-toastify";

function Profile() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      const response = await authFetch("/api/accounts/change-password/", {
        method: "POST",
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        toast.success("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const response = await authFetch("/api/accounts/delete-account/", {
        method: "DELETE",
      });

      if (response.ok) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/";
      } else {
        toast.error("Error deleting account");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto md:ml-0 md:mr-auto py-4 sm:py-6">
      <div className="bg-white border border-gray-300 rounded-lg p-5 sm:p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Password</h2>
        <p className="text-gray-600 mt-1 mb-4">
          Set or update your account password.
        </p>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">New password</label>
            <input
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">
              Confirm password
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-32 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-black transition"
          >
            Save
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Delete account</h2>
        <p className="text-gray-600 mt-1 mb-4 max-w-xl leading-7">
          No longer want to use our service? You can delete your account here.
          This action is not reversible. All information related to this account
          will be deleted permanently.
        </p>

        <button
          onClick={handleDeleteAccount}
          className="w-full sm:w-40 px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete account
        </button>
      </div>
    </div>
  );
}

export default Profile;
