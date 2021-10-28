// Button.jsx
import classnames from 'classnames'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  bgColor?: 'sm' | 'md' | 'lg'
  bgHoverColor?: 'sm' | 'md' | 'lg'
  textColor?: string
  children: React.ReactElement | string
  isLoading?: boolean
  disabled?: boolean
  classOverrides?: string
}

const Button: React.FC<IButtonProps> = ({
  size = 'sm',
  bgColor = 'indigo-500',
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
      className={classnames(`transition-all duration-200 text-${textColor} py-2 px-4 rounded font-medium text-center`, {
        'text-xs': size === 'sm',
        'text-md': size === 'md',
        'text-xl': size === 'lg',
        [`bg-${bgColor} hover:bg-${bgHoverColor}`]: !isLoading,
        'bg-gray-400 cursor-not-allowed': isLoading || disabled,
        [`${classOverrides}`]: classOverrides?.length && classOverrides?.length > 0,
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
