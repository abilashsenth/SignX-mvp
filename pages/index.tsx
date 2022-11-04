import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { useEffect, useState } from 'react'
import Style from '../styles/index.module.css'
import Lottie from 'lottie-react'
import scrollAnimation from '../public/lotties/lottie_scroll_down_black.json'

const Home: NextPage = () => {
  // The back-to-top button is hidden at the beginning
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
  }, [])

  // This function will scroll the window to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // for smoothly scrolling
    })
  }

  return (
    <main className="w-full">
      <Head>
        <title>SignX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Navbar /> */}
      <Navbar />

      {/* header hero */}
      <div
        className={[
          'relative z-9 mt-10 self-center p-10 text-center text-[46px] font-[800] text-black md:text-[56px]',
          Style.hero_header,
        ].join(' ')}
      >
        Create Digital Signatures <br />
        powered by the blockchain
        <h1 className={[' text-pink-600 ', Style.hero_header].join(' ')}>
          {'< 30Seconds'}
        </h1>
        <p className={['mt-5 px-10 font-normal', Style.hero_p].join(' ')}>
          signX uses the latest web3 technologies to provide decentralized,
          <br /> highly secure and{' '}
          <b className="text-black">tamper proof eSign Experience</b>.
        </p>
        <button className={[Style.btn_black].join(' ')}>Get started</button>
      </div>

      {/* signX dashboard landing preview */}

      <div className="ml-20 mr-20 mt-[20%] flex place-items-center items-center justify-center md:mt-20">
        {/* dashboard image */}
        <Image
          src={require('../assets/dashboard.svg')}
          className="absolute z-10"
        />
        {/* bg gradient */}
        <div
          className={[
            'absolute z-8 h-[50%] w-[100%] max-w-[1500px] md:h-[70%] md:w-[100%] lg:h-[120%] lg:w-[95%]',
            Style.gradienthero,
          ].join(' ')}
        />
      </div>

      {/* why web3 signatures? */}
      <div>
        <div
          className={[
            'mt-[20%] self-center p-10 text-center text-[46px] font-[800] text-black md:text-[56px]',
            Style.hero_header,
          ].join(' ')}
        >
          Why web3 signatures?
          <p className={['mt-5 px-10 font-normal', Style.hero_p].join(' ')}>
            We believe web3 signatures are the next step in innovation in the
            world of <br /> digital signatures, KYC storage & proof validation.
            Scroll more to find out why!
          </p>
        </div>
        <Lottie
          className="h-20 w-[100%] items-center justify-center"
          animationData={scrollAnimation}
          loop={true}
        />
      </div>

      {/* purple mid gradient section */}
      <div
        className={[
          'mt-[60px] flex flex-col  items-center justify-center',
          Style.midgradientbg,
        ].join(' ')}
      >
        {' '}
        {/* features description outer box */}
        <div
          className={[
            'mx-10 mt-10 grid max-w-[85%] items-center justify-center gap-[5em] rounded-[30px] p-20 md:grid-cols-2 md:rounded-[134px] lg:grid-cols-2',
            Style.midfeaturebox,
          ].join(' ')}
        >
          {/* features description */}
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/pic1.svg')}
            />
            <h1
              className={[
                'text-xl font-semibold italic text-white',
                Style.features_heading,
              ].join(' ')}
            >
              Decentralized
            </h1>
            <p className={['text-lg text-white', Style.features_p].join(' ')}>
              Sign independently without <br />
              third parties, or certificate
              <br />
              authorities
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/pic2.svg')}
            />
            <h1
              className={[
                'text-xl font-semibold italic text-white',
                Style.features_heading,
              ].join(' ')}
            >
              Tamper proof
            </h1>
            <p className={['text-lg text-white', Style.features_p].join(' ')}>
              eSigns live in blockchain forever. It’s <br />
              Uneditable. Zero forgery, Zero false <br />
              signatures.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/pic3.svg')}
            />
            <h1
              className={[
                'text-xl font-semibold italic text-white',
                Style.features_heading,
              ].join(' ')}
            >
              Secure
            </h1>
            <p className={['text-lg text-white', Style.features_p].join(' ')}>
              eSigns use cryptographic hashes <br />
              deployed as smart contracts, <br />
              providing peace of mind for both <br />
              law firms & clients
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/pic4.svg')}
            />
            <h1
              className={[
                'text-xl font-semibold italic text-white',
                Style.features_heading,
              ].join(' ')}
            >
              Reliable
            </h1>
            <p className={['text-lg text-white', Style.features_p].join(' ')}>
              eSign hashes can be verified up by <br />
              any blockchain explorer or search <br />
              engine across the internet. They’re <br />
              immutable
            </p>
          </div>
        </div>
        {/* signx solves timestamp proof heading */}
        <div
          className={[
            'mt-10 self-center p-10 text-center text-[46px] font-[800] text-white md:text-[56px]',
            Style.hero_header,
          ].join(' ')}
        >
          SignX solves <br />
          timestamped proofing
          <p
            className={[
              'my-5 p-10 text-[18px] font-normal md:text-[26px]',
              Style.hero_p_white,
            ].join(' ')}
          >
            Your signature / document proof needs a source of truth to prove
            that it <br />
            has indeed been signed at a given point of time. SignX helps you
            achieve <br />
            that by leveraging the validation of blockchain
          </p>
        </div>
        {/* the three ui sneek peaks */}
        <div>
          {/* multichain compatible */}
          <div className="mt-20  flex flex-col items-center justify-center px-[20%] md:flex-row">
            <div>
              <h1
                className={[
                  'py-5 text-center text-5xl font-bold md:text-left lg:text-6xl',
                  Style.gradient_h1,
                ].join(' ')}
              >
                Multichain compatible.
              </h1>
              <p
                className={[
                  'mb-10 text-center text-[18px] md:mb-0 md:text-left lg:text-2xl',
                  Style.mid_p,
                ].join(' ')}
              >
                Deploy your signatures in your favourite <br />
                blockchain ecosystem. signX will constantly keep adding support
                for new ecosystems
                <br />
                while you can digitally sign securely, worry free 😎
              </p>
            </div>
            <Image
              width={600}
              height={600}
              className="mt-[10px] lg:mt-[0px] lg:ml-[20px]"
              src={require('../assets/multichain_compatible.svg')}
            ></Image>
          </div>

          {/* eth solana polygon logos */}
          <div className="mx-[20%] mt-20 grid grid-cols-3 gap-10">
            <Image
              src={require('../assets/ethereum.svg')}
              width={30}
              height={30}
            />
            <Image
              width={30}
              height={30}
              src={require('../assets/solana.svg')}
            />
            <Image
              width={30}
              height={30}
              src={require('../assets/polygon.svg')}
            />
          </div>

          {/* create esigns super fast */}
          <div className="mt-20 flex flex-col-reverse items-center justify-center px-[20%] md:flex-row">
            <Image
              width={850}
              height={850}
              src={require('../assets/create_esigns_easy.svg')}
            ></Image>
            <div className="ml-[5%]">
              <h1
                className={[
                  'mt-10 mb-5 self-center p-10 text-center text-[46px] font-[800] text-white md:p-0 md:text-left md:text-[56px]',
                  Style.hero_header,
                ].join(' ')}
              >
                Create eSigns super fast and easy
              </h1>
              <p
                className={[
                  'mb-10 text-center text-[18px] md:mb-0 md:text-left lg:text-2xl',
                  Style.mid_p,
                ].join(' ')}
              >
                signX offers simple yet robust tools for you to quickly get
                going. Upload a document and bind signatures to it. Creating a
                web3 signature is as easy as:
              </p>
              {/* bulletted list with checkmark icons */}
              <ul className="mt-5">
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Upload your document/file which the sign honors</p>
                </li>
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    Assign and Share instant sign links to the parties involved
                  </p>
                </li>
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Track progress and deploy your web3 signature</p>
                </li>
              </ul>
            </div>
          </div>

          {/* deploy them on chain faster */}

          <div className="mt-20 mb-[400px] flex flex-col-reverse items-center justify-center gap-10 px-[20%]  md:flex-row-reverse">
            <Image
              width={550}
              height={850}
              src={require('../assets/deploy_on_blockchain_faster.svg')}
            ></Image>
            <div className="ml-[5%]">
              <h1
                className={[
                  'mt-10 mb-5 self-center p-10 text-center text-[46px] font-[800] text-white md:p-0 md:text-left md:text-[56px]',
                  Style.hero_header,
                ].join(' ')}
              >
                Deploy signs on blockchain, faster
              </h1>
              <p
                className={[
                  'mb-10 text-center text-[18px] md:mb-0 md:text-left lg:text-2xl',
                  Style.mid_p,
                ].join(' ')}
              >
                Once you finished signing, you can now deploy the signature in
                blockchain. The signature will exist forever on-chain. You can
                track and lookup web3 signs using:
              </p>
              {/* bulletted list with checkmark icons */}
              <ul className="mt-5">
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>signX deployed signatures dashboard</p>
                </li>
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>signX link / scan QR code</p>
                </li>
                <li
                  className={['flex items-center gap-1', Style.mid_p].join(' ')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Search hash in any blockchain explorer like etherscan</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* use cases section */}
      <div className="-mt-[55%] flex flex-col items-center justify-center md:mt-[5%]">
        <div className="my-10 mx-10 text-center">
          <h1
            className={[
              'mt-10 self-center p-10 text-center text-[46px] font-[800] text-black md:text-[56px]',
              Style.hero_header,
            ].join(' ')}
          >
            Every business needs a web3 <br />
            digital signature tool🔐
          </h1>
          <p className={['mt-5 px-10 font-normal', Style.hero_p].join(' ')}>
            Agreements? Stamps of approvals? SignX works seamlessly to manage
            all your signatures in one tool,while <br />
            providing cutting edge safety and proof thanks to it’s decentralized
            nature.
            <br />
            Here are some use cases we’ve come up with:
          </p>
        </div>
        <div className="h-half mx-40">
          <Image src={require('../assets/word_cloud.svg')} />
        </div>
      </div>

      {/* Roadmap section */}
      <div className="mt-[5%] flex flex-col items-center justify-center">
        <div className="my-10 mx-10 text-center">
          <h1
            className={[
              'mt-10 self-center p-10 text-center text-[46px] font-[800] text-black md:text-[56px]',
              Style.hero_header,
            ].join(' ')}
          >
            Product Roadmap
          </h1>
          <p className={['mt-5 px-10 font-normal', Style.hero_p].join(' ')}>
            Proof validation using blockchains are here to stay! SignX is poised
            to disrupt the multi billion dollar Digital Signatures <br />
            industry, as well as enable businesses and consumers to establish
            immutable & timestamped proof effortlessly. <br />
            We are excited to share the public product roadmap for signX:
          </p>
        </div>
        <div
          className={[
            'mx-10 mt-10 flex max-w-[85%] flex-col items-center justify-center gap-[5em] p-20 lg:flex-row',
          ].join(' ')}
        >
          {/* timeline description */}
          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/tl_alpha.svg')}
            />
            <h1 className={['text-black', Style.roadmap_header].join(' ')}>
              Alpha
            </h1>
            <p className={['', Style.roadmap_p].join(' ')}>
              Our alpha MVP is already up and running.
              Currently Digital signatures can be deployed on testnets
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/tl_beta.svg')}
            />
            <h1 className={['text-black', Style.roadmap_header].join(' ')}>
              Beta
            </h1>
            <p className={['', Style.roadmap_p].join(' ')}>
              Multichains, Memberships, Deploy on mainnets & much more! We’ve
              planned something special for our early adopters!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/tl_launch.svg')}
            />
            <h1 className={['text-black', Style.roadmap_header].join(' ')}>
              Launch
            </h1>
            <p className={['', Style.roadmap_p].join(' ')}>
              SignX will be fully available to use across the world! LFG.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-5 text-center">
            <Image
              width={120}
              height={120}
              src={require('../assets/tl_grow.svg')}
            />
            <h1 className={['text-black', Style.roadmap_header].join(' ')}>
              Grow
            </h1>
            <p className={['', Style.roadmap_p].join(' ')}>
              SignX intends to venture more than just digital signatures. We aim
              to build a dashboard for anyone to establish proof using web3
              tech.
            </p>
          </div>
        </div>
      </div>

      {/* final cta section */}

      <div className="m-20 mt-0 flex h-screen place-items-center items-center justify-center">
        {/* cta content */}
        <div className={['m-10 p-20', Style.cta_box].join(' ')}>
          <div
            className={[
              'mt-10 self-center text-center text-5xl font-[800] text-white',
              Style.hero_header,
            ].join(' ')}
          >
            Deploy your first web3 Sign <br />
            <button className={["mt-[15%]",Style.btn_black].join(' ')} onClick={
              ()=>{
                window.location.href = "https://www.signx.dev/login"
              }
            }>Get started</button>
          </div>
        </div>
        {/* background box */}
        <div
          className={[
            'absolute -z-10 h-[50%] w-[100%] max-w-[1500px] md:h-[70%] md:w-[60%]',
            Style.gradienthero,
          ].join(' ')}
        />
      </div>

      {/* footer section */}
      <Footer />

      {/* scroll to top button */}
      {showButton && (
        <button onClick={scrollToTop} className="back-to-top sticky">
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
              d="M8 7l4-4m0 0l4 4m-4-4v18"
            />
          </svg>
        </button>
      )}
    </main>
  )
}

export default Home
