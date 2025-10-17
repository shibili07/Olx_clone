import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import AdsList from '../Lists/AdsList'
import { ItemContext } from '../Context/Item'
import { fetchFromFireStore, fetchUserItems } from '../Firebase/Firebase'
import ProfileDropdown from '../Modal/ProfileDropdown'
import { useAuth } from '../Context/Auth';


function MyAds() {
    const { user } = useAuth();

    const [openModal, setModal] = useState(false)
    const [openModalSell, setModalSell] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const toggleModal = () => { setModal(!openModal) }
    const toggleModalSell = () => { setModalSell(!openModalSell) }
    const openProfileDrop = () => setOpenProfile(prev => !prev);
    const closeProfileDrop = () => setOpenProfile(false);
    const itemContext = ItemContext(ItemContext) //refers to context values

     useEffect(() => {
    const getUserAds = async () => {
      if (!user) return;
      const datas = await fetchUserItems(user.uid);
      setItems?.(datas);
    };
    getUserAds();
  }, [user]);

  const refreshItems = async () => {
    if (!user) return;
    const datas = await fetchUserItems(user.uid);
    setItems?.(datas);
  }

    useEffect(() => {
        console.log("updated Items:", itemContext.items);
    }, [itemContext.items])

    return (
        <div>
            <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} openProfileDrop={openProfileDrop} />
            <ProfileDropdown isOpen={openProfile} onClose={closeProfileDrop} />  {/* Fixed props */}
            <Login toggleModal={toggleModal} status={openModal} />
            <Sell setItems={itemContext.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
          <AdsList ads={itemContext.items} setAds={itemContext.setItems} />


        </div>
    )
}

export default MyAds
