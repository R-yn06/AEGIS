import { useI18n } from '../contexts/I18nContext'
import { useProjects } from '../hooks/useProjects'

interface ProjectSelectProps {
  value: string
  onChange: (contractId: string) => void
}

export default function ProjectSelect({ value, onChange }: ProjectSelectProps) {
  const { t } = useI18n()
  const { data, isLoading } = useProjects()
  const projects = data?.projects ?? []

  return (
    <select
      id="project-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="form-control"
      required
    >
      <option value="">{isLoading ? 'Loading projects...' : t('upload.selectProject')}</option>
      {projects.map((project) => (
        <option key={project.contractId} value={project.contractId}>
          {project.province}, {project.region} - {project.projectTitle}
        </option>
      ))}
    </select>
  )
}
