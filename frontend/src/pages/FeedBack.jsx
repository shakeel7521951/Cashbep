import React, { useState } from 'react';
import { FaUser, FaCommentDots } from 'react-icons/fa';
import { useSendFeedbackMutation } from '../redux/userApi';
import { toast } from 'react-toastify';

const FeedBack = () => {
  const [sendFeedback, { isLoading }] = useSendFeedbackMutation();
  const [formData, setFormData] = useState({
    name: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form, dara', formData.content);
    try {
      const res = await sendFeedback({ content: formData.content }).unwrap();
      console.log(res);
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
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
            Feedback
          </h3>
          <p className='text-center text-gray-600 mb-6'>
            Add your feedback to this website. We value your opinions and
            suggestions.
          </p>
          <form onSubmit={handleSubmit} className='lg:w-1/2 lg:mx-auto'>
            <div className='mb-4'>
              <label
                htmlFor='name'
                className=' font-medium text-black mb-2 text-sm flex items-center'
              >
                <FaUser className='mr-2 text-blue-700' /> Your Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='content'
                className=' font-medium text-black mb-2 text-sm flex items-center'
              >
                <FaCommentDots className='mr-2 text-yellow-500' /> Your content
              </label>
              <textarea
                name='content'
                id='content'
                rows='4'
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type='submit'
              className='text-white bg-blue-700 float-right hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-2 text-center mb-10 flex items-center'
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default FeedBack;
