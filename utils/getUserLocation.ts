import axios from 'axios'

export const fetchUserLocation = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/')
    return response.data
  } catch (error) {
    console.log(error)
  }
}
