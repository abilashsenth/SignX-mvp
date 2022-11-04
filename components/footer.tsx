import React from 'react'
import Link from "next/image"
import Image from "next/image"
function Footer() {
  return (
    <footer className="text-center lg:text-left bg-gray-100 text-gray-600">
    <div className="mx-6 py-10 text-center md:text-left">
      <div className="m-10 grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="">
          <Image src={require("../assets/signX.svg")} width={100}
          height={100}/>
          <p>
          SignX helps businesses and induviduals to create and deploy blockchain based signatures.
          </p>
        </div>
        <div className="">
          <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
            Navigate
          </h6>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">About Us</a>
          </p>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">Careers</a>
          </p>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">Blog</a>
          </p>
          <p>
            <a href="#!" className="text-gray-600">Pricing</a>
          </p>
        </div>
        <div className="">
          <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
            Resources
          </h6>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">What is the blockchain</a>
          </p>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">How can signX help you</a>
          </p>
          <p className="mb-4">
            <a href="#!" className="text-gray-600">Why blockchain has signatures</a>
          </p>
          <p>
            <a href="#!" className="text-gray-600">How to write a contract</a>
          </p>
        </div>
        <div className="">
          <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
            Join our Epic News Letter
          </h6>
          <div className='grid grid-cols-2 gap-0 items-center'>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
            <label className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 text-center w-24 text-white">
              Subscribe
            </label>
          </div>
          <p className="text-sm mt-10 font-light">* Will send you weekly updates and web3 trends and updates</p>
      </div>
      </div>
    </div>
    <div className="text-center p-6 bg-gray-200">
      <span>© 2021 Copyright:</span>
      <a className="text-gray-600 font-semibold">SignX 2022. All rights reserved.</a>
    </div>
  </footer>
  )
}

export default Footer