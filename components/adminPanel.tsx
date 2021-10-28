import React from 'react'

import { useUnpause } from '../hooks/useUnpause'
import Button from './button'

const AdminPanel = () => {
  const {
    unpause,
    data: { loading },
  } = useUnpause()
  return (
    <div className="bg-white overflow-hidden border border-solid border-gray-100 shadow rounded-lg max-w-md m-auto">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Panel</h3>
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <div>Unpause</div>
          <Button onClick={unpause} isLoading={loading}>
            {!loading ? <>Unpause</> : <>loading..</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
