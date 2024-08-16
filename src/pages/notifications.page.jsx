import React, { useState } from 'react'

const Notifications = () => {
    const [filter, setFilter] = useState('all')

    let filters = ['all', 'like', 'comment', 'reply', 'follow']
  
    return (
    <div> 
        <h1 className='max-md:hidden'>Recent Notifications</h1>

        <div className='my-8 flex gap-6'>
            {
                filters.map((filterName, i )=> {
                    return (
                        <button key={i}className={`py-2 ${filter === filterName ? 'btn-dark' : 'btn-light'} `}
                            onClick={() => setFilter(filterName)}
                        >
                            {filterName}
                        </button>
                    )
                })
            }
        </div>

    </div>
  )
}

export default Notifications