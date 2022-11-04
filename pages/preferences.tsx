import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar'
import profilepic from '../public/images/profilepic.svg'
import poweroff from '../public/images/poweroff.svg'
import emailIcon from '../public/images/email.svg'

const Preferences: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('')

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const ethereum = window.ethereum
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        console.log('💰 connected to this account: ', accounts[0])
        setCurrentAccount(accounts[0])
      } else {
        console.log('window.ethereum is not available')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />

      <div className="flex w-[100%] flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-2xl font-bold">Preferences</h1>

          <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
            <div className="m-5">
              <a
                href="#"
                className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 pointer-events-none"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Your signX account details{' '}
                </h5>
                {/* user wallet details */}
                <div className="flex flex-row justify-start">
                  <Image
                    src={profilepic}
                    alt="profilepic"
                    className="mx-auto h-10 w-10"
                  />
                  <div className="mt-2 ml-2 flex flex-col text-left">
                    <span className="text-sm font-bold">
                      {currentAccount.substring(0, 6)}...
                      {currentAccount.substring(currentAccount.length - 6)}
                    </span>
                    <span className="text-sm">🦊Metamask</span>
                  </div>
                </div>
                {/* Sign out button */}
                <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <li>
                    <a
                      href="#"
                      className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Image
                        src={poweroff}
                        alt="poweroff"
                        className="mr-2 h-4 w-4"
                      />
                      <span className="ml-3">Disconnect wallet</span>
                    </a>
                  </li>
                </ul>
              </a>
            </div>
            <div className="m-5">
              <a
                href="#"
                className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 pointer-events-none"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  🟢 signX pro membership
                </h5>
                <ul className="text-left">
                  <li className="font-normal text-gray-700 dark:text-gray-400">
                    ✅Unlimited signing
                  </li>
                  <li className="font-normal text-gray-700 dark:text-gray-400">
                    ✅Deploy in any chain
                  </li>
                  <li className="font-normal text-gray-700 dark:text-gray-400">
                    ✅QR Code/Link/Hash
                  </li>
                  <li className="font-normal text-gray-700 dark:text-gray-400">
                    ✅2 Parties per document
                  </li>
                </ul>
              </a>
            </div>
            <div className="m-5">
              <a
                href="#"
                className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 pointer-events-none"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Reach out to us
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Veritatis obcaecati tenetur iure eius earum ut molestias
                  architecto voluptate aliquam nihil, eveniet aliquid culpa
                  officia aut! Impedit sit sunt quaerat, odit, tenetur error,
                  harum nesciunt ipsum debitis quas aliquid.
                </p>
                {/* Sign out button */}
                <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <li>
                    <a
                      href="#"
                      className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Image
                        src={emailIcon}
                        alt="emailIcon"
                        className="mr-2 h-4 w-4"
                      />
                      <span className="ml-3">Click here to email</span>
                    </a>
                  </li>
                </ul>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Preferences
