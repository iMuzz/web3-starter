import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useConnect } from 'wagmi'
import Image from 'next/image'

interface IProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const ConnectWalletModal: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const [{ data, error }, connect] = useConnect()

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="ease-in duration-200"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 dialogue-overlay opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex flex-col">
                {data.connectors.map((x) => (
                  <div
                    className="flex flex-col justify-center p-6 py-8 transition-all duration-200 cursor-pointer hover:bg-gray-100"
                    key={x.id}
                    onClick={() => connect(x)}
                  >
                    {x.name == 'MetaMask' ? (
                      <Image src="/metamask.svg" width="50" height="50" alt="Metamask Logo" />
                    ) : x.name == 'WalletConnect' ? (
                      <Image src="/wallet-connect.svg" width="50" height="50" alt="Metamask Logo" />
                    ) : (
                      <Image src="/coinbase.svg" width="80" height="80" alt="Metamask Logo" />
                    )}
                    <div className="mt-1 text-center">
                      <h2 className="text-2xl font-semibold dark:text-gray-900">{x.name} Connect</h2>
                      <p className="text-gray-500">Connect with your favorite wallet.</p>
                    </div>
                    {!x.ready && ' (unsupported)'}
                  </div>
                ))}
                {error && (
                  <div className="relative p-4 mt-3 bg-red-500 rounded-lg rounded-tr-none opacity-100">
                    {error?.message ?? 'Failed to connect'}
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>

          <style jsx>{`
            :global(.dialogue-overlay) {
              background-color: black;
              opacity: 0.3;
            }
          `}</style>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConnectWalletModal
