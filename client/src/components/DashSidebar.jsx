import {Sidebar} from 'flowbite-react';
import { HiArrowSmRight, HiUser} from 'react-icons/hi';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function DashSidebar(){
    const location = useLocation();
  //create a state called tab
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();

  useEffect( () => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab'); 
    
    //change the state of the tab
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  
  }, [location.search]);

  // function to sign out the user when he clicks the 'sign out' in the sidebar
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

    return (
        <div className='h-full'>
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {/*Profile*/}
                    <Link to='/dashboard?tab=profile'>
                   <Sidebar.Item active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>
                    Profile
                    </Sidebar.Item>
                    </Link>
                    {/*Profile*/}
                    <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                    </Sidebar.Item> 
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
        </div>
    )
}