import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query

  if (!url) {
    res.status(400).send('URL is required')
    return
  }

  try {
    const response = await axios.get<ArrayBuffer>(url as string, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'audio/mp3',
      },
    })

    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(response.data) // Send the ArrayBuffer directly
  } catch (error) {
    res.status(500).send('Error fetching audio file')
  }
}
