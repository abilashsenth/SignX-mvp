import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Style from '../styles/navbar.module.css'

function Navbar() {
  return (
    <nav className=" px-2 py-2.5 sm:px-4">
      <div className="navbar container mx-auto flex flex-wrap items-center justify-evenly p-5">
        {/* signx logo */}
        <Link href="/">
          <Image
            src={require('../assets/signX.svg')}
            className="mr-3 h-6 sm:h-9"
            alt="SignX Logo"
            height={100}
            width={100}
          />
        </Link>

        {/* mobile menu toggle */}
        <button
          data-collapse-toggle="mobile-menu"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            className="hidden h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        {/* navigation menu */}
        <div className="hidden w-full lg:block lg:w-auto" id="mobile-menu">
          <ul className="mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-sm lg:font-medium">
            <li
              className={[
                'text-1xl mt-2 block rounded py-2 pr-4 pl-3  text-[#000000eb] ',
                Style.navbar_link,
              ].join(' ')}
            >
              <Link href="#">Features</Link>
            </li>
            <li
              className={[
                'text-1xl mt-2 block rounded py-2 pr-4 pl-3  text-[#000000eb] ',
                Style.navbar_link,
              ].join(' ')}
            >
              <Link href="#">Use Cases</Link>
            </li>
            <li
              className={[
                'text-1xl mt-2 block rounded py-2  pr-4 pl-3  text-[#000000eb] ',
                Style.navbar_link,
              ].join(' ')}
            >
              <Link href="#">Pricing</Link>
            </li>
          </ul>
        </div>
        {/* cta buttons */}
        <div className='md:flex gap-5 hidden md:visible'>
          <div
            className={[
              'flex items-center justify-center rounded-2xl p-3 py-2 pr-4 pl-3 text-black',
              Style.cta_button_two,
            ].join(' ')}
          >
            <Link href="/login">Connect Wallet</Link>
          </div>

          <div
            className={[
              'flex items-center justify-center rounded-2xl p-3 py-2 pr-4 pl-3 text-white',
              Style.cta_button_one,
            ].join(' ')}
          >
            <Link href="/login">Get started</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
