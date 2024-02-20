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
            authorization: 'Bearer ' + userCookies.value!
        }
    }).catch(err => {
        return err.statusText;
    })

    if (!res.ok) {
        return (<Alert message={res.statusText} severity={'critical'} />)
    }
    
    const data = await res.json()

    return data
}


export default async function Home() {
    return (
        <div>
        </div>
    )
}
  