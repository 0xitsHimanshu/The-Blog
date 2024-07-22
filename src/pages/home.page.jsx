import React from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'

const HomePage = () => {
  return (
    <AnimationWrapper>
        <section className='h-cover flex justi gap-10 '>
            
            {/* Latest blogs */}
            <div className='w-full'>

                <InPageNavigation routes={["home", "trending blogs"]}>

                </InPageNavigation>
            
            </div>
            
            {/* filters   */}
            <div>

            </div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage