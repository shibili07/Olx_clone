import React, { useState } from 'react'
import { Modal, ModalBody } from 'flowbite-react'
import Input from '../input/Input'
import {useAuth} from "../Context/Auth"
import { addDoc, collection } from 'firebase/firestore'
import { fetchFromFireStore, fireStore } from '../Firebase/Firebase'

import fileUpload from '../../assets/fileUpload.svg'
import loading from "../../assets/loading.gif"
import close from "../../assets/close.svg"
function Sell(props) {
    const {setItems,toggleModalSell,status,} = props  

    const [title,setTitle] = useState("")
    const [category,setCategory] = useState("")
    const [price,setPrice] = useState(0)
    const [description,setDescription] = useState("")
    const [image,setImage] = useState(null)
    const [submitting,setSubmitting] = useState(false)
    const [errors, setErrors] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
        image: ''
    })

    const auth  = useAuth();
    const handleImageUpload = (event) =>{
        if(event.target.files) setImage(event.target.files[0])
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            title: '',
            category: '',
            price: '',
            description: '',
            image: ''
        }

        if (!title.trim()) {
            newErrors.title = 'Title is required'
            isValid = false
        } else if (title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters'
            isValid = false
        }

        if (!category.trim()) {
            newErrors.category = 'Category is required'
            isValid = false
        }

        if (!price) {
            newErrors.price = 'Price is required'
            isValid = false
        } else if (isNaN(price) || price <= 0) {
            newErrors.price = 'Price must be a valid positive number'
            isValid = false
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required'
            isValid = false
        } else if (description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters'
            isValid = false
        }

        if (!image) {
            newErrors.image = 'Image is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        if(!auth?.user){
            alert("Please Login to continue")
            return;
        }

        if (!validateForm()) {
            return;
        }

        setSubmitting(true)

        const readImageAsDataUrl = (file) => {
            return new Promise((resolve,reject)=>{
                const reader = new FileReader()
                reader.onloadend = () =>{
                    const imageUrl = reader.result
                    localStorage.setItem(`image_${file.name}`,imageUrl)
                    resolve(imageUrl)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })

        }
        let imageUrl = ''
        if(image){
            try {
                imageUrl = await readImageAsDataUrl(image)
            } catch (error) {
                console.log(error);
                alert('failed to read image')
                return;
            }
        }
        const trimmedTitle = title.trim()
        const trimmedCategory = category.trim()
        const trimmedDescription = description.trim()
        if( !trimmedCategory || !trimmedTitle || !trimmedDescription){
            alert("All fields are required")
            setSubmitting(false)
            return;
        }
        
        try {
            await addDoc(collection(fireStore,'Products'),{
                title:trimmedTitle,
                category:trimmedCategory,
                price,
                imageUrl,
                description:trimmedDescription,
                userId:auth.user.uid,
                userName:auth.user.displayName || 'Anonymous',
                createAt : new Date()
            })
            const datas = await fetchFromFireStore()
            setItems(datas)
            toggleModalSell()
        } catch (error) {
            console.log(error);
            alert("failed to add items to the firestore")
            
        }finally{
            setSubmitting(false)
        }

    }
  return (
    <div>
        <Modal theme={{
            "content": {
                "base" :"relative w-full p-4 md:h-auto",
                "inner":"relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
            },
        }} onClick={toggleModalSell} show={status} className='bg-black' position={'center'} size='md' popup={true}>
            <ModalBody className='bg-white h-96 p-0 rounded-md overflow-y-auto' onClick={(event)=>event.stopPropagation()}> 
                <img onClick={()=>{
                    toggleModalSell()
                    setImage(null)
                }} className="w-6 absolute z-10 top-6 right-8 cursor-pointer" src={close} alt="" />
                <div className='p-6 pl-8 pr-8 pb-8'>
                    <p className='font-bold text-lg mb-3'>Sell Item</p>
                    <form onSubmit={handleSubmit}> 
                        <div className="mb-3">
                            <Input setInput={setTitle} placeholder="Title"/>
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>
                        
                        <div className="mb-3">
                            <Input setInput={setCategory} placeholder="Category"/>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>
                        
                        <div className="mb-3">
                            <Input setInput={setPrice} placeholder="Price" type="number"/>
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        
                        <div className="mb-3">
                            <Input setInput={setDescription} placeholder="Description"/>
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                        
                        <div className='pt-2 w-full relative'>
                              {image ? (
                           <div className='relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden'>
                              <img src={URL.createObjectURL(image)} className='object-contain' alt="" />
                           </div>

                        ):(
                            <div className='relative h-40 sm:h-60 w-full border-2 border-black border-solid rounded-md'>
                                <input type="file" onChange={handleImageUpload} className='absolute inset-10 h-full w-full opacity-0 cursor-pointer z-30' required />
                                <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center'>
                                    <img src={fileUpload} className="w-12" alt="" />
                                    <p className='text-center text-sm pt-2'>Click to upload images</p>
                                    <p className='text-center text-sm pt-2'>SVG, PNG, JPG</p>
                                    
                                </div>

                            </div>
                        )} 
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        </div>
                      
                        {
                            submitting?
                            (
                                <div className='w-full flex h-14 justify-center pt-4 pb-2'>
                                    <img className='w-32 object-cover' src={loading} alt="" />
                                </div>

                            ):(
                                <div className='w-full pt-2'>
                                    <button className='w-full p-3 rounded-lg text-white' style={{backgroundColor:"#002f34"}}>Sell Item</button>
                                </div>
                            )
                        }
                    </form>
                </div>
            </ModalBody>

        </Modal>

      
    </div>
  )
}

export default Sell
