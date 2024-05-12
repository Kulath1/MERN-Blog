import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Comment({comment, onLike}) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state) => state.user);
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

            {/* add the likes */}
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button type='button' onClick={() => {onLike(comment._id)}} 
                className={`text-gray-400 hover:text-blue-500 ${
                    currentUser && comment.likes.includes (currentUser._id) && '!text-blue-500'
                }`}>
                    <FaThumbsUp className='text-sm'/>
                </button>
                <p className='text-gray-400'>
                    {/* add the number of likes */}
                    {
                        comment.numberOfLikes > 0 && 
                        comment.numberOfLikes + " " + 
                        (comment.numberOfLikes === 1 ? "like" : "likes")
                    }
                </p>
            </div>
        </div>
      
    </div>
  )
}
