import React, { useEffect, useState } from 'react'
import moment from 'moment';

export default function Comment({comment}) {
    const [user, setUser] = useState({});
    console.log(user);
    // called each time a comment changes
    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            }catch(error){
                console.log(error.message)
            }
        }
        getUser();
    }, [comment]);
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        {/* add a user profile picture */}
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username}/>
        </div>

       
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                 {/* add the user name */}
                <span className='font-bold mr-1 text-xs truncate'>
                    {user ? `@${user.username}`:'anonymous user'}
                </span>
                 {/* add the time the comment was created */}
                 <span className='text-gray-500 text-xs'>
                    {moment(comment.createdAt).fromNow()}
                 </span>
            </div>
            {/* add the content of the comment */}
            <p className='text-gray-400 pb-2'>{comment.content}</p>
        </div>
      
    </div>
  )
}
