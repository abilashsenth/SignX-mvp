import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/navbar'
import Style from '../styles/login.module.css'
import WhiteLogo from '../public/images/signx-logo-white.svg'
import MetaMaskGrey from '../public/images/metamask_grey.svg'
import MetaMaskColor from '../public/images/metamask_color.svg'
import PhantomGrey from '../public/images/phantom_grey.svg'
import { useState, useEffect } from 'react'
import { type } from 'os'

const Login: NextPage = () => {
  //useState for window.ethereum
  const [isMetaMask, setIsMetaMask] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')

  const checkIfMetamaskAvailable = () => {
    //make sure if window.ethereum is available
    if (typeof window.ethereum !== 'undefined') {
      //if window.ethereum is available, set isMetaMask to true
      console.log('window.ethereum is available')
      setIsMetaMask(true)
    } else {
      //if window.ethereum is not available, set isMetaMask to false
      console.log('window.ethereum is not available')
      setIsMetaMask(false)
    }
  }

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const ethereum = window.ethereum
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        console.log('💰 connected to this account: ', accounts[0])
        setCurrentAccount(accounts[0])
        window.location.href = '/home'
      } else {
        console.log('window.ethereum is not available')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfMetamaskAvailable()
  }, [])

  return (
    <div className="flex h-auto flex-col">
      {/* navigation bar */}
      <Navbar />
      <div className="flex flex-col items-center justify-center py-2">
        <Head>
          <title>SignX</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Heading */}
        <main className="mt-[4%] flex w-full flex-1 flex-col items-center justify-center px-20 text-center ">
          <h1 className={["", Style.hero_h1].join(" ")}>
            Connect your wallet
          </h1>
        </main>

        {/* Wallet connect frosted box */}
        <div className={["z-10 mt-9 flex h-[500px] w-[344px] items-center justify-center rounded-[26px]", Style.hero_div].join(" ")}>
          {/* Is there metamask? */}
          {isMetaMask ? (
            //when you have metamask
            <div className="flex flex-col items-center justify-center">
              <Image
                src={MetaMaskColor}
                width={105}
                height={75}
                className="items-center justify-center rounded-full"
              />
              {/*Is there no account already?*/}
              {currentAccount == '' ? (

                <div className=" mt-5 flex flex-col items-center justify-center">
                  <h2 className={[" items-center justify-center text-center text-xl font-bold", Style.hero_p].join(" ")}>
                    Wallet detected
                  </h2>
                  <button
                    className={["relative -bottom-20 rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 ", Style.hero_btn].join(" ")}
                    onClick={() => {
                      connectWallet()
                    }}
                  >
                    Authenticate
                  </button>
                </div>
              ) : (
                <h2 className={[" items-center justify-center text-center text-xl font-bold mt-5", Style.hero_p].join(" ")}>
                Connected successfully
              </h2>
              )}
            </div>
          ) : (
            // when you dont have metamask
            <div className="flex flex-col items-center justify-center">
              <Image
                src={MetaMaskGrey}
                width={105}
                height={75}
                className="items-center justify-center rounded-full"
              />
              {/*Is there no account already?*/}
                <div className=" mt-5 flex flex-col items-center justify-center">
                  <h2 className={[" items-center justify-center text-center text-xl font-bold", Style.hero_p].join(" ")}>
                    Wallet not detected
                  </h2>
                  <button
                    className={["relative -bottom-20 rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 ", Style.hero_btn].join(" ")}
                    onClick={() => {
                      window.open('https://metamask.io/')
                    }}
                  >
                    Download metamask
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
      {/* signx bottom logo */}
      <div className="relative bottom-1  z-10 my-5 mx-auto flex w-[100%] flex-col items-center justify-center">
        <Image src={WhiteLogo} width={100} height={100} />
      </div>
      {/* the saucy gradient */}
      <div
        className={[
          '-mt-18 -z-1 flex flex-col items-center justify-center py-2',
          Style.gradientbg,
        ].join(' ')}
      ></div>
    </div>
  )
}

export default Login
