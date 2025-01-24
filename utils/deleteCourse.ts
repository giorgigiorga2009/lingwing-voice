import axios from 'axios'

interface Props {
  slug: string
  token?: string | null
}

export const resetCourse = async ({ slug, token }: Props) => {
  const headers = {
    Authorization: token ?? '',
  }
  return await axios
    .delete(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/user/delete/startedCourse/${slug}`,
      {
        headers: headers,
      },
    )
    .then(response => response.data.data)
    .catch(error => {
      console.log(error)
      return error
    })
}
