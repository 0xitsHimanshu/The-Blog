import React from 'react'

const Tag = ({tag}) => {
  return (
    <div className='relative p-2 mt-2 mr-2 px-5 bg-white rouunded-full inline-block hover:bg-opacity-50 pr-10'>
        <p className='outline-none' contentEditable="true">{tag}</p>
        <button className=''>

            <i className='fi fi-br-cross text-sm pointer-events-none'></i>
        </button>
    </div>
  )
}

export default Tag