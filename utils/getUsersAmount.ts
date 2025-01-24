import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.DEFAULT_URL || process.env.NEXT_PUBLIC_DEFAULT_URL,
})

export const getUsersAmount = () => {
  return instance
    .get('/public/users/count')
    .then(response => response.data.data)
    .catch(error => console.log(error))
}
