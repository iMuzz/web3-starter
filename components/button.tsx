/* This example requires Tailwind CSS v2.0+ */
export const Button = ({
  children,
  classNameOverride,
  classNameExtension,
  ...props
}: { classNameOverride?: string; classNameExtension?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyle =
    'inline-flex items-center justify-center px-2 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none  '
  const enabledStyle = ' text-white bg-gray-800 hover:bg-gray-700 '
  const disabledStyle = ' text-black bg-gray-400 '

  const className = baseStyle + (props.disabled ? disabledStyle : enabledStyle) + classNameExtension
  return (
    <button type="button" className={classNameOverride || className} {...props}>
      {children}
    </button>
  )
}
