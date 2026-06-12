import React, { useEffect, useState } from 'react';

type ProjectOption = { contract_id: string; project_title: string };

interface ProjectSelectProps {
  value?: string;
  onChange: (contractId: string) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<ProjectOption[]>([]);

  useEffect(() => {
    fetch('/projects.json')
      .then((r) => r.json())
      .then((data: any[]) =>
        setOptions(
          data
            .map((p) => ({ contract_id: p.contract_id, project_title: p.project_title }))
            .filter(Boolean)
        )
      )
      .catch(() => setOptions([]));
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor="project-select" className="block text-sm font-medium text-gray-700">
        Select a Nearby Project
      </label>
      <select
        id="project-select"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full p-2 border rounded bg-white dark:bg-slate-800"
      >
        <option value="">Select nearby project...</option>
        {options.map((o) => (
          <option key={o.contract_id} value={o.contract_id}>
            {o.contract_id} — {o.project_title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelect;