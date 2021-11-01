/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface IProps {
  onClick: () => void
}

const Toggle: React.FC<IProps> = ({ onClick }) => {
  const [enabled, setEnabled] = useState(false)

  const handleChange = (e: boolean) => {
    setEnabled(e)
    onClick()
  }

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={classNames(
        enabled ? 'bg-indigo-600' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        )}
      >
        <span
          className={classNames(
            enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden="true"
        >
          <div style={{ fontSize: '8px' }} className="text-xs text-blue-700 uppercase">
            GN
          </div>
        </span>
        <span
          className={classNames(
            enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          )}
          aria-hidden="true"
        >
          <div style={{ fontSize: '8px' }} className="text-xs text-blue-700 uppercase">
            GM
          </div>
        </span>
      </span>
    </Switch>
  )
}

export default Toggle
