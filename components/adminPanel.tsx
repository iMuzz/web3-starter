import React from 'react'

import { usePause } from '../hooks/usePause'
import Button from './button'

const AdminPanel = () => {
  const {
    pause,
    isPaused,
    data: { loading },
  } = usePause()
  return (
    <div className="bg-white overflow-hidden border border-solid border-gray-100 shadow rounded-lg max-w-md m-auto">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Panel</h3>
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <Button onClick={async () => pause(!isPaused)} isLoading={loading}>
            {!loading ? <>{isPaused ? 'Unpause' : 'Pause'}</> : <>loading..</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
