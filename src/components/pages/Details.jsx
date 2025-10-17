import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ItemContext } from '../Context/Item'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import ProfileDropdown from'../Modal/ProfileDropdown'

const Details = () => {
    const location = useLocation()
    const {item} = location.state || {}
    const [openModal,setModal] = useState(false)
    const [openModalSell,setModalSell] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const itemContext = ItemContext(ItemContext)
    const toggleModal = () => setModal(!openModal)
    const toggleModalSell = () => setModalSell(!openModalSell)
    const openProfileDrop = () => setOpenProfile(prev => !prev);
    const closeProfileDrop = () => setOpenProfile(false);
  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} openProfileDrop={openProfileDrop} />
      <ProfileDropdown isOpen={openProfile} onClose={closeProfileDrop} /> {/* Fixed props */}
      <Login toggleModal={toggleModal} status={openModal} />
      <div className='grid gap-0 sm:gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 p-10 px-5 sm:px-15 md:px-15 md:px-30 lg:px-40'>
          <div className='border-2 w-full rounded-lg flex justify-center overflow-hidden h-96'>
            <img className='object-cover' src={item?.imageUrl} alt={item?.title} />
          </div>
          <div className='flex flex-col relative w-full'>
            <p className='p-1 pl-0 text-2xl font-bold'>₹ {item?.price}</p>
            <p className='p-1 pl-0 text-base' >{item?.category}</p>
            <p className='p-1 pl-0 text-xl font-bold'>{item?.title}</p>
            <p className='p-1 pl-0 sm:pb-0 break-words text-ellipsis overflow-hidden w-full'>{item?.description}</p>
            <div className='w-full relative sm:relative md:absolute bottom-0 flex justify-between'>
              <p className='p-1 pl-0 font-bold'>Seller:{item?.userName}</p>
              <p className='p-1 pl-0 text-sm'>{item?.createdAt}</p>
          </div>

          </div>
      </div>
       <Sell setItems={itemContext.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
    </div>
  ) 
}

export default Details
