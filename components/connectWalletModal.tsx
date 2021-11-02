import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import Image from 'next/image'

import useWeb3Container from '../hooks/useWeb3User'
import Button from './button'

interface IProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function connectModal({ isOpen, setIsOpen }: IProps) {
  const { wallet } = useWeb3Container.useContainer()

  const handleConnect = () => {
    wallet.connect('injected').then(() => {
      setIsOpen(false)
    })
  }

  const handleWalletConnect = () => {
    wallet.connect('walletconnect').then(() => {
      setIsOpen(false)
    })
  }

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
                <div
                  className="hover:bg-gray-100 border-b border-solid border-gray-200 transition-all duration-200 cursor-pointer flex flex-col justify-center p-6 py-8"
                  onClick={handleConnect}
                >
                  <Image src="/metamask.svg" width="50" height="50" alt="Metamask Logo" />
                  <div className="text-center mt-1">
                    <h2 className="text-2xl font-semibold dark:text-gray-900">MetaMask</h2>
                    <p className="text-gray-500">Connect your metamask wallet.</p>
                  </div>
                </div>
                <div
                  className="hover:bg-gray-100 transition-all duration-200 cursor-pointer flex flex-col justify-center p-6 py-8"
                  onClick={handleWalletConnect}
                >
                  <Image src="/wallet-connect.svg" width="40" height="40" alt="Metamask Logo" />
                  <div className="text-center mt-1">
                    <h2 className="text-2xl font-semibold dark:text-gray-900">Wallet Connect</h2>
                    <p className="text-gray-500">Scan with your favorite wallet to connect.</p>
                  </div>
                </div>
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
