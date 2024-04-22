import { Button, Navbar, TextInput} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai';
import { FaMoon} from 'react-icons/fa';



export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white
       '>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white
        '>Sahand's</span>
        Blog

      </Link>
      <form >
        <TextInput
          typeof='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'

        />
        </form> 
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
              <FaMoon/>
          </Button> 
          <Link to='/sign-in'>
            <Button color="blue" outline>
                Sign In
            </Button> 
          </Link>
           
        </div>
        <Navbar.Toggle aria-label='Toggle navigation' />
        <Navbar.Collapse>
        <div className='flex space-x-4'> 
        <Navbar.Link href='/' active={path === "/"} className='hover:text-indigo-700'>Home</Navbar.Link>
        <Navbar.Link href='/about' active={path === "/about"} className='hover:text-indigo-700'>About</Navbar.Link>
        <Navbar.Link href='/projects' active={path === "/projects"} className='hover:text-indigo-700'>Projects</Navbar.Link>
        </div>
      </Navbar.Collapse>
    </Navbar>

   
  )
}
