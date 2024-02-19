import { NextPageContext } from 'next'
import { useRouter } from "next/navigation";
import { cookies } from 'next/headers'

export async function getData() {
    const userCookies = cookies().get('token')

    if (!userCookies) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    console.log(userCookies.value)
    const res = await fetch('http://localhost:8080/users/getProfile', {
        headers: {
            cookie: userCookies.value! // Assign the string to the cookie property
        }
    })
    
    const data = await res.json()

    return data
}


export default async function Home(props: any) {
    const { data } = await getData()
    console.log(data)
    return (
        <div>
            <h1>Projects</h1>
        </div>
    )
}
  