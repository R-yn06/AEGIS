import React from 'react';

interface Project {
    id: number;
    name: string;
    riskLevel: 'good' | 'review' | 'high';
}

interface ProjectListProps {
    projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    return (
        <div className="project-list">
            <h2 className="text-xl font-bold mb-4">Local DPWH Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project.id} className="flex items-center justify-between p-2 border-b">
                        <span>{project.name}</span>
                        <span>
                            {project.riskLevel === 'good' && <span className="text-green-500">🟢</span>}
                            {project.riskLevel === 'review' && <span className="text-yellow-500">🟡</span>}
                            {project.riskLevel === 'high' && <span className="text-red-500">🔴</span>}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;