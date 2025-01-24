import axios from 'axios'
import '../pages/contact-us.module.scss'

interface FormValues {
  fullName: string
  subject: string
  text: string
  email: string
}


const PostData = async (
  values: FormValues,
  Token: string
) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_DEFAULT_URL}/public/contact`, values, {
      headers: {
        'x-access-token': Token,
      },
    })
   
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
   
  }
}

export default PostData
