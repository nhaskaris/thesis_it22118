'use client';

import * as React from 'react';
import Link from "next/link";
import { UserAuth } from '@/context/AuthContext';
import Image from 'next/image';

const pages = ['Projects', 'Contracts', 'Timesheets', 'People'];

function Header() {
  const { user, googleSignIn, logOut, photoUrl, loading, isAdmin } = UserAuth();


  return (
    <nav
    className="flex-no-wrap relative flex w-full items-center justify-between py-2 shadow-md dark:bg-neutral-600 lg:flex-wrap lg:justify-start lg:py-4">
        <div className="flex w-full flex-wrap items-center justify-between px-3">
            {user ? (
                <div
                className="flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
                id="navbarSupportedContent1"
                data-te-collapse-item>
                    <Link href={`/`}>
                        <button type='button' className='mr-5 text-white'>Home</button>
                    </Link>
                    {pages.map((page) => (
                    <Link href={`/${page.toLowerCase()}`} key={page}>
                        <button type='button' className='mr-5 text-white'>{page}</button>
                    </Link>
                    ))}
                    {isAdmin && (
                        <div className="relative flex items-center" data-te-dropdown-alignment="end">
                            <Link href={`/users`}>
                                <button type='button' className='mr-5 text-white'>Users</button>
                            </Link>
                            <Link href={`/wps`}>
                                <button type='button' className='mr-5 text-white'>Wps</button>
                            </Link>
                        </div>
                    )}
                </div>
            ): !loading && (
                <div className="relative flex items-center ml-auto">
                    <button onClick={googleSignIn} className='text-white'>Sign in</button>
                </div>
            )}

            {loading && (
              <div className="relative flex items-center ml-auto">
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
            </div>
            )}

            {user && (
                <div className="relative flex items-center" data-te-dropdown-alignment="end">
                    <div
                        className="relative">
                        <a
                        className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                        aria-expanded="false">
                        <button type='button' className='mr-2 text-white' onClick={logOut}>Logout</button>
                        <Image
                            src={photoUrl as string}
                            className="rounded-full"
                            alt={user.displayName as string}
                            width={40}
                            height={40}
                            loading="lazy" 
                            title={user.displayName!}/>
                        </a>
                    </div>
                </div>
            )}
        </div>
    </nav>
  );
}
export default Header;