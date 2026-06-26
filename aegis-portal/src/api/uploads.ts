import { apiRequest } from './client'
import type { UploadUrlResponse } from '../types/project'

export async function getUploadUrl(contentType: string): Promise<UploadUrlResponse> {
  return apiRequest<UploadUrlResponse>('/upload-url', {
    query: { contentType },
  })
}

export async function uploadPhoto(file: File): Promise<string> {
  // 1. Fetch the temporary upload link alongside the uniquely allocated photo key
  const upload = await getUploadUrl(file.type || 'image/jpeg')
  
  // 2. Perform raw binary stream payload upload directly to Amazon S3
  const response = await fetch(upload.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'image/jpeg',
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Photo upload binary sequence failed with status ${response.status}`)
  }

  // 3. Assemble the definitive public url mapping layout targeting the gateway resource directory
  const publicUrl = `https://8vv9ffp7b0.execute-api.ap-southeast-1.amazonaws.com/Prod/uploads/${upload.photoKey}`
  
  return publicUrl
}