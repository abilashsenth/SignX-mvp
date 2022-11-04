import type { NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
import qs from 'querystring'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '../../components/sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDropzone } from 'react-dropzone'
import Lottie from 'lottie-react'
import { create } from 'ipfs-http-client'
import { sign } from 'crypto'
import Style from '../../styles/preview_sign.module.css'
import QRCode from 'react-qr-code'

import ill1 from '../../public/images/ill_1.png'
import ill2 from '../../public/images/ill_2.png'
import ill3 from '../../public/images/ill_3.png'
import loadingAnimation from '../../public/lotties/loading.json'
import doneAnim from '../../public/lotties/done_anim.json'

const PreviewDeployedSign: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [signData, setSignData] = useState<any[]>([])
  const [dataRecieved, setDataRecieved] = useState(false)
  const [auth, setAuth] = useState(false)
  const [length, setLength] = useState(0)
  const [qrLink, setQrLink] = useState('')

  const [cardVisible, setCardVisible] = useState(true)
  const [infoVisible, setInfoVisible] = useState(false)

  //animation variants
  const variantsAnim = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }
  const variantsAnimCard = {
    hidden: {
      opacity: 0,
      y: -100,
      transition: { duration: 0.5 },
      transitionEnd: { display: 'none' },
    },
    visible: { opacity: 1 },
  }

  const variantsAnimCardReverse = {
    hidden: {
      opacity: 0,
      display: 'none',
    },
    visible: {
      opacity: 1,
      y: 100,
      transition: { duration: 0.5 },
    },
  }

  const router = useRouter()

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
    if (!router.isReady) return
    connectWallet()
  }, [router.isReady])

  useEffect(() => {
    getSignDetails()
  }, [currentAccount])

  //remember in this context, signData contains signData in element 0, rest are ///signers data
  useEffect(() => {
    console.log(signData)
    console.log('there are ' + (signData.length - 1) + ' signers')
    setDataRecieved(true)
    checkDeployed()

    //execute after one second
    setTimeout(() => {
      setCardVisible(false)
    }, 1000)

    setTimeout(() => {
      if (signData.length > 0) {
        setInfoVisible(true)
      }
    }, 2000)
  }, [signData])

  const checkDeployed = () => {
    setAuth(true)
    printMap()
    console.log('generating QR')
    if (signData.length > 0) {
      var url = 'https://www.signx.dev/sign/' + signData[0].signCode
      setQrLink(url)
    }
  }

  const printMap = () => {
    console.log('printing map')
    if (signData.length > 0) {
      setLength(signData.length)
    }
  }

  function getSignDetails() {
    const { signCode: signCode } = router.query
    console.log(signCode)
    console.log('signCode from the frontend is ' + signCode)
    const url = `https://signx-backend.herokuapp.com/sign/previewsign/${signCode}`
    axios
      .get(url)
      .then((res) => {
        setSignData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function downloadDoc() {
    const url = `http://ipfs.io/ipfs/${signData[0].signDocument}`
    console.log('url is ' + url)
    window.open(url)
  }

  function openEtherScan(x: any) {
    const url = `http://etherscan.io/${x}`
    console.log('url is ' + url)
    window.open(url)
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

  function openExternalScan() {
    toast('opening external scan...')
  }

  return (
    <>
      <div className="flex">
        <Head>
          <title>SignX Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />

        {/* the saucy gradient */}
        <div
          className={[
            '-mt-18 -z-1 flex flex-col items-center justify-center py-2',
            Style.gradientbgdark,
          ].join(' ')}
        ></div>

        {/* the main content that disappears after a second */}
        <motion.div
          variants={variantsAnimCard}
          animate={cardVisible ? 'visible' : 'hidden'}
          className="z-20 flex w-[100%] flex-col items-center justify-center py-2"
        >
          {/* the step indicator */}
          <div className="mt-5">
            <ul className="steps steps-vertical text-white lg:steps-horizontal">
              <li className="step step-neutral text-white">Create Document</li>
              <li className="step step-neutral">Add Signers</li>
              <li className="step step-neutral">Upload Document</li>
              <li className="step step-neutral">Track Signs</li>
              <li className={'step step-neutral'}>Deploy onchain</li>
            </ul>
          </div>

          {/*esign unique code*/}
          {signData.length > 0 && (
            <div
              className={[
                'mt-5 flex flex-row items-center justify-start p-5',
                Style.supershadow,
              ].join(' ')}
            >
              <p className=" text-2xl font-medium">Document link:</p>
              <div className="mx-3 flex flex-row items-end border-b-2">
                <p>signx.dev/sign/{signData[0].signCode}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={() => {
                    copyToClipboard(
                      'https://www.signx.dev/api/esign/' + signData[0].signCode
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
          )}

          {/* the stacked cards */}
          <motion.div
            className="stack mt-5"
            initial="hidden"
            animate="visible"
            variants={variantsAnim}
          >
            {/* Completed UI Card */}
            <motion.div
              className="card m-[20px] min-h-[650px] w-[1005px] bg-white text-center shadow-md"
              variants={variantsAnimCard}
              animate={cardVisible ? 'visible' : 'hidden'}
            >
              <div className="card-body flex flex-col items-center justify-center">
                <Lottie
                  className="h-[300px] w-[100%] items-center justify-center"
                  animationData={doneAnim}
                  loop={true}
                />

                <h1 className={['', Style.hero_h1].join(' ')}>Sign Deployed</h1>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* the deployed signature data */}
        {signData?.length > 0 && (
          <motion.div
            className="z-20 flex w-[100%] flex-col items-center justify-center py-2"
            variants={variantsAnimCardReverse}
            animate={infoVisible ? 'visible' : 'hidden'}
          >
            {dataRecieved ? (
              <div className="flex max-w-[500px] flex-col items-center justify-center">
                {/* title of the signature */}
                <h1
                  className={['mb-5 text-center', Style.deployedh1].join(' ')}
                >
                  {signData[0].signName} Deployed
                </h1>

                {/* the qr code display */}
                <div className="card flex h-[250px] w-[250px] items-center justify-center bg-base-100 shadow-xl">
                  <QRCode
                    className={[' box-border', Style.supershadow].join(' ')}
                    value={qrLink}
                    size={200}
                  />
                </div>

                {/* signx link */}
                <div
                  className={[
                    'card  mt-7 flex w-[550px] flex-row items-center justify-start p-5',
                    Style.glasscard,
                  ].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="green"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{' '}
                  <p className=" text-2xl font-medium">Sign link</p>
                  <div className="mx-3 flex flex-row items-end border-b-2">
                    <p>signx.dev/sign/{signData[0]?.signCode}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      onClick={() => {
                        copyToClipboard(
                          'https://www.signx.dev/sign/' +
                            signData[0]?.signerCode
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

                {/* blockchain hash */}
                <div
                  className={[
                    'card  mt-7 flex w-[550px] flex-row items-center justify-start p-5',
                    Style.glasscard,
                  ].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="green"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{' '}
                  <p className=" text-2xl font-medium">Sign Hash</p>
                  <div className="mx-3 flex flex-row items-end border-b-2">
                    <p>
                      {typeof signData[0]?.signOwnerAddress !== 'undefined' &&
                        (signData[0]?.signOwnerAddress).substring(0, 20 + 1) +
                          '...'}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      onClick={() => {
                        copyToClipboard(
                          'https://www.signx.dev/sign/' +
                            signData[0]?.signerCode
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

                {/* ipfs file hash */}
                <div
                  className={[
                    'card  mt-7 flex w-[550px] flex-row items-center justify-start p-5',
                    Style.glasscard,
                  ].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="green"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{' '}
                  <p className=" text-2xl font-medium">IPFS Hash</p>
                  <div className="mx-3 flex flex-row items-end border-b-2">
                    <p>
                      {typeof signData[0]?.signDocument !== 'undefined' &&
                        (signData[0]?.signDocument).substring(0, 20 + 1) +
                          '...'}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      onClick={() => {
                        downloadDoc()
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </div>
                </div>

                {/* signer tracking */}
                <div
                  className={[
                    'card  mt-7 flex w-[550px] flex-row items-center justify-start p-5',
                    Style.glasscard,
                  ].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="green"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{' '}
                  <p className=" text-center text-2xl font-medium">
                    <p>
                      There are{' '}
                      {typeof signData !== 'undefined' && signData.length - 1}{' '}
                      signers
                    </p>
                  </p>
                </div>

                {/* locate on etherscan */}
                <div
                  className={[
                    'card  mt-7 flex w-[550px] flex-row items-center justify-start p-5',
                    Style.glasscard,
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>{' '}
                  <p className=" text-2xl font-medium">Etherscan</p>
                  <div className="mx-3 flex flex-row items-end border-b-2">
                    <p>
                      {typeof signData[1]?.signerTransactionHash !==
                        'undefined' &&
                        (signData[1]?.signerTransactionHash).substring(
                          0,
                          20 + 1
                        ) + '...'}
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => {
                        openEtherScan(signData[1]?.signerTransactionHash)
                      }}
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>Loading Data</p>
              </div>
            )}
          </motion.div>
        )}

        <ToastContainer />
      </div>
    </>
  )
}

export default PreviewDeployedSign
