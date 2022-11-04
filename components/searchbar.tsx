import React from 'react'
import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Style from '../styles/searchbar.module.css'

const Searchbar: NextPage = () => {
  return (
    <div className={[" mt-[7%] flex h-10 w-[60%] flex-row items-center rounded-r-[10px] rounded-l-[10px] bg-white p-5", Style.searchbar].join(" ")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        className="h-10 w-full px-4 py-2 outline-none"
        placeholder="Search"
      />
    </div>
  )
}

export default Searchbar
