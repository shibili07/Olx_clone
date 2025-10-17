import './Navbar.css'
import { useEffect } from 'react'
import logo from '../../assets/olx_logo.svg'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchWt from '../../assets/search.svg'
import avatar from '../../assets/avatar.png'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/Firebase'
import addBtn from '../../assets/addButton.png'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'


const Navbar = (props) => {
    const [user] = useAuthState(auth)
    const {toggleModal ,toggleModalSell,openProfileDrop} = props
    
  return (
    <div>
           <nav className="fixed z-50 w-full overflow-auto p-2 pl-3 pr-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white">
                <img src={logo} alt="" className='w-12' />
                <div className='relative location-search  ml-5'>
                    <img src={search} alt="" className='absolute top-4 left-2 w-5' />
                    <input placeholder='Search city, area, or locality...' className='w-[50px] sm:w-[150px] md:w-[250] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <img  src={arrow} alt="" className='absolute top-4 right-3 w-5 cursor-pointer' />
                </div>

                <div className="ml-5 mr-2 relative w-full main-search">
                    <input placeholder='Find Cars, Mobile Phones, and More...' className='w-full p-3 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <div style={{ backgroundColor: '#002f34' }} className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12">
                        <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
                    </div>
                </div>

                <div className="mx-1 sm:ml-5 sm:mr-5 relative lang">
                    <p className="font-bold mr-3" >English</p>
                    <img src={arrow} alt="" className='w-5 cursor-pointer' />
                </div>

                {user && (
                    <Link to="/wishlist" className="mx-1 sm:ml-5 sm:mr-5 relative">
                        <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                    </Link>
                )}

                {!user ? (
                    <p  onClick={toggleModal} className='font-bold underline ml-5 cursor-pointer' style={{color: '#002f34'}}>Login</p>
                ) : (
                    <div className="mx-1 sm:ml-5 sm:mr-5 relative lang" onClick={openProfileDrop}>
                     <img src={avatar} alt="" className='w-10' />
                     <img src={arrow} alt="" className='w-5 cursor-pointer' />
                    </div>
                )}

              <img src={addBtn} 
              onClick={ user ? toggleModalSell : toggleModal}
               className='w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer'
                alt="" />
                
            </nav>

            <div className='w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists'>
                <ul className='list-none flex items-center justify-between w-full'>
                    <div  className='flex flex-shrink-0'>
                        <p  className='font-semibold uppercase all-cats'> All categories</p>
                        <img className='w-4 ml-2' src={arrow} alt="" />

                    </div>

                    <li>Cars</li>
                    <li>Motorcycles</li>
                    <li>Mobile Phones</li>
                    <li>For sale : Houses & Apartments</li>
                    <li>Scooter</li>
                    <li>Commercial & Other Vehicles</li>
                    <li>For rent : Houses & Apartments</li>

                </ul>

            </div>


          
    </div>
  )
}

export default Navbar;