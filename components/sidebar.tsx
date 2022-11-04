import React from 'react'
import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import signXLogo from '../assets/signX.svg'
import drafts from '../public/images/drafts.svg'
import pen from '../public/images/pen.svg'
import gear from '../public/images/gear.svg'
import poweroff from '../public/images/poweroff.svg'
import profilepic from '../public/images/profilepic.svg'
import signericon from '../public/images/signer_icon.svg'
import newSignIcon from '../public/images/new_sign_icon.svg'
import Style from '../styles/sidebar.module.css'

const Sidebar: NextPage = () => {
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
    <div className="block w-64 z-20">
      <aside aria-label="Sidebar">
        <div className="fixed flex h-[100vh] w-[300px] flex-col items-center overflow-y-auto rounded bg-white py-4 ">
          {/* Main logo */}
          <div className="m-10 items-center justify-center">
            <Image
              src={signXLogo}
              alt="SignX Logo"
              onClick={() => {
                window.location.href = '/home'
              }}
              className="mx-auto h-7 w-7"
            />
          </div>

          {/* Create new eSign button */}
          <div className="mb-5 flex justify-center">
            <div className="flex flex-col">
              <button
                className={[
                  'mt-5 h-[73px] w-[183px] rounded-lg bg-black py-2 px-4 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300',
                  Style.hero_btn_p,
                ].join(' ')}
                onClick={() => {
                  window.location.href = '/create-esign'
                }}
              >
                Create new Esign
              </button>
            </div>
          </div>

          {/* sidebar menu options */}
          <ul className="mt-10 h-[50%] space-y-2">
            <li>
              <a
                href="/home"
                className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 "
              >
                <Image src={pen} alt="pen" className="mr-2 h-4 w-4" />
                <span className="ml-3">Your documents</span>
              </a>
            </li>
            <li>
              <a
                href="/cast-signature"
                className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 "
              >
                <Image src={signericon} alt="drafts" className="mr-2 h-4 w-4" />
                <span className="ml-3">Cast eSign</span>
              </a>
            </li>
            
            <li>
              <a
                href="/preferences"
                className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 "
              >
                <Image src={gear} alt="gear" className="mr-2 h-4 w-4" />
                <span className="ml-3">Preferences</span>
              </a>
            </li>
          </ul>
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
          <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4 ">
            <li>
              <a
                onClick={() => {
                  window.location.href = '/login'
                }}
                className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 "
              >
                <Image src={poweroff} alt="poweroff" className="mr-2 h-4 w-4" />
                <span className="ml-3">Disconnect wallet</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
