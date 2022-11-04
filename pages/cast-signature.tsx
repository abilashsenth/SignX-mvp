import type { NextPage } from 'next'
import axios from 'axios'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Sidebar from '../components/sidebar'
import Image from 'next/image'
import qs from 'querystring'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Lottie from 'lottie-react'
import loadingAnimation from '../public/lotties/loading.json'
import { create } from 'ipfs-http-client'
import Style from '../styles/cast_signature.module.css'
import Searchbar from '../components/searchbar'
import PolygonMiniLogo from '../public/images/polygon_mini_logo.svg'
import EthereumMiniLogo from '../public/images/ethereum_mini_logo.svg'
import ghost from '../public/images/ghost.svg'

const CastSignature: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [signCode, setSignCode] = useState('')
  const [currentAccount, setCurrentAccount] = useState<string>('')
  const [signatures, setSignatures] = useState<any>([])

  const [dataRecieved, setDataRecieved] = useState<boolean>(false)
  const [length, setLength] = useState(0)

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    if (currentAccount !== '') {
      console.log('currentAccount: ', currentAccount)
      getSignData()
    }
  }, [currentAccount])

  useEffect(() => {
    console.log('signatures: ', signatures)
    if (signatures.length > 0) {
      setDataRecieved(true)
      printMap()
    }
  }, [signatures])

  const printMap = () => {
    console.log('printing map')
    if (signatures.length > 0) {
      setLength(signatures.length)
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
      } else {
        console.log('window.ethereum is not available')
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleChangeSignCode(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('signercode', e.target.value)
    setSignCode(e.target.value)
  }

  const opensignerflow = async () => {
    console.log('opensignerflow')
    const url = `https://signx-backend.herokuapp.com/sign/${signCode}`
    console.log(url)
    try {
      const response = await axios.get(url)
      if (response.data === 'No Sign found') {
        toast.error('No signer found')
      } else {
        setLoading(true)
        window.location.href = `/previewsigner/${signCode}`
      }
    } catch (error) {
      console.log('error generating signer code', error)
    }
  }

  const getSignData = async () => {
    console.log('getSigns')
    const url = `https://signx-backend.herokuapp.com/signer/getsigncodes`
    try {
      const response = await axios.post(
        url,
        qs.stringify({
          signerWallet: currentAccount,
        })
      )
      if (response.data.length > 0) {
        setSignatures(response.data)
      }
    } catch (error) {
      console.log('error getting deployed signs', error)
    }
  }

  function copyToClipboard(text: string) {
    const elem = document.createElement('textarea')
    elem.value = text
    document.body.appendChild(elem)
    elem.select()
    document.execCommand('copy')
    document.body.removeChild(elem)
    toast('copied to clipboard')
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Head>
          <title>Paste your signer code</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />
        <div className=" mx-[20%] w-[80%] py-2 ">
          {dataRecieved ? (
            // there's undeployed sign data. let's populate them
            <div className="flex  flex-col gap-1 ">
              {/* input the signercode or signer link in this omnibar */}
              <div
                className={[
                  ' mt-[7%] flex h-10 w-[90%] flex-row items-center rounded-r-[10px] rounded-l-[10px] bg-white p-5',
                  Style.searchbar,
                ].join(' ')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  className="h-10 w-full px-4 py-2 outline-none"
                  onChange={handleChangeSignCode}
                  placeholder="Enter the link sent to you or the eSign code"
                />

                <button
                  className="m-5 w-[100%] items-center justify-center rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                  onClick={() => {
                    opensignerflow()
                    event?.preventDefault()
                  }}
                >
                  Continue
                </button>
              </div>

              {/* this div will be populated with the pending sig data in grid */}
              <div className="mt-10 flex flex-col items-start">
                <h1 className={['text-left', Style.blackheading].join(' ')}>
                  Pending Signatures
                </h1>
                <p className={['mt-2 text-left', Style.alert_p].join(' ')}>
                  Documents that are awaiting your signature.
                </p>
                <ul
                  className="mt-10"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridGap: '18em',
                  }}
                >
                  {signatures ? (
                    [...Array(length)].map((e, i) => (
                      <>
                        {signatures[i]?.signerStatus === 'pending' && (
                          // the outer card
                          <li key={signatures[i].sign._id}>
                            <div
                              className={[
                                'flex flex-col items-center justify-center',
                                Style.cardrectangle,
                              ].join(' ')}
                            >
                              {/* the top portion of the card */}
                              <div className="flex flex-row items-center justify-between p-3">
                                {/* title of the sign document */}
                                <p
                                  className={['ml-3', Style.signtitle].join(
                                    ' '
                                  )}
                                >
                                  {signatures[i]?.sign.signName}
                                </p>
                                {/* the button to open the sign doc */}
                                <div
                                  className={[
                                    'flex items-center justify-center',
                                    Style.cardbutton,
                                  ].join(' ')}
                                  onClick={() => {
                                    window.location.href = `/previewsigner/${signatures[i]?.sign.signCode}`
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 items-center"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#000000"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {/* to display and copy the transaction hash */}
                              <div
                                className={[
                                  'flex flex-row items-center justify-between p-2',
                                  Style.cardrectangle2,
                                ].join(' ')}
                              >
                                {/* indication */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="#FDD264"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {/* text zone */}
                                <div className="flex flex-col justify-center">
                                  <p
                                    className={[
                                      ' text-[10px]',
                                      Style.hinttext,
                                    ].join(' ')}
                                  >
                                    {new Date(Date.now()).toLocaleDateString(
                                      'en-US'
                                    )}
                                  </p>
                                  <p
                                    className={[
                                      ' w-[130px] overflow-hidden text-ellipsis',
                                      Style.contenttext,
                                    ].join(' ')}
                                  >
                                    previewsigner/{signatures[i]?.sign.signCode}
                                    ...
                                  </p>
                                </div>
                                {/* copy button */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={() => {
                                    copyToClipboard(
                                      'https://www.signx.dev/previewsigner/' +
                                        signatures[i]?.sign.signCode
                                    )
                                  }}
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>

                              {/* to show which chain it is deployed on  */}
                              <div
                                className={[
                                  'mt-3 flex flex-row items-center justify-start p-3',
                                  Style.cardrectangle2,
                                ].join(' ')}
                              >
                                {/* indication */}
                                <Image
                                  src={PolygonMiniLogo}
                                  className="h-[24px] w-[24px]"
                                />
                                {/* text zone */}
                                <div className="flex flex-col">
                                  <p
                                    className={[
                                      ' ml-4 text-[10px]',
                                      Style.hinttext,
                                    ].join(' ')}
                                  >
                                    Yet to deploy on{' '}
                                    {signatures[i]?.sign.signChain} testnet
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </>
                    ))
                  ) : (
                    <p>loading</p>
                  )}
                </ul>
              </div>

              {/* this div will be populated with the completed sig data in the grid */}
              <div className="mt-[300px] flex flex-col items-start">
                <h1 className={['text-left', Style.blackheading].join(' ')}>
                  Completed Signatures
                </h1>
                <p className={['mt-2 text-left', Style.alert_p].join(' ')}>
                  Documents that you have completed signing.
                </p>
                <ul
                  className="mt-10"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridGap: '18em',
                  }}
                >
                  {signatures ? (
                    [...Array(length)].map((e, i) => (
                      <>
                        {signatures[i]?.signerStatus === 'signed' && (
                          // the outer card
                          <li key={signatures[i].sign._id}>
                            <div
                              className={[
                                'flex flex-col items-center justify-center',
                                Style.cardrectangle,
                              ].join(' ')}
                            >
                              {/* the top portion of the card */}
                              <div className="flex flex-row items-center justify-between p-3">
                                {/* title of the sign document */}
                                <p
                                  className={['ml-3', Style.signtitle].join(
                                    ' '
                                  )}
                                >
                                  {signatures[i]?.sign.signName}
                                </p>
                                {/* the button to open the sign doc */}
                                <div
                                  className={[
                                    'flex items-center justify-center',
                                    Style.cardbutton,
                                  ].join(' ')}
                                  onClick={() => {
                                    window.location.href = `/previewsigner/${signatures[i]?.sign.signCode}`
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 items-center"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#000000"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {/* to display and copy the transaction hash */}
                              <div
                                className={[
                                  'flex flex-row items-center justify-between p-2',
                                  Style.cardrectangle2,
                                ].join(' ')}
                              >
                                {/* indication */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="#64FD7C"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {/* text zone */}
                                <div className="flex flex-col justify-center">
                                  <p
                                    className={[
                                      ' text-[10px]',
                                      Style.hinttext,
                                    ].join(' ')}
                                  >
                                    Transaction hash
                                  </p>
                                  <p
                                    className={[
                                      ' w-[130px] overflow-hidden text-ellipsis',
                                      Style.contenttext,
                                    ].join(' ')}
                                  >
                                    {signatures[i]?.sign.signOwnerAddress}...
                                  </p>
                                </div>
                                {/* copy button */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  onClick={() => {
                                    copyToClipboard(
                                      'https://www.signx.dev/previewsigner/' +
                                        signatures[i]?.sign.signCode
                                    )
                                  }}
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>

                              {/* to show which chain it is deployed on  */}
                              <div
                                className={[
                                  'mt-3 flex flex-row items-center justify-start p-3',
                                  Style.cardrectangle2,
                                ].join(' ')}
                              >
                                {/* indication */}
                                <Image
                                  src={PolygonMiniLogo}
                                  className="h-[24px] w-[24px]"
                                />
                                {/* text zone */}
                                <div className="flex flex-col">
                                  <p
                                    className={[
                                      ' ml-4 text-[10px]',
                                      Style.hinttext,
                                    ].join(' ')}
                                  >
                                    Yet to deploy on{' '}
                                    {signatures[i]?.sign.signChain} testnet
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </>
                    ))
                  ) : (
                    <p>loading</p>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            // no draft signatures yet, deploy one?
            <div className="flex w-[100%] flex-col items-center justify-center py-2">
              <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                {/* Feels empty. Create a signature */}
                <div className="flex h-[442px] w-[720px] flex-col items-center justify-center rounded-3xl bg-white">
                  <Image
                    src={ghost}
                    alt="Ghost"
                    className="mx-auto h-32 w-32"
                  />
                  <h1 className={['mt-3', Style.alert_p].join(' ')}>
                    Feels empty over here. Create a new signature
                  </h1>
                  <button
                    className="mt-5 rounded-lg bg-black py-4 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                    onClick={() => {
                      window.location.href = '/create-esign'
                    }}
                  >
                    Create new Esign
                  </button>
                </div>
              </main>
            </div>
          )}
        </div>

        <ToastContainer />
      </div>
    </>
  )
}

export default CastSignature
