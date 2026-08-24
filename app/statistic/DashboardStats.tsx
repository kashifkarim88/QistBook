import {
    Users,
    FileText,
    Activity,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

type DashboardStatsProps = {
    totalCustomers: number;
    totalAgreements: number;
    activeAgreements: number;
    completedAgreements: number;
    defaultedAgreements: number;
};

function StatCard({
    title,
    value,
    icon,
    iconBg,
    iconColor,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-3
                py-3
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md

                sm:rounded-2xl
                sm:p-5
            "
        >
            <div className="flex items-center justify-between gap-2">

                {/* Text */}
                <div className="min-w-0">
                    <p
                        className="
                            truncate
                            text-xs
                            font-medium
                            text-gray-500
                            sm:text-sm
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-1
                            text-xl
                            font-bold
                            leading-tight
                            text-gray-900
                            sm:mt-2
                            sm:text-2xl
                        "
                    >
                        {value.toLocaleString()}
                    </p>
                </div>

                {/* Icon */}
                <div
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${iconBg}
                        ${iconColor}

                        sm:h-10
                        sm:w-10
                        sm:rounded-xl
                    `}
                >
                    <span className="sm:hidden">
                        {icon}
                    </span>

                    <span className="hidden sm:block">
                        {icon}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function DashboardStats({
    totalCustomers,
    totalAgreements,
    activeAgreements,
    completedAgreements,
    defaultedAgreements,
}: DashboardStatsProps) {
    return (
        <div
            className="
                grid
                grid-cols-2
                gap-2
                sm:gap-4
                lg:grid-cols-3
                xl:grid-cols-5
            "
        >
            <StatCard
                title="Customers"
                value={totalCustomers}
                icon={<Users size={18} />}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
            />

            <StatCard
                title="Agreements"
                value={totalAgreements}
                icon={<FileText size={18} />}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
            />

            <StatCard
                title="Active"
                value={activeAgreements}
                icon={<Activity size={18} />}
                iconBg="bg-green-50"
                iconColor="text-green-600"
            />

            <StatCard
                title="Completed"
                value={completedAgreements}
                icon={<CheckCircle2 size={18} />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
            />

            <StatCard
                title="Defaulted"
                value={defaultedAgreements}
                icon={<AlertTriangle size={18} />}
                iconBg="bg-red-50"
                iconColor="text-red-600"
            />
        </div>
    );
}