import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

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
      {/*profile*/}
      {tab==='profile' && <DashProfile/> }
    </div>
  )
}
