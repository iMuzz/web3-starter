import { NextApiRequest, NextApiResponse } from 'next'
import { authorize } from '@liveblocks/node'

const secret = process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  /**
   * Implement your own security here.
   *
   * It's your responsibility to ensure that the caller of this endpoint
   * is a valid user by validating the cookies or authentication headers
   * and that it has access to the requested room.
   */

  if (!secret) {
    return res.status(400).json({ message: 'Liveblocks secret key not available. Check environment variables.' })
  }

  const room = req.body.room
  const result = await authorize({ room, secret })
  return res.status(result.status).end(result.body)
}
