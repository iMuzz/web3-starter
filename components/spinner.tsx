const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="
        border-2 border-t-2 border-gray-800
        loader
        ease-linear
        rounded-full
        h-4
        w-4
      "
      />
      <style jsx>
        {`
          .loader {
            border-top-color: white;
            animation: spinner 0.6s linear infinite;
          }

          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Spinner
