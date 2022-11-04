import type { NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Sidebar from '../../components/sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Style from '../../styles/preview_sign.module.css'
import Lottie from 'lottie-react'
import ill1 from '../../public/images/ill_1.png'
import ill2 from '../../public/images/ill_2.png'
import ill3 from '../../public/images/ill_3.png'
import loadingAnimation from '../../public/lotties/loading.json'
import doneAnim from '../../public/lotties/done_anim.json'

const PreviewSign: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [signData, setSignData] = useState<any[]>([])
  const [dataRecieved, setDataRecieved] = useState(false)
  const [deployable, setDeployable] = useState(false)
  const [length, setLength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [signCode, setSignCode] = useState<String>('')
  const [cardFourVisible, setCardFourVisible] = useState(true)
  const [cardFiveVisible, setCardFiveVisible] = useState(true)

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

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    connectWallet()
  }, [router.isReady])

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
    getSignDetails()
  }, [currentAccount])

  //remember in this context, signData contains signData in element 0, rest are ///signers data
  useEffect(() => {
    console.log(signData)
    console.log('there are ' + (signData.length - 1) + ' signers')
    setDataRecieved(true)
    checkDeployableState()
    printMap()
  }, [signData])

  const checkDeployableState = () => {
    console.log('checking deployable state')
    console.log(signData.length)

    if (signData.length > 1) {
      setDeployable(true)
      for (var i = 0; i < signData.length; i++) {
        if (i !== 0) {
          if (
            typeof signData[i].signerStatus === 'undefined' ||
            signData[i].signerStatus === 'pending'
          ) {
            setDeployable(false)
            return
          }
        }
      }
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
    if (typeof signCode !== 'undefined') {
      console.log('about to deploy' + signCode?.toString())
      setSignCode(signCode?.toString())
    }
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

  function copyToClipboard(text: string) {
    const elem = document.createElement('textarea')
    elem.value = text
    document.body.appendChild(elem)
    elem.select()
    document.execCommand('copy')
    document.body.removeChild(elem)
    toast('copied to clipboard')
  }

  function deploySign() {
    setLoading(true)
    //axios post request
    var url = `https://signx-backend.herokuapp.com/sign/deploy/${signCode}`
    try {
      axios
        .post(url, {})
        .then((res) => {
          console.log(res)
          setLoading(false)
          toast('sign deployed successfully')
          setCardFourVisible(false)
          //run timer for 1 second
          setTimeout(() => {
            window.location.href = `/sign/${signCode}`
          }, 1000)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          toast('error deploying sign')
        })
    } catch (err) {
      console.log(err)
      setLoading(false)
      toast('error deploying sign')
    }
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Head>
          <title>SignX Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />

        {/* the saucy gradient */}
        <div
          className={[
            '-mt-18 -z-1 flex flex-col items-center justify-center py-2',
            Style.gradientbg,
          ].join(' ')}
        ></div>

        {/* the main content */}
        <div className="z-20 flex w-[100%] flex-col items-center justify-center py-2">
          {/* the step indicator */}
          <div className="mt-5">
            <ul className="steps steps-vertical text-white lg:steps-horizontal">
              <li className="step step-neutral text-white">Create Document</li>
              <li className="step step-neutral">Add Signers</li>
              <li className="step step-neutral">Upload Document</li>
              <li className="step step-neutral">Track Signs</li>
              <li className={cardFiveVisible ? 'step' : 'step step-neutral'}>
                Deploy onchain
              </li>
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
            {/* Card four*/}
            <motion.div
              className={
                'card m-[20px] min-h-[650px] w-[1005px] bg-white text-center shadow-md'
              }
              variants={variantsAnimCard}
              animate={cardFourVisible ? 'visible' : 'hidden'}
            >
              {signData.length > 0 ? (
                <div className="card-body flex flex-col items-center justify-center">
                  {/* image illustration */}
                  <Image src={ill1} className="p-4" />

                  {/* Text description */}
                  <div className="mt-5 w-[45%]">
                    <h1 className={[' text-center', Style.hero_h1].join(' ')}>
                      Track {signData[0].signName} progress{' '}
                    </h1>
                    <p
                      className={[
                        'm-2 text-center text-[16px]',
                        Style.hero_p,
                      ].join(' ')}
                    >
                      {' '}
                      Your sign is now saved in drafts. Once all signers are
                      done signing, you can deploy the document on blockchain
                    </p>
                  </div>

                  {/* detail indication bars */}
                  {dataRecieved && (
                    <div>
                      {/* Document timestamp */}
                      <div
                        className={[
                          'mt-10 flex flex-row items-center justify-start p-5',
                          Style.rightbar_track_bg,
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
                        <p className=" text-2xl font-medium text-white">
                          Document Created on {signData[0].signTimestamp}
                        </p>
                      </div>

                      {/* document deployed in IPFS */}
                      <div
                        className={[
                          'mt-10 flex flex-row items-center justify-start p-5',
                          Style.rightbar_track_bg,
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
                        <p className=" text-2xl font-medium text-white">
                          Document Deployed in IPFS
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 26 26"
                          stroke="#ffffff"
                          onClick={() => {
                            downloadDoc()
                          }}
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>

                      {signData.length > 0 ? (
                        [...Array(length)].map(
                          (e, i) =>
                            i > 0 && (
                              <div>
                                {signData[i]?.signerStatus === 'signed' ? (
                                  <div
                                    className={[
                                      'mt-10 flex flex-row items-center justify-start p-5',
                                      Style.rightbar_track_bg,
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
                                    <p className=" text-2xl font-medium text-white">
                                      {signData[i]?.signerName} Has signed!
                                    </p>
                                    <div className="mx-3 flex flex-row items-end ">
                                      <p>{signData[i]?.signerCode}</p>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mx-2 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 26 26"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        onClick={() => {
                                          copyToClipboard(
                                            'https://www.signx.dev/sign/' +
                                              signData[i]?.signerCode
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
                                ) : (
                                  <div
                                    className={[
                                      'mt-10 flex flex-row items-center justify-start p-5',
                                      Style.rightbar_track_bg,
                                    ].join(' ')}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="yellow"
                                      stroke-width="2"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>{' '}
                                    <p className=" text-2xl font-medium text-white">
                                      {signData[i]?.signerName} Hasn't signed
                                    </p>
                                    <div className="mx-3 flex flex-row items-end">
                                      {/* <p className="w-5">
                                        {signData[i]?.signerWallet}
                                      </p> */}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mx-2 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 26 26"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        onClick={() => {
                                          copyToClipboard(
                                            'https://www.signx.dev/sign/' +
                                              signData[i]?.signerWallet
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
                              </div>
                            )
                        )
                      ) : (
                        <p>loading</p>
                      )}
                    </div>
                  )}

                  {/* Deploy the Esign button */}
                  {deployable ? (
                    loading ? (
                      <div>
                        <Lottie
                          className="h-20 w-[100%] items-center justify-center"
                          animationData={loadingAnimation}
                          loop={true}
                        />
                      </div>
                    ) : (
                      <button
                        className={[
                          'mt-5 h-[73px] w-[183px] rounded-lg bg-black py-2 px-4 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300',
                          Style.hero_btn_p,
                        ].join(' ')}
                        onClick={() => {
                          deploySign()
                        }}
                      >
                        Deploy Signature
                      </button>
                    )
                  ) : (
                    <button
                      className={[
                        'mt-5 h-[73px] w-[183px] rounded-lg bg-black py-2 px-4 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300',
                        Style.hero_btn_p,
                      ].join(' ')}
                      onClick={() => {
                        toast('Please wait for all signers to finish signing')
                      }}
                    >
                      Deploy Signature
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="card-body flex flex-col items-center justify-center">
                    <p>Loading</p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Card Five */}
            <motion.div
              className="card m-[20px] min-h-[650px] w-[1005px] bg-white text-center shadow-md"
              variants={variantsAnimCard}
              animate={cardFiveVisible ? 'visible' : 'hidden'}
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
        </div>

        <ToastContainer />
      </div>
    </>
  )
}

export default PreviewSign
