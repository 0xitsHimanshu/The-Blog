import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { filterPaginationData } from '../common/filter-pagination-data'
import Loader from '../components/loader.component'
import AnimationWrapper from '../common/page-animation'
import NoDataMessage from '../components/nodata.component'
import LoadMoreDataBtn from '../components/load-more.component'
import NotificationCard from '../components/notification-card.component'

const Notifications = () => {
    const [filter, setFilter] = useState('all')
    const [notifications, setNotifications] = useState(null)
    const {userAuth, setUserAuth} = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const new_notification_available = userAuth?.new_notification_available;

    let filters = ['all', 'like', 'comment', 'reply']


    const fetchNotifications = ({page, deletedDocCount = 0}) => {

        axios.post(`${import.meta.env.VITE_SERVER_URL}/notification/notifications`, {page,filter ,deletedDocCount},{
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then( async ({data: { notifications: data}})=> {

            if(new_notification_available){
                setUserAuth({...userAuth, new_notification_available: false});
            }
            
            let formatedData = await filterPaginationData({
                state: notifications,
                data, page,
                countRoute: "/notification/all-notifications-count",
                data_to_send: {filter},
                user: accessToken

            })

            setNotifications(formatedData);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {

        if(accessToken){
            fetchNotifications({page: 1})
        }
        
    }, [accessToken,filter]);

    const handleFilter = (e) => {
        let btn = e.target;

        setFilter(btn.innerHTML);

        setNotifications(null);
    }
  
    return (
    <div> 
        <h1 className='max-md:hidden'>Recent Notifications</h1>

        <div className='my-8 flex gap-6'>
            {
                filters.map((filterName, i )=> {
                    return (
                        <button key={i}className={` py-2 ${filter === filterName ? 'btn-dark' : 'btn-light'} `}
                            onClick={handleFilter}
                        >
                            {filterName}
                        </button>
                    )
                })
            }
        </div>

        {
            notifications == null ? <Loader/> :
              <>
                {
                    notifications.results.length ? 
                     notifications.results.map((notification, i) => {
                        return (
                            <AnimationWrapper key={i} transition={{delay: i*0.08}} >
                                <NotificationCard data={notification} index={i} notificationState={{notifications, setNotifications}} />
                            </AnimationWrapper>
                        )
                     }) : <NoDataMessage message={"No Notification available"} />
                }

                <LoadMoreDataBtn state={notifications} fetchDataFucn={fetchNotifications} additonalParam={{deletedDocCount: notifications.deletedDocCount}}/>
              </>
        }

    </div>
  )
}

export default Notifications