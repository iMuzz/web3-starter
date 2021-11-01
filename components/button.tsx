// Button.jsx
import classnames from 'classnames'
import Spinner from './spinner'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  bgColor?: string
  darkBgColor?: string
  darkBgHoverColor?: string
  bgHoverColor?: string
  textColor?: string
  children: React.ReactElement | string
  isLoading?: boolean
  disabled?: boolean
  classOverrides?: string
}

const Button: React.FC<IButtonProps> = ({
  size = 'sm',
  bgColor = 'indigo-500',
  darkBgColor = 'gray-500',
  darkBgHoverColor = 'gray-600',
  bgHoverColor = 'indigo-600',
  textColor = 'white',
  isLoading = false,
  disabled = false,
  classOverrides,
  children = '',
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={classnames(
        `transition-all duration-200 text-${textColor} dark:bg-${darkBgColor} dark:hover:bg-${darkBgHoverColor} py-2 px-4 rounded font-medium text-center`,
        {
          'text-xs': size === 'sm',
          'text-md': size === 'md',
          'text-xl': size === 'lg',
          'bg-indigo-500 hover:bg-indigo-600': !isLoading,
          'bg-gray-400 cursor-not-allowed': isLoading || disabled,
          [`${classOverrides}`]: classOverrides?.length && classOverrides?.length > 0,
        },
      )}
      {...props}
    >
      <div className="relative">
        <div
          className={classnames('', {
            'opacity-0 h-0': isLoading,
          })}
        >
          {children}
        </div>
        {isLoading && <Spinner />}
      </div>
    </button>
  )
}

export default Button
