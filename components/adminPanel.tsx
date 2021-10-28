import React, { useState } from 'react'

const AdminPanel = () => {
  const [show, setShow] = useState(false)

  return (
    <div className="bg-white overflow-hidden border border-solid border-gray-100 shadow rounded-lg max-w-md m-auto">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Panel</h3>
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <div>Unpause</div>
          <button
            type="button"
            className="transition-all duration-200 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none "
            onClick={() => {}}
          >
            Unpause Contract
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
