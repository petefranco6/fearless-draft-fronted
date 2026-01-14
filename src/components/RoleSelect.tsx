import type { Role } from "../types/role";

type Props = {
    onSelect: (role: Role) => void;
};

export default function RoleSelect({ onSelect }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8">
            <h1 className="text-2xl font-bold text-center">Choose Role</h1>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded w-full sm:w-auto"
                    onClick={() => onSelect("BLUE")}
                >
                    BLUE TEAM
                </button>

                <button
                    className="px-6 py-3 bg-red-600 text-white rounded w-full sm:w-auto"
                    onClick={() => onSelect("RED")}
                >
                    RED TEAM
                </button>

                <button
                    className="px-6 py-3 bg-gray-700 text-white rounded w-full sm:w-auto"
                    onClick={() => onSelect("SPECTATOR")}
                >
                    SPECTATOR
                </button>
            </div>
        </div>
    );
}
