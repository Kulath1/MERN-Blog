import { Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai';
import { FaMoon, FaSun} from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';


export default function Header() {
  
  const path = useLocation().pathname;
  const {currentUser} = useSelector(state => state.user);
  const dispatch = useDispatch();

  //a function to know which theme is currently used
  const { theme } = useSelector((state) => state.theme);

  return (
    <Navbar className='border-b-2'>
      {/*create the logo*/}
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white
       '>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white
        '>Sahand's</span>
        Blog

      </Link>
      <form >
        
        {/*create the search bar */}
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
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
              {theme === 'light' ? <FaMoon/> : <FaSun/>}
          </Button>
          
          {currentUser ? (
            //when the currentUser exists
            //create the user avatar
            <Dropdown arrowIcon={false} inline 
              label={
                <Avatar alt='user' img={currentUser.profilePicture ||'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png' } rounded/>
                
              }>
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>

              {/* go to the user profile */}
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider/> {/* add a line */}
              <Dropdown.Item>Sign Out</Dropdown.Item>


            </Dropdown>
          ): (
            //do this when the currentUser doesn't exist
            <Link to='/sign-in'>
            <Button color='blue' outline>
                Sign In
            </Button> 
          </Link>
          )} 
        </div>
        
        {/* collapse the menu when window size is reduced */}
        <Navbar.Toggle aria-label='Toggle navigation' />
        <Navbar.Collapse>
        
        {/* creating the menu */}
        <div className='flex space-x-4'> 
        <Navbar.Link href='/' active={path === "/"} className='hover:text-indigo-700'>Home</Navbar.Link>
        <Navbar.Link href='/about' active={path === "/about"} className='hover:text-indigo-700'>About</Navbar.Link>
        <Navbar.Link href='/projects' active={path === "/projects"} className='hover:text-indigo-700'>Projects</Navbar.Link>
        </div>
      
      </Navbar.Collapse>
    </Navbar>

   
  )
}
