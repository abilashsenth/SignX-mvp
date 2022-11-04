import type { NextPage } from 'next'
import axios from 'axios'
import qs from 'querystring'
import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDropzone } from 'react-dropzone'
import Lottie from 'lottie-react'
import paperplaneAnim from '../public/lotties/paperplane.json'
import ill1 from '../public/images/ill_1.png'
import ill2 from '../public/images/ill_2.png'
import ill3 from '../public/images/ill_3.png'
import { create } from 'ipfs-http-client'
import Style from '../styles/create_esign.module.css'

const CreateEsign: NextPage = () => {
  const [file, setFile] = useState<File>()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [inputName, setInputName] = useState('')
  const [inputSignerAddress, setInputSignerAddress] = useState('')
  const [esignTitle, setEsignTitle] = useState('')
  const [signers, setSigners] = useState<any[]>([])
  const [signUniqueCode, setSignUniqueCode] = useState('')
  const [cardOneVisible, setCardOneVisible] = useState(true)
  const [cardTwoVisible, setCardTwoVisible] = useState(true)
  const [cardThreeVisible, setCardThreeVisible] = useState(true)

  const client = create('https://ipfs.infura.io:5001/api/v0')

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
    generateSignCode()
  }, [])

  useEffect(() => {
    if (file) {
      console.log('file', file)
    }
  }, [file])

  function copyToClipboard(text: string) {
    const elem = document.createElement('textarea')
    elem.value = text
    document.body.appendChild(elem)
    elem.select()
    document.execCommand('copy')
    document.body.removeChild(elem)
    toast('copied to clipboard')
  }

  function handleChangeSigner(e: React.ChangeEvent<HTMLInputElement>) {
    setInputName(e.target.value)
  }

  function handleChangeSignerWallet(e: React.ChangeEvent<HTMLInputElement>) {
    setInputSignerAddress(e.target.value)
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('title', e.target.value)
    setEsignTitle(e.target.value)
  }

  function generateSignCode() {
    axios.get('https://signx-backend.herokuapp.com/sign/generatecode').then((res) => {
      setSignUniqueCode(res.data)
      console.log('sign unique code', res.data)
    })
  }

  function addPerson() {
    console.log('signer name', inputName)
    console.log('signer wallet address', inputSignerAddress)
    //add new signer to signers array
    //the backend is designed to toLowerCase() the entire signerWallet entry
    setSigners([...signers, { name: inputName, wallet: inputSignerAddress }])
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    axios
      .post(
        `https://signx-backend.herokuapp.com/signer`,
        qs.stringify({
          signerName: inputName,
          signerWallet: inputSignerAddress,
          signCode: signUniqueCode,
        }),
        config
      )
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function deletePerson(signerWallet: string) {
    //delete signer from signers array
    setSigners(signers.filter((signer) => signer.wallet !== signerWallet))
    axios
      .delete(`https://signx-backend.herokuapp.com/signer/${signerWallet}`)
      .then((result) => {
        console.log(result.status)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onDrop = useCallback((acceptedFiles) => {
    //if user uploads more than one file send a toast
    if (acceptedFiles.length > 1) {
      toast('Please upload only one file')
    } else {
      //if user uploads a file, upload it to the server
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf', '.PDF', '.doc', '.docx'],
      'text/html': ['.html', '.htm'],
    },
  })

  async function finalizeSignature() {
    var ipfsCID = ''
    if (esignTitle !== '' && signers.length > 0 && file) {
      setLoading(true)
      try {
        const added = await client.add(file)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        ipfsCID = added.path
        console.log('ipfsCID', ipfsCID)
      } catch (error) {
        console.log('Error uploading file: ', error)
      } finally {
        //create a unique code for the entire signature
        const signerWalletArray = signers.map((signer) => signer.wallet)
        console.log(signerWalletArray)
        // Make a request for a user with a given ID
        //create the Esign entry in mongodb using post request to the api
        axios
          .post(
            `https://signx-backend.herokuapp.com/sign`,
            qs.stringify({
              signName: esignTitle,
              signOwnerAddress: currentAccount,
              signCode: signUniqueCode,
              signTimestamp: Date.now(),
              signSigners: signerWalletArray,
              signDocument: ipfsCID,
              signChain: 'rinkeby',
              signDeployed: 'false',
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          )
          .then((result) => {
            console.log(result)
            setLoading(false)
            toast('Esign created successfully')
            window.location.href = '/previewsign/' + signUniqueCode
          })
      }
    } else {
      toast('Please fill all the fields')
    }
  }

  async function onChange(e: any) {
    setFile(e.target.files[0])
    console.log('file', file)
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
              <li className={cardOneVisible ? 'step' : 'step step-neutral'}>
                Add Signers
              </li>
              <li className={cardTwoVisible ? 'step' : 'step step-neutral'}>
                Upload Document
              </li>
              <li className="step">Track Signs</li>
              <li className="step">Deploy onchain</li>
            </ul>
          </div>

          {/*esign unique code*/}
          <div
            className={[
              'mt-5 flex flex-row items-center justify-start p-5',
              Style.supershadow,
            ].join(' ')}
          >
            <p className=" text-2xl font-medium">Document link:</p>
            <div className="mx-3 flex flex-row items-end border-b-2">
              <p>signx.dev/sign/{signUniqueCode}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => {
                  copyToClipboard(
                    'https://www.signx.dev/api/esign/' + signUniqueCode
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

          {/* the stacked cards */}
          <motion.div
            className="stack mt-5"
            initial="hidden"
            animate="visible"
            variants={variantsAnim}
          >
            {/* Card one Enter Document Title*/}
            <motion.div
              className={
                'card m-[20px] h-[650px] w-[1005px] bg-white text-center shadow-md'
              }
              variants={variantsAnimCard}
              animate={cardOneVisible ? 'visible' : 'hidden'}
            >
              <div className="card-body flex flex-col items-center justify-center">
                {/* image illustration */}
                <Image src={ill1} className="p-4" />

                {/* Text description */}
                <div className="mt-5 w-[45%]">
                  <h1 className={[' text-center', Style.hero_h1].join(' ')}>
                    Create new document{' '}
                  </h1>
                  <p
                    className={[
                      'm-2 text-center text-[16px]',
                      Style.hero_p,
                    ].join(' ')}
                  >
                    {' '}
                    Fill in the data for deploying a signature. Editable until
                    finalizing the document
                  </p>
                </div>

                {/* signature title input */}
                <input
                  type="text"
                  placeholder="Enter a title for your document"
                  className="input input-bordered w-2/4 max-w-xs"
                  id="signature_title"
                  onChange={handleChangeTitle}
                />

                {/* next button */}
                <button
                  className="btn mt-10 gap-2"
                  onClick={() => {
                    setCardOneVisible(false)
                  }}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
            {/* Card Two */}
            <motion.div
              className="card m-[20px] min-h-[650px] w-[1005px] bg-white text-center shadow-md"
              variants={variantsAnimCard}
              animate={cardTwoVisible ? 'visible' : 'hidden'}
            >
              <div className="card-body flex flex-col items-center justify-center">
                {/* image illustration */}
                <Image src={ill2} className="p-4" />

                {/* Text description */}
                <div className="mt-5 w-[45%]">
                  <h1 className={[' text-center', Style.hero_h1].join(' ')}>
                    Add people to sign in{' '}
                  </h1>
                  <p
                    className={[
                      'm-2 text-center text-[16px]',
                      Style.hero_p,
                    ].join(' ')}
                  >
                    {' '}
                    Enter their wallet address / ENS and send them the sign link
                    located above this card. SignX will help them sign with ease
                  </p>
                </div>

                {/* add a person */}
                <div className=" flex flex-row items-center justify-start gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="m-3 h-5 w-6 fill-current text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>

                  <input
                    type="text"
                    id="signername"
                    onChange={handleChangeSigner}
                    className="input input-bordered w-2/5 max-w-xs"
                    placeholder="Name of the party"
                    required
                  />

                  <input
                    type="text"
                    id="signerwallet"
                    onChange={handleChangeSignerWallet}
                    className="input input-bordered w-2/5 max-w-xs"
                    placeholder="Wallet address"
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-square btn-outline"
                    onClick={() => {
                      addPerson()
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* map through signers and display them */}
                {signers.map((signer, index) => (
                  <div
                    key={signer.wallet}
                    className="mt-5 flex flex-row items-center justify-start"
                  >
                    {/* signer icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="m-3 h-5 w-6 fill-current text-gray-500 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {/* signer details */}
                    <div className="flex flex-col items-center justify-start">
                      <div>
                        <p className=" text-2xl font-medium">
                          Name: {signer.name}
                        </p>
                        <div className="mx-3 flex flex-row items-end border-b-2">
                          <p>💰Wallet: {signer.wallet}</p>
                          {/* copy icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-2 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => {
                              copyToClipboard(signer.wallet)
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          {/* delete user icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#f00"
                            strokeWidth={2}
                            onClick={() => {
                              deletePerson(signer.wallet)
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* next button */}
                <button
                  className="btn mt-10 gap-2"
                  onClick={() => {
                    setCardTwoVisible(false)
                  }}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* card 3 */}
            <motion.div
              className="card m-[20px] min-h-[650px] w-[1005px] bg-white text-center shadow-md"
              variants={variantsAnimCard}
              animate={cardThreeVisible ? 'visible' : 'hidden'}
            >
              <div className="card-body flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  {loading ? (
                    <>
                      <Lottie
                        className="h-[300px] w-[100%] items-center justify-center"
                        animationData={paperplaneAnim}
                        loop={true}
                      />
                      <h1 className={['', Style.hero_h1].join(' ')}>
                        Uploading file to IPFS
                      </h1>
                    </>
                  ) : (
                    <>
                      {/* image illustration */}
                      <Image src={ill3} className="p-4" />

                      {/* Text description */}
                      <div className="mt-5 w-[45%]">
                        <h1
                          className={[' text-center', Style.hero_h1].join(' ')}
                        >
                          Upload your file{' '}
                        </h1>
                        <p
                          className={[
                            'm-2 text-center text-[16px]',
                            Style.hero_p,
                          ].join(' ')}
                        >
                          {' '}
                          We currently support only PDF files to be used for
                          signX documents
                        </p>
                      </div>

                      {/* upload file icon */}
                      {file ? (
                        <div className="my-5 mr-5 flex h-32 w-[100%] items-center justify-center rounded border-2 border-dashed">
                          <span className="text-grey block">
                            📁Filename {file.name} <br /> 📄Size {file.size}{' '}
                            bytes <br /> 📄Type {file.type}
                          </span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#f00"
                            strokeWidth={2}
                            onClick={() => {
                              setFile(undefined)
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="my-5 mr-5 flex h-32 w-[100%] items-center justify-center rounded border-2 border-dashed">
                          <input type="file" onChange={onChange} />
                        </div>
                      )}
                      <button
                        className="m-5 w-[100%] items-center justify-center rounded-lg bg-black py-2 px-4 text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
                        onClick={() => {
                          finalizeSignature()
                        }}
                      >
                        Next
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default CreateEsign
