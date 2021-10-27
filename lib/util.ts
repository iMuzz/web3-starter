import { toast } from 'react-hot-toast'

/**
 * Inserts middle ellipses into a given string
 * @param str The string to insert ellipses into
 * @param cutoffDecimals The minimum number of chars in string to insert ellipses
 * @param begginingDecimals The number of decimals to begin the result
 * @param endingDecimals The number of decimals to end the result
 * @returns
 */
export function middleEllipses(str: string, cutoffDecimals: number, begginingDecimals: number, endingDecimals: number) {
  if (str.length > cutoffDecimals) {
    return str.substr(0, begginingDecimals) + '...' + str.substr(str.length - endingDecimals, str.length)
  }
  return str
}

/**
 * Used to wrap all ethers async calls with toasts if it fails.
 * @param func ethers async call
 * @param funcArgs arguments passed to the function
 * @returns result of call or null if error
 */
export async function handleAsync(func: any, ...funcArgs: any) {
  return func(...funcArgs)
    .then((res: any) => res)
    .catch((error: any) => {
      toast.error(`${error.code} : ${error.message}`)
      console.error(error)
      return { error }
    })
}
