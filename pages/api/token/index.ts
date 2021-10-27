import { NextApiRequest, NextApiResponse } from 'next'

async function token(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { id },
    } = req

    console.log({ id })
    res.status(200).json({
      name: `Survivor #${id}`,
      description: `This is survivor ${id}.`,
      image: 'https://bafybeigjcmlwefzgaect4b5o52gi5u6rzi452gbzuoauncb23rrivria6q.ipfs.dweb.link/',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error reading data' })
  }
}

export default token
