import React from 'react';

interface MaterialCardProps {
    m: {
        description: string;
        unit: string;
        unit_cost_declared: number;
        baseline_unit_cost: number;
    };
}

const MaterialCard: React.FC<MaterialCardProps> = ({ m }) => {
    return (
        <div className="p-3 border rounded bg-white dark:bg-slate-800">
            <div className="flex justify-between">
                <div className="text-sm font-medium">{m.description}</div>
                <div className="text-xs text-slate-500">{m.unit}</div>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 flex justify-between">
                <div>Declared: ₱{m.unit_cost_declared?.toLocaleString()}</div>
                <div>Baseline: ₱{m.baseline_unit_cost?.toLocaleString()}</div>
            </div>
        </div>
    );
};

export default MaterialCard;