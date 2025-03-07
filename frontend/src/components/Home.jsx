import Dailywork from '../assets/images/DAILYWORK.png';
import myprofile from '../assets/images/MYPROFILE.png';
import wallat from '../assets/images/MYWALLET.png';
import myteam from '../assets/images/myteam.png';
import setting from '../assets/images/SETTING.png';
import About from '../assets/images/about.png';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const menuItems = [
  {
    to: '/dailywork',
    icon: (
      <img
        src={Dailywork}
        alt='Daily Work'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex items-center justify-center text-center p-4 rounded-md',
  },
  {
    to: '/profile',
    icon: (
      <img
        src={myprofile}
        alt='My Profile'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex flex-col items-center justify-center text-center p-1',
  },
  {
    to: '/wallet',
    icon: (
      <img
        src={wallat}
        alt='Wallet'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex flex-col items-center justify-center text-center p-4',
    gradientClass: 'bg-gradient-to-b from-green-50 to-green-100',
  },
  {
    to: '/team',
    icon: (
      <img
        src={myteam}
        alt='My Team'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex flex-col items-center justify-center text-center p-4',
  },
  {
    to: '/settings',
    icon: (
      <img
        src={setting}
        alt='Settings'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex flex-col items-center justify-center text-center p-4',
  },
  {
    to: '/about',
    icon: (
      <img
        src={About}
        alt='About'
        className='w-[10rem] h-[7rem] sm:w-[15rem] sm:h-[15rem] lg:w-[20rem] lg:h-[20rem]'
      />
    ),
    className: 'flex flex-col items-center justify-center text-center p-2',
  },
];

const HomePage = () => {
  const { profile } = useSelector((state) => state.user);
  const cardDetails = profile?.cardDetails;
  return (
    <div className=' flex  bg-white max-w-full'>
      {/* Main Container with max app width */}
      <div className='mx-auto bg-white   flex flex-col gap-4 items-center '>
        {/* Logo Header */}
        <p className='text-[50px] font-bold text-center text-blue-950 mb-[40px] mt-[30px]'>
          <span className='text-red-700'>C</span>ashBep
        </p>

        {/* Card Container */}

        <div
          className='  max-w-[400px]   sm:min-w-[350px] md:min-w-[400px] lg:min-w-[520px] h-[250px] w-full mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-pink-400'
          style={{
            background:
              'linear-gradient(400deg, #40E0D0 0%, #70DBB8 35%, #FF77C3 100%)',
          }}
        >
          <div className='py-[30px] px-[12px]  flex flex-col justify-between  items-center w-[100%] h-[100%] md:w-50% '>
            {/* Card Logo */}
            <p className='text-[25px] font-bold text-blue-950 self-end'>
              <span className='text-red-700'>C</span>ashBep
            </p>

            {/* Numbers Section */}
            <div className='grid grid-cols-3  gap-10 '>
              <div className='flex flex-col gap-2'>
                <div className='text-3xl font-medium text-white'>
                  {cardDetails?.cardNumber1 || 'Null'}
                </div>
                <div className='text-xs text-white/80 uppercase'>
                  Card Holder
                </div>
                <div className='text-lg font-medium text-white'>
                  {profile?.name}
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='text-3xl font-medium text-white'>
                  {cardDetails?.cardNumber2 || 'Null'}
                </div>
              </div>
              <div className='flex flex-col gap-2 items-end'>
                <div className='text-3xl font-medium text-white'>
                  {cardDetails?.cardNumber3 || 'Null'}
                </div>
                <div className='text-xs text-white/80 uppercase'>
                  User Level
                </div>
                <div className='text-sm text-white/80 font-bold mt-5'>
                  {profile?.UserLevel || 'Null'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Text */}
        <div
          className='px-4 py-2 w-full max-w-[650px]  text-md text-blue-950 font-medium bg-[#F0F0F0] rounded-xl'
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 3px',
          }}
        >
          <marquee behavior='' direction=''>
            Join 3 members in the same day and get rewards
          </marquee>
        </div>

        {/* Menu Grid */}
        <div className=' grid   flex-wrap grid-cols-2 sm:grid-cols-3  gap-[1rem] lg:gap-[4.4rem] md:gap-[3.5rem] sm:gap-[2rem]    p-4 text-blue-500 items-center justify-center font-bold mb-[9rem] '>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              className={item.className}
              icon={item.icon}
              to={item.to}
              gradientClass={item.gradientClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, to, label }) => {
  return (
    <Link
      to={to}
      className={`   flex flex-col items-center justify-center  rounded-xl bg-[#fffdfd]  transition-transform active:scale-95`}
    >
      <div className={`mb-2 `}>{icon}</div>
      <div className='text-[10px] font-bold text-gray-600'>{label}</div>
    </Link>
  );
};

export default HomePage;
