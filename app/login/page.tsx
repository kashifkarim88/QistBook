"use client";

import { useState, useActionState } from "react";
import { loginAction, resetPasswordAction } from "@/app/actions/auth";
import {
    KeyRound,
    Lock,
    User,
    ShieldAlert,
    CheckCircle2,
    X,
} from "lucide-react";

export default function LoginPage() {
    const [loginState, handleLogin, isLoggingIn] = useActionState(
        loginAction,
        null
    );

    const [resetState, handleReset, isResetting] = useActionState(
        resetPasswordAction,
        null
    );

    const [showForgotModal, setShowForgotModal] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

            {/* LOGIN CARD */}
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                {/* TITLE */}
                <div className="text-center mb-6">

                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 mb-3">
                        <Lock className="w-5 h-5" />
                    </div>

                    <h1 className="text-xl font-bold text-slate-900">
                        Rahim Data Autos
                    </h1>

                </div>

                {/* LOGIN FORM */}
                <form action={handleLogin} className="space-y-4">

                    {/* ERROR */}
                    {loginState?.error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{loginState.error}</span>
                        </div>
                    )}

                    {/* USERNAME */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Username
                        </label>

                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                name="username"
                                required
                                placeholder="Enter username"
                                className="
                                    w-full
                                    bg-slate-50
                                    border border-slate-200
                                    rounded-lg
                                    py-2.5
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-slate-900
                                    placeholder-slate-400
                                    outline-none
                                    focus:bg-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Password
                        </label>

                        <div className="relative">
                            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Enter password"
                                className="
                                    w-full
                                    bg-slate-50
                                    border border-slate-200
                                    rounded-lg
                                    py-2.5
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-slate-900
                                    placeholder-slate-400
                                    outline-none
                                    focus:bg-white
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />
                        </div>
                    </div>

                    {/* FORGOT PASSWORD */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* LOGIN */}
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="
                            w-full
                            py-2.5
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            text-sm
                            font-semibold
                            rounded-lg
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {isLoggingIn ? "Authenticating..." : "Sign In"}
                    </button>

                </form>
            </div>

            {/* RESET PASSWORD MODAL */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">

                    <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl relative">

                        {/* CLOSE */}
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="
                                absolute
                                top-3
                                right-3
                                w-7
                                h-7
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                text-slate-400
                                hover:text-slate-700
                                hover:bg-slate-100
                            "
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* MODAL HEADER */}
                        <div className="px-5 pt-5 pb-3">

                            <div className="flex items-center gap-2.5">

                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <KeyRound className="w-4 h-4" />
                                </div>

                                <h2 className="text-lg font-semibold text-slate-900">
                                    Reset Password
                                </h2>

                            </div>

                        </div>

                        {/* FORM */}
                        <form
                            action={handleReset}
                            className="px-5 pb-5 space-y-3"
                        >

                            {/* ERROR */}
                            {resetState?.error && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{resetState.error}</span>
                                </div>
                            )}

                            {/* SUCCESS */}
                            {resetState?.success && (
                                <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-sm">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{resetState.success}</span>
                                </div>
                            )}

                            {/* USERNAME */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    required
                                    placeholder="admin"
                                    className="
                                        w-full
                                        bg-slate-50
                                        border border-slate-200
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/10
                                    "
                                />
                            </div>

                            {/* RECOVERY KEY */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Secret Recovery Key
                                </label>

                                <input
                                    type="password"
                                    name="recoveryKey"
                                    required
                                    placeholder="SEC-XXXX-KEY"
                                    className="
                                        w-full
                                        bg-slate-50
                                        border border-slate-200
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/10
                                    "
                                />
                            </div>

                            {/* NEW PASSWORD */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    placeholder="Enter new password"
                                    className="
                                        w-full
                                        bg-slate-50
                                        border border-slate-200
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/10
                                    "
                                />
                            </div>

                            {/* RESET BUTTON */}
                            <button
                                type="submit"
                                disabled={isResetting}
                                className="
                                    w-full
                                    py-2.5
                                    bg-emerald-600
                                    hover:bg-emerald-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    rounded-lg
                                    transition
                                    disabled:opacity-50
                                "
                            >
                                {isResetting
                                    ? "Resetting..."
                                    : "Update Password"}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}