import React, { useEffect, useState } from 'react';

type Project = {
  contract_id: string;
  project_title: string;
  location: string;
  implementing_office?: string;
  risk_classification?: string;
  last_updated?: string;
  cost_deviation_percent?: number;
  citizen_upload_count?: number;
  bill_of_quantities_materials?: any[];
  ui_theme?: string;
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="p-4 bg-white dark:bg-slate-800 rounded shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{project.contract_id}</div>
          <h2 className="text-lg font-medium">{project.project_title}</h2>
          <div className="text-sm text-slate-500">{project.location}</div>
        </div>
        <div className="text-sm text-slate-400">{project.ui_theme}</div>
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {project.implementing_office && <div>Office: {project.implementing_office}</div>}
        {project.risk_classification && <div>Risk: {project.risk_classification}</div>}
        {typeof project.cost_deviation_percent === 'number' && (
          <div>Cost deviation: {project.cost_deviation_percent}%</div>
        )}
        {typeof project.citizen_upload_count === 'number' && <div>Uploads: {project.citizen_upload_count}</div>}
      </div>
    </article>
  );
};

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  const filtered = projects.filter(p =>
    (p.project_title + ' ' + p.location + ' ' + p.contract_id)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6">
      <header className="max-w-4xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">DPWH Projects — Dashboard</h1>
          <div className="text-sm text-slate-500">Local view</div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className="col-span-2 p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            placeholder="Search project, location or contract id..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="p-2 text-sm text-slate-600 dark:text-slate-300">
            Projects: <span className="font-medium">{projects.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="p-4 bg-white dark:bg-slate-800 rounded shadow text-center">
            No projects found.
          </div>
        ) : (
          filtered.map(p => <ProjectCard key={p.contract_id} project={p} />)
        )}
      </main>
    </div>
  );
};

export default Dashboard;