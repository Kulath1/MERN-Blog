import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'
import Ads from '../components/Ad'

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts')
      const data = await res.json();
      setPosts(data.posts)
    }
    fetchPosts();
  }, [])
  
  return (
    <div>
      
      {/* top section */}
      <div className='flex flex-col gap-6 p-3 lg:p-28 mx-w-6xl max-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>
          Welcome to my Blog
        </h1>
        <p className='text-gray-400 text-x sm:text-sm'>
          Here you'll find a variety of articles on latest fashion trends.
        </p>

        {/* viwe all posts */}
        <Link to='/search' className='text-xs sm:text-sm text-teal-400 font-bold hover:underline'>
          View all posts
        </Link>
      </div>

      {/* call to action */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>

      {/* display the posts */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>
              Recent Posts
            </h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link to={'/search'} className='text-teal-500 hover:underline text-center text-lg'>
              View all posts
            </Link>
          </div>
          
         
        )}
      </div>

      {/* display ads */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <Ads/>
      </div>

      
    </div>
  )
}
