"use client";

import { useEffect, useState } from "react";
import CustomerCard from "./CustomerCard";
import CustomerSearch from "./CustomerSearch";
import { getCustomers } from "@/app/actions/customers";
import { List, Search } from "lucide-react";
import {
    Users,
    UserPlus,
} from "lucide-react";

type Customer = Awaited<ReturnType<typeof getCustomers>>[number];

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCustomers() {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to load customers:", error);
            } finally {
                setLoading(false);
            }
        }

        loadCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) => {
        const searchValue = search.toLowerCase().trim();

        if (!searchValue) {
            return true;
        }

        return (
            customer.fullName
                .toLowerCase()
                .includes(searchValue) ||

            customer.phone
                .toLowerCase()
                .includes(searchValue) ||

            customer.cnic
                .toLowerCase()
                .includes(searchValue)
        );
    });

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                            "
                        >
                            <Users size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Customers
                            </h1>

                            <p className="text-sm text-gray-500">
                                Manage all your customers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3">
                        <h2 className="font-semibold text-gray-900">
                            Search Customers
                        </h2>
                    </div>

                    <CustomerSearch
                        value={search}
                        onChange={setSearch}
                    />
                </div>

                {/* Result count */}
                <div className="mb-5 flex items-center gap-3">
                    <List
                        size={20}
                        className="text-gray-600"
                    />

                    <p className="text-xl font-semibold text-gray-900">
                        {filteredCustomers.length}{" "}
                        {filteredCustomers.length === 1
                            ? "Customer"
                            : "Customers"}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-20 text-center">
                        <p className="text-sm text-gray-500">
                            Loading customers...
                        </p>
                    </div>
                )}

                {/* No customers */}
                {!loading && customers.length === 0 && (
                    <div
                        className="
                            flex
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-dashed
                            border-gray-300
                            bg-white
                            text-center
                        "
                    >
                        <Users
                            size={30}
                            className="mb-3 text-gray-400"
                        />

                        <h2 className="font-semibold text-gray-900">
                            No customers found
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            There are currently no customers.
                        </p>
                    </div>
                )}

                {/* Search returned nothing */}
                {!loading &&
                    customers.length > 0 &&
                    filteredCustomers.length === 0 && (
                        <div
                            className="
                                flex
                                min-h-[250px]
                                flex-col
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-dashed
                                border-gray-300
                                bg-white
                                text-center
                            "
                        >
                            <Search
                                size={30}
                                className="mb-3 text-gray-400"
                            />

                            <h2 className="font-semibold text-gray-900">
                                No matching customer
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Try searching by another name, phone or CNIC.
                            </p>
                        </div>
                    )}

                {/* Customer Cards */}
                {!loading &&
                    filteredCustomers.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {filteredCustomers.map((customer) => (
                                <CustomerCard
                                    key={customer.id}
                                    customer={customer}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </main>
    );
}