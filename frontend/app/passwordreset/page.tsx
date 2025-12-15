'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../api/axiosInstance";
import { ThemeToggle } from "../theme-toggle";
import Link  from 'next/link'

export default function PasswordReset() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [step, setStep] = useState("request");
    const [resetForm, setResetForm] = useState({
        resetToken: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const handleResetFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetForm({ ...resetForm, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:5001/auth/forgotPassword", { email });
            setSuccess(`Password reset instructions have been sent. Reset token: ${res.data.resetToken}`);
            setStep("reset");
        } catch (err: any) {
            console.error(err.response?.data);
            const errorMessage = err.response?.data?.error || "Failed to send reset email. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (resetForm.newPassword !== resetForm.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (resetForm.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:5001/auth/resetPassword", {
                resetToken: resetForm.resetToken,
                newPassword: resetForm.newPassword
            });
            setSuccess("Password reset successfully! You can now login with your new password.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            console.error(err.response?.data);
            const errorMessage = err.response?.data?.error || "Failed to reset password. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex flex-col">
            {/* NAVBAR */}
            <header className="flex items-center justify-between px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-sm">
                <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
                <nav className="flex items-center space-x-3">
                    <Link href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
                        Home
                    </Link>
                    <Link href="/login" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
                        Login
                    </Link>
                    <ThemeToggle />
                </nav>
            </header>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-2xl p-8 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-amber-950 dark:text-amber-50">
                            {step === "request" ? "Reset your password" : "Enter new password"}
                        </h1>
                        {step === "request" && (
                            <p className="text-amber-800 dark:text-amber-200 text-sm">
                                Enter your email address and we wil send you instructions to reset your password.
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-700 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-600 dark:text-green-400 text-sm bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            {success}
                        </div>
                    )}

                    {step === "request" ? (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-amber-900 dark:text-amber-200 text-sm font-medium block">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    autoFocus
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="E
                                    nter your email"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-900 dark:hover:bg-amber-100 transition disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Reset Instructions"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="resetToken" className="text-amber-900 dark:text-amber-200 text-sm font-medium block">
                                    Reset Token
                                </label>
                                <input
                                    type="text"
                                    name="resetToken"
                                    id="resetToken"
                                    required
                                    autoFocus
                                    value={resetForm.resetToken}
                                    onChange={handleResetFormChange}
                                    placeholder="Enter the token from your email"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-amber-900 dark:text-amber-200 text-sm font-medium block">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    required
                                    value={resetForm.newPassword}
                                    onChange={handleResetFormChange}
                                    placeholder="Enter new password"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-amber-900 dark:text-amber-200 text-sm font-medium block">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    required
                                    value={resetForm.confirmPassword}
                                    onChange={handleResetFormChange}
                                    placeholder="Confirm new password"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-900 dark:hover:bg-amber-100 transition disabled:opacity-50"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="text-center space-x-3">
                        <a href="/login" className="text-amber-950 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100 font-medium">
                            Back to Login
                        </a>
                        {step === "reset" && (
                            <>
                                <span className="text-amber-900 dark:text-amber-200">|</span>
                                <button
                                    onClick={() => {
                                        setStep("request");
                                        setError("");
                                        setSuccess("");
                                        setResetForm({ resetToken: "", newPassword: "", confirmPassword: "" });
                                    }}
                                    className="text-amber-950 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100 font-medium bg-transparent border-none cursor-pointer"
                                >
                                    Request New Token
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}