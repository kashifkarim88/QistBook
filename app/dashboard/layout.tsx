"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import {
    LayoutDashboard,
    PlusCircle,
    CreditCard,
    LogOut,
    Bike,
    Menu,
    X
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: "Overview & Calls", href: "/dashboard", icon: LayoutDashboard, color: "text-blue-600" },
        { name: "New Installment Sale", href: "/dashboard/new-sale", icon: PlusCircle, color: "text-emerald-600" },
        { name: "Payment Record", href: "/dashboard/Customers", icon: CreditCard, color: "text-purple-600" },
        { name: "Dashboard", href: "/dashboard/statistic", icon: LayoutDashboard, color: "text-blue-600" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row relative">

            {/* MOBILE TOP HEADER BAR */}
            <div className="md:hidden bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between sticky top-0 z-30 print:hidden">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                        <Bike className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-base">Rahim Dad Autos</span>
                </div>

                {/* TOP RIGHT HAMBURGER MENU BUTTON */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle navigation menu"
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* BACKDROP OVERLAY FOR MOBILE */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {/* SIDEBAR NAVIGATION */}
            <aside
                className={`fixed md:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transform transition-transform duration-200 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 print:hidden"
                    }`}
            >
                <div>
                    {/* LOGO / HEADER (DESKTOP) */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
                                <Bike className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-slate-900 leading-tight">Rahim Dad Autos</h1>
                                <p className="text-xs text-slate-400">Installment Ledger</p>
                            </div>
                        </div>

                        {/* CLOSE BUTTON INSIDE MOBILE SIDEBAR HEADER */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* NAV LINKS */}
                    <nav className="p-4 space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${item.color}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* USER LOGOUT FOOTER */}
                <div className="p-4 border-t border-slate-100">
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-700 font-semibold rounded-xl text-sm transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}