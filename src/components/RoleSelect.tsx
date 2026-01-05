import type { Role } from "../types/role";

type Props = {
    onSelect: (role: Role) => void;
};

export default function RoleSelect({ onSelect }: Props) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-2xl font-bold">Choose Role</h1>

            <div className="flex gap-4">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded"
                    onClick={() => onSelect("BLUE")}
                >
                    BLUE TEAM
                </button>

                <button
                    className="px-6 py-3 bg-red-600 text-white rounded"
                    onClick={() => onSelect("RED")}
                >
                    RED TEAM
                </button>

                <button
                    className="px-6 py-3 bg-gray-700 text-white rounded"
                    onClick={() => onSelect("SPECTATOR")}
                >
                    SPECTATOR
                </button>
            </div>
        </div>
    );
}
