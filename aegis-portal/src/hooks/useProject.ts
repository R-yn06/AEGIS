import { useQuery } from '@tanstack/react-query'
import { getProject } from '../api/projects'

export function useProject(contractId?: string) {
  return useQuery({
    queryKey: ['project', contractId],
    queryFn: () => getProject(contractId as string),
    enabled: Boolean(contractId),
    staleTime: 45_000,
  })
}
