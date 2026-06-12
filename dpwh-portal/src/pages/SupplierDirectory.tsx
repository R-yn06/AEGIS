import React, { useEffect, useState } from 'react';
import MaterialCard from '../components/MaterialCard';

type Project = { project_title: string; bill_of_quantities_materials?: any[] };

const SupplierDirectory: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch('/projects.json')
            .then(r => r.json())
            .then((d: Project[]) => setProjects(d))
            .catch(() => setProjects([]));
    }, []);

    // flatten materials per project
    const materials = projects.flatMap(p =>
        (p.bill_of_quantities_materials ?? []).map(m => ({ ...m, project_title: p.project_title }))
    );

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold mb-4">Supplier Directory</h1>
            <h2 className="text-lg font-semibold">Materials & Local Pricing</h2>

            {materials.length === 0 ? (
                <div className="p-4 bg-white dark:bg-slate-800 rounded">No material data available.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {materials.map((m, i) => (
                        <div key={i}>
                            <MaterialCard m={m} />
                            <div className="mt-1 text-xs text-slate-500">Project: {m.project_title}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupplierDirectory;