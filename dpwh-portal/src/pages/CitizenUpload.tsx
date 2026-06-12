import React, { useState } from 'react'
import CameraButton from '../components/CameraButton'
import ProjectSelect from '../components/ProjectSelect'

export default function CitizenUpload() {
  const [projectId, setProjectId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [photoData, setPhotoData] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // demo: log payload. Replace with API call as needed.
    const payload = { projectId, notes, photo: photoData, timestamp: new Date().toISOString() }
    console.log('upload', payload)
    alert('Upload recorded (demo). Check console for payload.')
    setProjectId('')
    setNotes('')
    setPhotoData(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Citizen Upload</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nearby project</label>
          <ProjectSelect value={projectId} onChange={setProjectId} />
        </div>

        <div>
          <label className="block text-sm mb-1">Photo</label>
          <div className="flex items-center gap-3">
            <CameraButton onCapture={data => setPhotoData(data)} />
            {photoData && <img src={photoData} alt="capture" className="h-20 rounded border" />}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-slate-800"
            placeholder="Describe the issue or observation..."
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setProjectId('')
              setNotes('')
              setPhotoData(null)
            }}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}