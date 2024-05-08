import {Sidebar} from 'flowbite-react';
import { HiArrowSmRight, HiDocumentText, HiUser} from 'react-icons/hi';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


export default function DashSidebar(){
    const location = useLocation();
  //create a state called tab
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user)

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
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {/*Profile*/}
                    <Link to='/dashboard?tab=profile'>
                   <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                    Profile
                    </Sidebar.Item>
                    </Link>
                    
                    {/*Posts*/}
                    {currentUser.isAdmin && ( 
                        <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                            Posts
                        </Sidebar.Item>
                        </Link>
                        )}
                    
                    {/*Sign Out*/}
                    <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                    </Sidebar.Item> 
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
        </div>
    )
}