import { Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {AiOutlineSearch} from 'react-icons/ai';
import { FaMoon, FaSun} from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  
  const path = useLocation().pathname;
  const location = useLocation();
  const {currentUser} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //a function to know which theme is currently used
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState('');

  //call this everytime we have a change in the location
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  }, [location.search])

  // function to sign out the user when he clicks the 'sign out' in the header
  const handleSignOut = async () => {
    try{
        const res = await fetch('/api/user/signout', {
            method: 'POST',
        })
        const data = await res.json();
        if(!res.ok){
            console.log(data.message);
        }else{
            dispatch(signOutSuccess());
        }
    }catch(error){
        console.log(error.message);

    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // change the result when the search input changes
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    
  }

  return (
    <Navbar className='border-b-2'>
      {/*create the logo*/}
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white
       '>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white
        '>Nipuni's</span>
        Blog

      </Link>
      <form onSubmit={handleSubmit}>
        {/*create the search bar */}
        <TextInput
          typeof='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </form> 
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
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
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>


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
