import React, { useState } from 'react'

interface IProps {
  timeInSeconds: number
  onLapInteraction: any
  isRefresh: boolean
  onClick?: any
}

/**
 * Component that counts the cycle of time
 * @param props.timeInSeconds lap time in seconds
 * @returns props.onLapInteraction function with data return for each lap
 * https://github.com/danielcsbatista/react-spinner-time/blob/master/src/index.tsx
 */
export default function Spinner({ timeInSeconds, onLapInteraction, isRefresh, onClick }: IProps) {
  const [actualLap, setActualLap] = useState(1)

  var updateLapsData = function (finish: any) {
    onLapInteraction({
      actualLap: actualLap,
      isFinish: finish,
      timeInSeconds: timeInSeconds,
    })
  }

  var handleFinish = function () {
    updateLapsData(true)
  }

  var handleUpdate = function () {
    updateLapsData(false)
    setActualLap(actualLap + 1)
  }

  return (
    <svg version="1.1" className="base" viewBox="0 0 50 50" onClick={onClick}>
      <circle className="path background" cx="25" cy="25" r="20" />
      {!isRefresh && (
        <circle
          className="path "
          cx="25"
          cy="25"
          r="20"
          style={{
            animation: `dash ${timeInSeconds}s linear infinite`,
          }}
          onAnimationEnd={handleFinish}
          onAnimationIterationCapture={handleUpdate}
        />
      )}
      <style jsx>
        {`
          .base {
            width: 30px;
            height: 30px;
            transform: rotate(270deg);
          }
          :hover(.base) {
            display: none;
            fill: red;
          }
          .path {
            stroke: #1b1d22;
            stroke-linecap: round;
            stroke-width: 6;
            opacity: 1;
            fill: none;
          }
          .background {
            stroke: #1b1d22;
          }
        `}
      </style>
    </svg>
  )
}
