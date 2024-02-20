import { NextPageContext } from 'next'
import { useRouter } from "next/navigation";
import { cookies } from 'next/headers'
import Alert from '@/components/Alert';

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

    const res = await fetch('http://localhost:8080/users/getProfile', {
        headers: {
            authorization: userCookies.value!
        }
    }).catch(err => {
        return err.message;
    })


    if (!res.ok) {
        return (<Alert message={res} severity={'critical'} />)
    }
    
    const data = await res.json()

    return data
}


export default async function Home(props: any) {
    const data = await getData()
    return (
        <div>
            {data}
        </div>
    )
}
  