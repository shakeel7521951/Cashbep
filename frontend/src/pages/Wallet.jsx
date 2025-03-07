import React from 'react';
import { useSelector } from 'react-redux';
import {
  useChangeBepCoinMutation,
  useChangeExtraBepCoinMutation,
} from '../redux/userApi';
import { toast } from 'react-toastify';
import { setProfile } from '../redux/userSlice';

function Wallet() {
  const { profile } = useSelector((state) => state?.user);
  console.log('profile', profile?.referredPoints);
  const refferedPoint = profile?.referredPoints?.reduce((acc, curr) => {
    return (acc += curr.points);
  }, 0);
  console.log('reffered', refferedPoint);
  const [getBep, { isLoading }] = useChangeBepCoinMutation();
  const [getExtraBep] = useChangeExtraBepCoinMutation();
  const handleBepCoins = async () => {
    if (profile?.dailyPoints?.totalPoints) {
      try {
        const res = await getBep(profile?._id).unwrap();
        console.log(res);
        setProfile(res?.user);
        toast.success(res?.message);
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message);
      }
    } else {
      toast.warn(
        'You currently have no BEP coins available to exchange. Please claim your reward first.'
      );
    }
  };
  const handleExtraBep = async () => {
    if (refferedPoint) {
      try {
        const res = await getExtraBep(profile?._id).unwrap();
        console.log(res);
        setProfile(res?.user);
        toast.success(res?.message);
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message);
      }
    } else {
      toast.warn(
        'You currently do not have any referral links. Start sharing to earn extra coins!'
      );
    }
  };

  return (
    <div>
      <p className='text-[60px] font-bold text-center text-blue-950 mb-[5rem] mt-3'>
        <span className='text-red-700'>C</span>ashBep
      </p>
      <section>
        <div className='container mx-auto px-4 mb-10 flex flex-col items-center justify-center gap-4'>
          <div className='flex gap-4 text-center'>
            <span className='flex-1'>
              <h3 className='text-xl font-bold'>BEP COIN</h3>
              <h2 id='points' className='text-xl font-medium mb-4  bep-coin'>
                {profile?.dailyPoints?.totalPoints || 0}
              </h2>
              <button
                className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={handleBepCoins}
              >
                Exchange to PKR
              </button>
            </span>
            <span className='flex-1'>
              <h3 className='text-lg font-bold '>EXTRA BEP </h3>
              <h2 id='extrapoints' className='text-xl font-bold mb-4 bep-coin'>
                {refferedPoint || 0}
              </h2>
              <button
                className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={handleExtraBep}
              >
                Exchange to PKR
              </button>
            </span>
          </div>
          <div>
            <span className='flex-1 text-center flex flex-col gap-4'>
              <h3 id='balance' className='text-4xl font-bold'>
                {profile?.convertedPointsInPKR || 0}
              </h3>
              <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                Get In Your Bank
              </button>
            </span>
          </div>

          {/* <div className='w-full lg:w-3/6 lg:mx-auto relative shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-center text-black border border-gray-200 mb-10'>
              <thead className='text-lg uppercase bg-green-500 head-clr'>
                <tr>
                  <th scope='col' className='py-3 px-3'>
                    Date & Time
                  </th>
                  <th scope='col' className='py-3 px-3'>
                    Amount
                  </th>
                  <th scope='col' className='py-3 px-3'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Wallet;
