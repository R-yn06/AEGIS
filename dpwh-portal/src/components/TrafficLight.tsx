import React from 'react';

interface TrafficLightProps {
    risk?: string;
}

const TrafficLight: React.FC<TrafficLightProps> = ({ risk }) => {
    const r = (risk || 'Low').toLowerCase();
    const emoji =
        r.includes('high') || r.includes('critical')
            ? '🔴'
            : r.includes('medium')
            ? '🟡'
            : '🟢';

    return (
        <div className="flex items-center gap-2">
            <div className="text-2xl">{emoji}</div>
            <div className="hidden sm:block text-sm text-slate-500 capitalize">
                {risk}
            </div>
        </div>
    );
};

export default TrafficLight;