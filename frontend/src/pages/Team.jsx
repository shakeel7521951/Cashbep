import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetRefferalUsersQuery } from '../redux/userApi';
import { toast } from 'react-toastify';

function Team() {
  const { profile } = useSelector((state) => state.user);
  const {
    data: referredUsers,
    error,
    isLoading,
  } = useGetRefferalUsersQuery(profile?.referralLink, {
    skip: !profile?.referralLink,
  });

  const referredUserList = referredUsers?.referredUsers || [];
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profile?.referralLink || '');
    toast.success('Referral link copied to clipboard!');
  };

  const handleDetailClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <p className='text-[60px] font-bold text-center text-blue-950 mb-[5rem] mt-3'>
        <span className='text-red-700'>C</span>ashBep
      </p>

      <section>
        <div className='container mx-auto px-4 flex flex-col items-center justify-center gap-4 mb-40'>
          <h2 className='text-3xl font-bold uppercase'>BMX</h2>
          <h2 className='text-xl font-medium uppercase'>
            Total Members: {profile?.referredPoints?.length || 0}
          </h2>
          <h2 className='text-xl font-medium uppercase'>
            Copy the Referral Link to get Referral Coins{' '}
          </h2>

          {/* Referral Link Section */}
          <div className='flex items-center w-full gap-3 lg:w-3/6 lg:mx-auto'>
            <input
              type='text'
              readOnly
              value={profile?.referralLink || 'No referral link available'}
              className='flex-grow bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700'
            />
            <button
              className='text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </div>

          {/* User Table */}
          <div className='w-full lg:w-3/6 lg:mx-auto relative shadow-md sm:rounded-lg'>
            {isLoading ? (
              <div className='flex justify-center items-center h-32'>
                <p className='text-blue-900 font-bold'>Loading...</p>
              </div>
            ) : (
              <table className='w-full text-white text-center'>
                <thead className='text-white uppercase'>
                  <tr className='border-b border-blue-800'>
                    <th className='py-3 px-3 bg-blue-900 hover:bg-blue-800'>
                      Name
                    </th>
                    <th className='py-3 px-3 bg-blue-900 hover:bg-blue-800'>
                      Level
                    </th>
                    <th className='py-3 px-3 bg-blue-900 hover:bg-blue-800'>
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referredUserList.map((user, index) => (
                    <tr
                      key={index}
                      className='border-b border-blue-800 text-black'
                    >
                      <td className='py-3 px-3'>{user?.name || 'N/A'}</td>
                      <td className='py-3 px-3'>{user?.UserLevel || 'N/A'}</td>
                      <td className='py-3 px-3'>
                        <button
                          onClick={() => handleDetailClick(user)}
                          className='text-blue-500 underline'
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h2 className='text-xl font-bold mb-4'>User Details</h2>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Name
                </label>
                <input
                  type='text'
                  value={selectedUser?.name || ''}
                  className='w-full border rounded-md p-2'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type='text'
                  value={selectedUser?.email || ''}
                  className='w-full border rounded-md p-2'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  User Level
                </label>
                <input
                  type='text'
                  value={selectedUser?.UserLevel || ''}
                  className='w-full border rounded-md p-2'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Referral Link
                </label>
                <input
                  type='text'
                  value={selectedUser?.referralLink || ''}
                  className='w-full border rounded-md p-2'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Total Points Earned
                </label>
                <input
                  type='text'
                  value={selectedUser?.totalPointsEarned || 0}
                  className='w-full border rounded-md p-2'
                  readOnly
                />
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              <button
                onClick={handleCloseModal}
                className='bg-red-500 text-white px-4 py-2 rounded-md'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;
