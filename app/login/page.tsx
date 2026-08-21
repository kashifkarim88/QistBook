"use client";

import { useState, useActionState } from "react";
import { loginAction, resetPasswordAction } from "@/app/actions/auth";
import { KeyRound, Lock, User, ShieldAlert, CheckCircle2, X } from "lucide-react";

export default function LoginPage() {
    const [loginState, handleLogin, isLoggingIn] = useActionState(loginAction, null);
    const [resetState, handleReset, isResetting] = useActionState(resetPasswordAction, null);
    const [showForgotModal, setShowForgotModal] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600/20 text-blue-500 mb-3 border border-blue-500/30">
                        <Lock className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">QistBook Portal</h1>
                    <p className="text-sm text-slate-400 mt-1">Installment Management System</p>
                </div>

                {/* LOGIN FORM */}
                <form action={handleLogin} className="space-y-5">
                    {loginState?.error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            <span>{loginState.error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="username"
                                required
                                placeholder="Enter username"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {isLoggingIn ? "Authenticating..." : "Sign In"}
                    </button>
                </form>
            </div>

            {/* SECRET KEY RECOVERY MODAL */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 relative shadow-2xl">
                        <button
                            onClick={() => setShowForgotModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
                        <p className="text-xs text-slate-400 mb-6">
                            Enter your Admin Username and Secret Recovery Key to update your password.
                        </p>

                        <form action={handleReset} className="space-y-4">
                            {resetState?.error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <span>{resetState.error}</span>
                                </div>
                            )}

                            {resetState?.success && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{resetState.success}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    placeholder="admin"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Secret Recovery Key</label>
                                <input
                                    type="password"
                                    name="recoveryKey"
                                    required
                                    placeholder="SEC-XXXX-KEY"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isResetting}
                                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                            >
                                {isResetting ? "Resetting..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}