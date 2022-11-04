import type { NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
import qs from 'querystring'
import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '../../components/sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDropzone } from 'react-dropzone'
import Lottie from 'lottie-react'
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Style from '../../styles/preview_signer.module.css'
import SignX from './SignX.json'

const PreviewSigner: NextPage = () => {
  const router = useRouter()
  const { signCode: signCode } = router.query
  const [gotSignCode, setGotSignCode] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<string>('')
  const [signer, setSigner] = useState<any>({})
  const [sign, setSign] = useState<any>({})
  const contractAddress = '0x72D6c7709f4f58b60C9ea41453a2Ed6168e02554'
  const [txhash, setTxHash] = useState('')
  const [gotTxn, setGotTxn] = useState(false)
  const [access, setAccess] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    setGotSignCode(true)
  }, [router.isReady])

  useEffect(() => {
    if (gotSignCode) {
      getSignerInfo()
    }
  }, [currentAccount])

  const getSignerInfo = () => {
    console.log('getSignerInfo:: signCode: ', signCode)
    console.log('getSignerInfo:: signerWallet: ', currentAccount)

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    axios
      .post(
        `https://signx-backend.herokuapp.com/signer/getsigner`,
        qs.stringify({
          signCode: signCode,
          signerWallet: currentAccount,
        }),
        config
      )
      .then((result) => {
        console.log(result)
        if (result.data !== 'No signer found') {
          setAccess(true)
          getSignDetails()
          if (result.data[0].signerStatus === 'signed') {
            setTxHash(result.data[0].signerTransactionHash)
            setGotTxn(true)
          }
          setSigner(result.data[0])
        } else {
          toast.error('No signer found for this wallet address');
          setAccess(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
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

  async function getSignDetails() {
    console.log('signCode from the frontend is ' + signCode)
    const url = `https://signx-backend.herokuapp.com/sign/${signCode}`
    await axios
      .get(url)
      .then((res) => {
        setSign(res.data[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function downloadDoc() {
    const url = `http://ipfs.io/ipfs/${sign.signDocument}`
    console.log('url is ' + url)
    window.open(url)
  }

  const castSignature = async () => {
    var signerWallet = signer.signerWallet
    var signCode = signer.signCode

    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signerContract = provider.getSigner()
      const contract = new ethers.Contract(
        contractAddress,
        SignX.abi,
        signerContract
      )
      const data = contract.sign(signerWallet, signCode)
      await data
      data.then(async (value: any) => {
        console.log('Transaction hash is ' + value.hash)
        setTxHash(value.hash)
        setGotTxn(true)
        await axios
          .patch(
            `https://signx-backend.herokuapp.com/signer/patchsigner`,
            qs.stringify({
              signCode: signer.signCode,
              signerStatus: 'signed',
              signerWallet: currentAccount,
              signerTransactionHash: value.hash,
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          )
          .then((result) => {
            console.log(result)
            toast('Signer signed successfully')

            //console log both
            console.log('signerWallet is ' + signerWallet)
            console.log('signCode is ' + signCode)
            //window.location.href = '/';
          })
      })
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
        {/* main div */}
        <div className="flex w-[100%] flex-col items-center justify-center py-2">
          <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <div className="flex w-[80%] flex-col items-center justify-center rounded-md bg-white px-10 shadow-md">
              {/* hey signername */}
              <div className="mt-5 ml-5 w-[50%]">
                <h1
                  className={[
                    ' text-left text-3xl font-bold',
                    Style.hero_h1,
                  ].join(' ')}
                >
                  Hey {signer.signerName}!
                </h1>
                <p className={['mt-2 text-left', Style.hero_p].join(' ')}>
                  You’ve been invited to sign on this signature, Take a look at
                  these details, and go ahead to cast your signature
                </p>
              </div>
              {/* wallet auth */}
              {currentAccount === '' || currentAccount === undefined || !access  ? (
                // havent signed in yet
                <>
                  <div>
                    <form className="flex flex-col">
                      <div className="m-6 grid gap-6 lg:grid-cols-1">
                        <div>
                          <p className=" w-[370px] text-left text-[16px]">
                            {' '}
                            Authenticate your wallet
                          </p>
                        </div>
                      </div>
                      {/* continue button */}
                      <div className="flex">
                        <button
                          className="m-5 w-[100%] items-center justify-center rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                          onClick={() => {
                            connectWallet()
                            event?.preventDefault()
                          }}
                        >
                          Authenticate Wallet
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                //current account valid and all auth done
                <>
                  <div className="w-[50%] items-center justify-center">
                    {/*Title and code of the sign*/}
                    {/* code */}
                    <div
                      className={[
                        'mt-10 flex flex-row items-center justify-start p-5',
                        Style.supershadow,
                      ].join(' ')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>

                      <p className=" text-2xl font-medium">Sign ID:</p>
                      <div className="mx-3 flex flex-row items-end border-b-2">
                        <p>signx.dev/sign/{sign.signCode}</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-2 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          onClick={() => {
                            copyToClipboard(
                              'https://www.signx.dev/api/esign/' + sign.signCode
                            )
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* title */}
                    <div
                      className={[
                        'mt-10 flex flex-row items-center justify-start p-5',
                        Style.supershadow,
                      ].join(' ')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>

                      <p className=" text-2xl font-medium">Sign Title</p>
                      <div className="mx-3 flex flex-row items-end border-b-2">
                        <p>{sign.signName}</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-2 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          onClick={() => {
                            copyToClipboard(sign.signName)
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* owner info */}
                    <div
                      className={[
                        'mt-10 flex flex-row items-center justify-start p-5',
                        Style.supershadow,
                      ].join(' ')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <p className=" text-2xl font-medium">Sign Details</p>
                      <div className="mx-3 flex flex-col items-center">
                        {/* owner address */}
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p>Sign Creator Address {sign.signOwnerAddress}</p>
                        </div>
                        {/* Sign created time*/}
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p>Sign Created On {sign.signTimestamp}</p>
                        </div>
                        {/* sign deployed chain */}
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                            />
                          </svg>
                          <p>Chain to be deployed:: {sign.signChain}</p>
                        </div>
                      </div>
                    </div>

                    {/* D0ocument info */}
                    <div
                      className={[
                        'mt-10 flex flex-row items-center justify-start p-5',
                        Style.supershadow,
                      ].join(' ')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>

                      <p className=" text-2xl font-medium">Sign Document</p>
                      <div className="flex flex-col">
                        <div className="mx-3 flex items-end">
                          <p className=" text-sm">
                            {' '}
                            Document Hash: {sign.signDocument}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-2 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => {
                              copyToClipboard(sign.signName)
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <button
                            className="m-5 w-[50%] items-center justify-center rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                            onClick={() => {
                              downloadDoc()
                            }}
                          >
                            Download Document
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-10">
                      Note: once casted signature, action can't be reverted
                    </p>
                    {gotTxn ? (
                      <>
                        <p>Your Transaction hash is: {txhash} </p>
                        <p>This signer's already casted their signature</p>
                      </>
                    ) : (
                      <>
                        <button
                          className="m-5 w-[100%] items-center justify-center rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                          onClick={() => {
                            castSignature()
                          }}
                        >
                          Cast your signature
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default PreviewSigner
