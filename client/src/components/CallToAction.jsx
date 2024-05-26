import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div  className='flex flex-col sm:flex-row p-3 border border-teal-500
    justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn about fashion?</h2>
        <p className='text-gray-300 my-2'>Read these articles</p>
        <Button gradientDuoTone='greenToBlue' pill>
            <a href='https://www.linkedin.com/pulse/sigma-woman-independent-mysterious-personality-jessica-brothers/'
            target='_blank'  rel='noopener noreferrer'>
                Read now
            </a>
        </Button>
      </div>
      <div className='p-7 flex-1 my-2'>
        <img src='https://hackspirit.com/wp-content/uploads/2023/01/sigma-femme-1152x605.png'/>
      </div>
    </div>
  )
}
