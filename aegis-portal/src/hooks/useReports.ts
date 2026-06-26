import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getReports, recalculateScore, submitReport } from '../api/projects'
import { uploadPhoto } from '../api/uploads'
import type { SubmitReportInput } from '../types/project'

export function useReports(contractId?: string) {
  return useQuery({
    queryKey: ['reports', contractId],
    queryFn: () => getReports(contractId as string),
    enabled: Boolean(contractId),
    staleTime: 30_000,
  })
}

export function useSubmitReport(contractId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SubmitReportInput & { photo?: File | null }) => {
      if (!contractId) throw new Error('Choose a project before submitting a report.')
      const uploaded = input.photo ? await uploadPhoto(input.photo) : undefined
      const report = await submitReport(contractId, {
        text: input.text,
        reporterName: input.reporterName,
        photoKey: uploaded?.photoKey ?? input.photoKey,
      })
      await recalculateScore(contractId)
      return report
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['reports', contractId] }),
        queryClient.invalidateQueries({ queryKey: ['project', contractId] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ])
    },
  })
}
