import { useState } from 'react'
import Home from './components/pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Details from './components/pages/Details'
import MyAds from './components/pages/MyAds'
import Wishlist from './components/pages/Wishlist'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path='/details' element={<Details/>}/>
        <Route path='/myads' element={<MyAds/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

