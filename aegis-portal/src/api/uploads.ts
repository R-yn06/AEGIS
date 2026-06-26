import { apiRequest } from './client'
import type { UploadUrlResponse } from '../types/project'

export async function getUploadUrl(contentType: string): Promise<UploadUrlResponse> {
  return apiRequest<UploadUrlResponse>('/upload-url', {
    query: { contentType },
  })
}

export async function uploadPhoto(file: File): Promise<UploadUrlResponse> {
  const upload = await getUploadUrl(file.type || 'image/jpeg')
  const response = await fetch(upload.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'image/jpeg',
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Photo upload failed with status ${response.status}`)
  }

  return upload
}
