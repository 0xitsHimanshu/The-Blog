import { buildTransform } from 'framer-motion'
import React from 'react'

const LoadMoreDataBtn = ({state, fetchDataFucn, additonalParam}) => {

    if(state != null && state.totalDocs > state.results.length){
        return (
            <button 
            onClick={()=> fetchDataFucn({...additonalParam, page: state.page + 1})}
                className='text-dark-grey p-2 px-3 mb-3 mx-auto  hover:bg-grey/70 border border-grey rounded-full flex items-center gap-2 '
            >
                <i className='fi fi-br-rotate-right'></i>
                Load More 
            </button>
       )
    }
  
}

export default LoadMoreDataBtn