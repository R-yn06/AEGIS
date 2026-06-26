import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../api/projects'
import type { ProjectFilters } from '../types/project'

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
    keepPreviousData: true,
    staleTime: 60_000,
  })
}
