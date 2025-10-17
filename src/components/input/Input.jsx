import React from 'react'

function Input(props) {
    const {setInput,placeholder} = props
  return (
    <div className='pt-2 w-full relative '>
      <input onChange={(e)=>setInput(e.target.value)} type="text" name='' id=''  className='w-full border-black rounded-md p-3 pt-4 focus:outline-none peer' required/>
      <label htmlFor="" className='absolute pl-1 pr-1 left-2.5 top-0 bg-white text-sm peer-focus:top-0 peer-focus:text-sm transition-all duration-200 peer-placeholder-shown:top-5'>{placeholder}</label>
    </div>
  )
}

export default Input
