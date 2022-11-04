import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar'
import { useState, useEffect } from 'react'
import ghost from '../public/images/ghost.svg'
import qs from 'querystring'
import { ToastContainer, toast } from 'react-toastify'
import Style from '../styles/home.module.css'
import axios from 'axios'
import Searchbar from '../components/searchbar'
import PolygonMiniLogo from '../public/images/polygon_mini_logo.svg'
import EthereumMiniLogo from '../public/images/ethereum_mini_logo.svg'
import Astronaut from '../public/images/illustration_astronaut.png'
import { join } from 'path'

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [modalEnabled, setModalEnabled] = useState(false)

  //for deployed signatures
  const [signsDeployed, setSignsDeployed] = useState<any[]>([])
  const [dataRecievedDeployed, setDataRecievedDeployed] = useState(false)
  const [lengthDeployed, setLengthDeployed] = useState(0)

  //for undeployed signatures
  const [length, setLength] = useState(0)
  const [signs, setSigns] = useState<any[]>([])
  const [dataRecieved, setDataRecieved] = useState(false)

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

  useEffect(() => {
    getDeployedSigns()
    getUndeployedSigns()
    setModalEnabled(true)
  }, [currentAccount])

  useEffect(() => {
    if (signsDeployed.length > 0) {
      setDataRecievedDeployed(true)
      printMapDeployed()
    }
  }, [signsDeployed])

  useEffect(() => {
    if (signs.length > 0) {
      setDataRecieved(true)
      printMap()
    }
  }, [signs])

  const printMap = () => {
    console.log('printing map')
    if (signs.length > 0) {
      setLength(signs.length)
    }
  }

  const printMapDeployed = () => {
    console.log('printing map')
    if (signsDeployed.length > 0) {
      setLengthDeployed(signsDeployed.length)
    }
  }

  async function getUndeployedSigns() {
    console.log(currentAccount)
    await axios
      .post(
        `https://signx-backend.herokuapp.com/sign/drafts`,
        qs.stringify({
          signOwnerAddress: currentAccount,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((result) => {
        console.log(result.data)
        setSigns(result.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async function getDeployedSigns() {
    console.log(currentAccount)
    await axios
      .post(
        `https://signx-backend.herokuapp.com/sign/deployed`,
        qs.stringify({
          signOwnerAddress: currentAccount,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((result) => {
        console.log(result.data)
        if (result.data !== 'No Sign found') {
          setSignsDeployed(result.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
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
          <title>SignX Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />

        <div className="flex flex-1 flex-col gap-[100px]">
          {/* deployed signatures */}
          <div className=" mx-[20%] w-[80%] py-2 ">
            {dataRecievedDeployed ? (
              // there's deployed sign data. let's populate them
              <div className="flex  flex-col ">
                <Searchbar />

                {/* this div will be populated with the sig data in grid */}

                <div className="mt-10 flex flex-col items-start">
                  <h1 className={['text-left', Style.blackheading].join(' ')}>
                    Your deployed documents
                  </h1>
                  <p className={['mt-2 text-left', Style.alert_p].join(' ')}>
                    Documents that you have deployed to the blockchain.
                  </p>
                  <ul
                    className="mt-10"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gridGap: '18em',
                    }}
                  >
                    {signsDeployed.length > 0 ? (
                      [...Array(lengthDeployed)].map((e, i) => (
                        <>
                          {signsDeployed[i]?.signDeployed === 'true' && (
                            // the outer card
                            <li key={signsDeployed[i]._id}>
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
                                    {signsDeployed[i].signName}
                                  </p>
                                  {/* the button to open the sign doc */}
                                  <div
                                    className={[
                                      'flex items-center justify-center',
                                      Style.cardbutton,
                                    ].join(' ')}
                                    onClick={() => {
                                      window.location.href = `/sign/${signsDeployed[i].signCode}`
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
                                      {signsDeployed[i].signOwnerAddress}...
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
                                        'https://www.signx.dev/sign/' +
                                          signsDeployed[i].signCode
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
                                      Deployed on {signsDeployed[i].signChain}{' '}
                                      testnet
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
              // no deplyed signatures yet, create one?
              <div className="flex h-[100%] w-[100%] flex-col items-center justify-center py-2">
                <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                  {/* Feels empty. Create a signature */}
                  <div className="flex h-[442px] w-[720px] flex-col items-center justify-center rounded-3xl bg-white mt-[300px]">
                    <Image
                      src={ghost}
                      alt="Ghost"
                      className="mx-auto h-32 w-32"
                    />
                    <h1 className={['mt-3', Style.alert_p].join(' ')}>
                      Feels empty over here. Create a new Document
                    </h1>
                    <button
                      className="mt-5 rounded-lg bg-black py-4 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                      onClick={() => {
                        window.location.href = '/create-esign'
                      }}
                    >
                      Create new Document
                    </button>
                    <div>
                      <input
                        type="checkbox"
                        id="home-modal"
                        className="modal-toggle"
                        defaultChecked={modalEnabled}
                        onChange={() => setModalEnabled(!modalEnabled)}
                      />
                      <div className="modal">
                        <div className={['', Style.gradientbg].join('')} />
                        <div className="modal-box bg-[#fdfdfd]">
                          <div className="flex flex-col items-center justify-center">
                            <Image
                              src={Astronaut}
                              className="h-[24px] w-[24px]"
                            />
                            <h1
                              className={['m-3 p-3', Style.modalh1].join(' ')}
                            >
                              SignX is still in testnets
                            </h1>

                            <p className={['m-3', Style.modalp].join(' ')}>
                              Dear user! Thank you so much for being one of our
                              precious early stage astronauts. As we bring in
                              more and more features and refinement to this
                              product, Please keep in mind that:
                            </p>

                            <ul className={['m-3', Style.modalp].join(' ')}>
                              <li>Features might break</li>
                              <li>Refrain uploading confidential data</li>
                              <li>Never use real money, use faucet money</li>
                              <li>
                                By continuing, you agree to the privacy policy
                                of signX
                              </li>
                            </ul>
                          </div>
                          <div className="modal-action items-center justify-center">
                            <label
                              htmlFor="home-modal"
                              className={['btn', Style.rainbowBtn].join(' ')}
                            >
                              Try signX alpha
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            )}
          </div>
          <br />
          {/* pending signatures */}
          <div className=" mx-[20%] w-[80%] py-2 ">
            {dataRecieved ? (
              // there's undeployed sign data. let's populate them
              <div className="flex  flex-col ">
                <Searchbar />

                {/* this div will be populated with the sig data in grid */}

                <div className="mt-10 flex flex-col items-start">
                  <h1 className={['text-left', Style.blackheading].join(' ')}>
                    Your undeployed documents
                  </h1>
                  <p className={['mt-2 text-left', Style.alert_p].join(' ')}>
                    Documents that are yet to be deployed to the blockchain.
                  </p>
                  <ul
                    className="mt-10"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gridGap: '18em',
                    }}
                  >
                    {signs.length > 0 ? (
                      [...Array(length)].map((e, i) => (
                        <>
                          {signs[i]?.signDeployed === 'false' && (
                            // the outer card
                            <li key={signs[i]._id}>
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
                                    {signs[i].signName}
                                  </p>
                                  {/* the button to open the sign doc */}
                                  <div
                                    className={[
                                      'flex items-center justify-center',
                                      Style.cardbutton,
                                    ].join(' ')}
                                    onClick={() => {
                                      window.location.href = `/previewsign/${signs[i].signCode}`
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
                                      previewsign/{signs[i].signCode}...
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
                                        'https://www.signx.dev/previewsign/' +
                                          signs[i].signCode
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
                                      Yet to deploy on {signs[i].signChain}{' '}
                                      testnet
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
                      Feels empty over here. Create a new Document
                    </h1>
                    <button
                      className="mt-5 rounded-lg bg-black py-4 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                      onClick={() => {
                        window.location.href = '/create-esign'
                      }}
                    >
                      Create new Document
                    </button>
                  </div>
                </main>
              </div>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  )
}

export default Home
