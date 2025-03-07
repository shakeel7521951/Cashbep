import { useState } from 'react';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/userApi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../redux/userSlice';

const Login = () => {
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisisble] = useState(false);
  const dispatch = useDispatch();
  const [loginFunc] = useLoginMutation();
  // const { profile } = useSelector((state) => state?.user);
  // console.log('prof', profile);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());

    const { email, password } = data;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/; // Password must be at least 8 characters

    // Validate email and password
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const resp = await loginFunc(data).unwrap();
      console.log('reso', resp);
      toast.success(resp?.message);
      dispatch(setProfile(resp?.user));
      navigate('/');
    } catch (error) {
      toast.error(error?.data?.message);
    }

    setError('');
  };

  return (
    <div className='container h-screen mx-auto px-4  flex items-center'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg'
      >
        <p className='text-[50px] font-bold text-center text-blue-950 mb-12'>
          <span className='text-red-700'>C</span>ashBep
        </p>

        {/* Email Field */}
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block mb-2 text-sm font-medium text-[#FD2D55]'
          >
            Email
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Mail className='text-[#FD2D55] w-5 h-5' />
            </div>
            <input
              type='email'
              name='email'
              placeholder='youremail@gmail.com'
              className='block w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500'
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block mb-2 text-sm font-medium text-[#FD2D55]'
          >
            Password
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <Lock className='text-[#FD2D55] w-5 h-5' />
            </div>
            <div
              className='absolute inset-y-0 right-2 flex items-center cursor-pointer z-50'
              onClick={() => setIsPasswordVisisble(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeOff className='text-[#FD2D55] w-5 h-5' />
              ) : (
                <Eye className='text-[#FD2D55] w-5 h-5' />
              )}
            </div>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name='password'
              placeholder='********'
              className='block w-full p-2.5 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1a1235]'
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className='text-red-500 text-xs mb-4'>{error}</p>}

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full bg-[#1C085E] hover:bg-[#1a1235] text-white font-medium py-2.5 px-4 rounded-lg focus:ring-4 '
        >
          LOGIN
        </button>
        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link
              to={'/signup'}
              className='text-[#FD2D55] font-medium hover:underline'
            >
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;