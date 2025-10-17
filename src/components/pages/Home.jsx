import React,{useEffect, useState} from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import Card from "../Card/Card"
import { ItemContext } from '../Context/Item'
import { fetchFromFireStore } from '../Firebase/Firebase'
import ProfileDropdown from '../Modal/ProfileDropdown'
function Home() {
  const [openModal,setModal]  = useState(false)
  const [openModalSell,setModalSell] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const toggleModal = () =>{setModal(!openModal)}
  const toggleModalSell = () =>{setModalSell(!openModalSell)}
  const openProfileDrop = () => setOpenProfile(prev => !prev);
  const closeProfileDrop = () => setOpenProfile(false);
   const itemContext = ItemContext(ItemContext) //refers to context values

  useEffect(()=>{
     const getItems = async()=>{
       const datas = await fetchFromFireStore()
       itemContext ?.setItems(datas)
     }
     getItems()
  },[])

  useEffect(()=>{
    console.log("updated Items:", itemContext.items);
  },[itemContext.items])

 

  return (
    <div>
      <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} openProfileDrop={openProfileDrop} />
      <ProfileDropdown isOpen={openProfile} onClose={closeProfileDrop} />  {/* Fixed props */}
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems={itemContext.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
      <Card items={itemContext.items || []} />
    </div>
  )
}

export default Home
