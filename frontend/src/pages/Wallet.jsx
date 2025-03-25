import coins from '../assets/images/coins.webp';

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
    <div className="min-h-screen md:min-h-[100vh]" style={{ background: `url(${coins})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full min-h-screen bg-[#262a31bf] p-2">

        <p className='text-2xl sm:text-5xl font-bold text-center text-white mb-10 sm:mb-10 mt-3'>
          <span className='text-[#b39c2a]'>BMX</span>Adventure
        </p>
        <section>
          <div className='container mx-auto px-4 mb-10 flex flex-col items-center justify-center gap-4'>
            <div className='flex gap-4 text-center'>
              <span className='flex-1'>
                <h3 className='text-xl sm:text-2xl font-bold text-white'>BEP COIN</h3>
                <h2 id='points' className='text-xl sm:text-2xl font-bold text-white mb-2'>
                  {profile?.dailyPoints?.totalPoints || 0}
                </h2>
                <button

                  onClick={handleBepCoins}
                >
                  <a className="relative inline-flex items-center justify-start px-6 text-nowrap py-3 border border-black overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                    <span className="w-48 h-48 rounded rotate-[-40deg]  bg-[#b39c2a] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white"> Exchange to PKR</span>
                  </a>
                </button>
              </span>
              <span className='flex-1'>
                <h3 className='text-xl sm:text-2xl font-bold text-white '>EXTRA BEP </h3>
                <h2 id='extrapoints' className='text-xl sm:text-2xl font-bold text-white mb-2 '>
                  {refferedPoint || 0}
                </h2>
                <button className=''
                  onClick={handleExtraBep}
                >
                  <a className="relative inline-flex items-center justify-start px-6 text-nowrap py-3 border border-black overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                    <span className="w-48 h-48 rounded rotate-[-40deg]  bg-[#b39c2a] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Exchange to PKR</span>
                  </a>

                </button>
              </span>
            </div>
            <div>
              <span className='flex-1 text-center flex flex-col gap-4'>
                <h3 id='balance' className='text-xl sm:text-2xl font-bold text-white'>
                  {profile?.convertedPointsInPKR || 0}
                </h3>
                <button >

                  <a className="relative inline-flex items-center justify-start px-6 text-nowrap py-3 border border-black overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                    <span className="w-48 h-48 rounded rotate-[-40deg]  bg-[#b39c2a] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Get In Your Bank</span>
                  </a>
                </button>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Wallet;
