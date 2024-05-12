import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user)
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(comment.length > 200){
            return
        }
        
        try{
          const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: comment, postId, userId: currentUser._id})
          });
          const data = await res.json();
          // if the response was properly submitted, clear out the comment section
          if(res.ok){
            setComment('');
            setCommentError(null);
            
          }

           }catch(error){
              setCommentError(error.message)
        }
    }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-400 text-sm'>
            <p>signed in as: </p>
            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture}/>
            <Link className='text-xs text-cyan-300 hover:underline' to={'/dashboard?tab=profile'}>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className='text-sm text-teal-300 my-5 flex gap-1'>
            You must be signed in to comment
            <Link className="text-teal-100 hover:underline " to={'/sign-in'}>
                Sign In
            </Link>
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded p-3'>
            <Textarea 
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)} //an event listener to count the no of characters
            value={comment}
            />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-gray-300 text-xs'>{200-comment.length} characters remaining</p>
                <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                    Submit
                </Button>
            </div>
            {commentError && (
              <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
            )}
            
        </form>
        
      )}
    </div>
  )
}
