import { buildTransform } from 'framer-motion'
import React from 'react'

const LoadMoreDataBtn = ({state, fetchDataFucn}) => {

    if(state != null && state.totalDocs > state.results.length){
        return (
            <button 
            onClick={()=> fetchDataFucn({page: state.page + 1})}
                className='text-dark-grey p-2 px-3 hover:bg-grey/70 border border-grey rounded-full flex items-center gap-2 '
            >
                <i className='fi fi-br-rotate-right'></i>
                Load More 
            </button>
       )
    }
  
}

export default LoadMoreDataBtn