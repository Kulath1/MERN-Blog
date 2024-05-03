import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Signup() {
  // State to hold the form data, error message, and loading state
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize navigate for routing
  const navigate = useNavigate();

  // Event handler for form input changes
  const handleChange = (e) => {
    // Update the formData state with new input values
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      // Set error message if any fields are missing
      return setErrorMessage('Please fill out all fields');
    }

    try {
      // Set loading state to true and clear previous error messages
      setLoading(true);
      setErrorMessage(null);

      // Make POST request to the sign-up endpoint
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Parse JSON response from the API
      const data = await res.json();

      // Handle API response
      if (data.success === false) {
        // Set error message if the response indicates failure
        return setErrorMessage(data.message);
      }

      // Reset loading state and navigate to the sign-in page if the response was successful
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      // Set error message and reset loading state if an exception occurs
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left section: branding and information */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Sahand's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>

        {/* Right section: form and sign-up options */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            {/* Username input field */}
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>

            {/* Email input field */}
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='Email'
                id='email'
                onChange={handleChange}
              />
            </div>

            {/* Password input field */}
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>

            {/* Sign Up button with loading state handling */}
            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>
                    Loading...
                  </span>
                </>
              ) : 'Sign Up'}
            </Button>

            {/* OAuth component for third-party authentication */}
            <OAuth />
          </form>

          {/* Sign-in link */}
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>

          {/* Display error message if there is an error */}
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
