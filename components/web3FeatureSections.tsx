import { useState, useEffect } from 'react'
import AddressPill from './addressPill'
import Button from './button'
import DarkModeToggle from './darkModeToggle'

interface IFeatureSectionProps {
  title: string
  description: string
  bgColorOverride?: string
}

const FeatureSection: React.FC<IFeatureSectionProps> = ({ title, description, children, bgColorOverride }) => {
  return (
    <div className="shadow-md rounded-md border border-solid light:border-gray-200 dark:border-gray-500 grid grid-cols-2 gap-2 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 light:text-gray-800"> {title}</h2>
        <p className="light:text-gray-600">{description}</p>
      </div>
      <div className={'bg-yellow-400 flex justify-center items-center ' + bgColorOverride}>{children}</div>
    </div>
  )
}

export const ENSSection: React.FC<{}> = () => {
  const [isBtnShown, setisBtnShown] = useState(true)
  const [isButtonLoading, setButtonLoading] = useState(false)

  const clickButton = () => {
    setButtonLoading(true)
    setTimeout(() => {
      setisBtnShown(false)
    }, 1000)
  }

  const startAnimation = () => {
    setTimeout(() => {
      clickButton()
    }, 3000)
  }

  useEffect(() => {
    startAnimation()
  })

  return (
    <FeatureSection
      title="ENS Resolution"
      description="ENS is the most widely integrated blockchain naming standard and is a growing network of usernames. Web 3
    Starter has ENS support out of the box."
    >
      <div className="p-8 shadow-md bg-white rounded-md">
        {isBtnShown ? (
          <Button onClick={startAnimation} isLoading={isButtonLoading}>
            Connect Wallet
          </Button>
        ) : (
          <AddressPill address={'0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54'} ensName={'faraaz.eth'} balance={'25'} />
        )}
      </div>
    </FeatureSection>
  )
}

export const TxStatesSection: React.FC<{}> = () => {
  return (
    <FeatureSection
      title="Transaction States"
      description="Transaction states are mapped to user-friendly toasts to give the user feedback on the state of their transaction."
      bgColorOverride="bg-blue-700"
    >
      <div className="p-8 shadow-md bg-white rounded-md">
        <Button>Connect Wallet</Button>
      </div>
    </FeatureSection>
  )
}

export const GMModeSection: React.FC<{}> = () => {
  return (
    <FeatureSection
      title="GM Mode... Obviously."
      description="It's 2021 — can you really ship a product without dark mode?"
      bgColorOverride="bg-purple-700"
    >
      <div className="p-8 shadow-md bg-white rounded-md">
        <DarkModeToggle />
      </div>
    </FeatureSection>
  )
}
