import { FaHome, FaUser } from 'react-icons/fa';
import { MdMarkEmailRead } from 'react-icons/md';
import { FaArrowCircleRight } from 'react-icons/fa';
import { useLogoutMutation } from '../redux/userApi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from '../redux/userSlice';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function BottomBar() {
  const [logoutFunc] = useLogoutMutation();
  const { profile } = useSelector((state) => state.user);
  console.log(profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await logoutFunc().unwrap();
      console.log(res);
      toast?.success(res?.message);
      dispatch(clearProfile());
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      {/* Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 bg-[#05DC81] border-t border-gray-100'>
        <div className='max-w-md mx-auto'>
          <div className='flex justify-between px-12 py-3'>
            <Link to={'/'} className='flex flex-col items-center'>
              <FaHome size={24} className='text-[#19145F]' />
            </Link>
            <Link to={'/feedback'} className='flex flex-col items-center'>
              <MdMarkEmailRead size={24} className='text-[#19145F]' />
            </Link>
            {profile ? (
              <button
                className='flex flex-col items-center'
                onClick={handleLogout}
              >
                <FaArrowCircleRight size={24} className='text-[#19145F]' />
              </button>
            ) : (
              <Link to={'/login'} className='flex flex-col items-center'>
                <FaUser size={24} className='text-[#19145F]' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
