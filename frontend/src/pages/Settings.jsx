import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaLock, FaUnlock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUpdatePasswordMutation } from '../redux/userApi';
import { useNavigate } from 'react-router';

function Settings() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    Password: '',
    ConfirmPassword: '',
  });

  const [showoldPassword, setShowoldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Password, ConfirmPassword } = formData;

    // Validate password length
    if (Password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    // Check if new password matches confirm password
    if (Password !== ConfirmPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }

    try {
      const res = await updatePassword(formData).unwrap();
      toast.success(res?.message);
      navigate('/');
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <section>
        <p className='text-[60px] font-bold text-center text-blue-950 mb-[20px] mt-3'>
          <span className='text-red-700'>C</span>ashBep
        </p>
        <div className='container mx-auto px-4 mb-40 setting-style'>
          <h3 className='uppercase text-center text-2xl mt-40 font-bold'>
            Change Password
          </h3>
          <form onSubmit={handleSubmit} className='lg:w-1/2 lg:mx-auto'>
            <div className='mb-4'>
              <label
                htmlFor='oldPassword'
                className=' font-medium text-black mb-2 text-sm flex items-center'
              >
                <FaLock className='mr-2 text-blue-700' /> Current Password
              </label>
              <div className='relative'>
                <input
                  type={showoldPassword ? 'text' : 'password'}
                  name='oldPassword'
                  id='oldPassword'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  onClick={() => setShowoldPassword(!showoldPassword)}
                >
                  {showoldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='Password'
                className=' font-medium text-black mb-2 text-sm flex items-center'
              >
                <FaUnlock className='mr-2 text-green-600' /> New Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='Password'
                  id='Password'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='ConfirmPassword'
                className=' font-medium text-black mb-2 text-sm flex items-center'
              >
                <FaKey className='mr-2 text-yellow-500' /> Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='ConfirmPassword'
                  id='ConfirmPassword'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type='submit'
              className='text-white bg-blue-700 float-right hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-2 text-center mb-10 flex items-center'
            >
              {isLoading ? 'Loading...' : 'SAVE'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Settings;
