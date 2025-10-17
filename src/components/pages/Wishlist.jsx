import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import { useAuth } from '../Context/Auth'
import { getWishlistItems } from '../Firebase/Firebase'
import ProfileDropdown from '../Modal/ProfileDropdown'
import Wishlistcard from '../Lists/Wishlistcard'

function Wishlist() {
  const [openModal, setModal] = useState(false)
  const [openModalSell, setModalSell] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [wishlistItems, setWishlistItems] = useState([])
  const { user } = useAuth()

  const toggleModal = () => { setModal(!openModal) }
  const toggleModalSell = () => { setModalSell(!openModalSell) }
  const openProfileDrop = () => setOpenProfile(prev => !prev)
  const closeProfileDrop = () => setOpenProfile(false)

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        const items = await getWishlistItems(user.uid)
        setWishlistItems(items)
      }
    }
    fetchWishlist()
  }, [user])

  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} openProfileDrop={openProfileDrop} />
      <ProfileDropdown isOpen={openProfile} onClose={closeProfileDrop} />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell toggleModalSell={toggleModalSell} status={openModalSell} />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>
          <Wishlistcard items={wishlistItems} setItems={setWishlistItems} />
        </div>
      </div>
    </div>
  )
}

export default Wishlist

