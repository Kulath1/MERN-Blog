import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers"
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashAds from '../components/DashAds';


export default function Dashboard() {
  const location = useLocation();
  //create a state called tab
  const [tab, setTab] = useState('');

  useEffect( () => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab'); 
    
    //change the state of the tab
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="mid-w-56">
        {/*sidebar*/}
        <DashSidebar/>
      </div>
      {/* profile*/}
      {tab==='profile' && <DashProfile/> }
      {/*posts*/}
      {tab==='posts' && <DashPosts/> }
      {/*users*/}
      {tab==='users' && <DashUsers/> }
      {/*comments*/}
      {tab==='comments' && <DashComments/> }
      {/* dashboard components */}
      {tab==='dash' && <DashboardComp/> }
      {/* ads */}
      {tab === 'ads' && <DashAds />}
    </div>
  )
}
