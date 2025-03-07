import { useEffect } from "react";
import { useLazyGetPointsQuery } from "../redux/userApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/userSlice";
import { useGetAllTaskQuery } from "../redux/taskApi";

const DailyWork = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { data } = useGetAllTaskQuery();
  const [triggerGetPoints, { data: pointsData, isError, error }] = useLazyGetPointsQuery();

  const dailyworkarray = Array.isArray(data?.tasks) ? data.tasks : [];

  const handleLinkClick = (event, task) => {
    event.preventDefault();

    setTimeout(() => {
      triggerGetPoints();
    }, 1000);

    window.open(task.link, "_blank");
  };

  useEffect(() => {
    if (pointsData) {
      dispatch(setProfile(pointsData?.user));
      toast.success("Claimed reward successfully!");
    }
    if (isError) {
      toast.warn(error?.data?.message || "Something went wrong!");
    }
  }, [pointsData, isError, error, dispatch]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-4 items-center py-20">
      <h1 className="text-2xl sm:text-5xl font-bold text-center">Daily Work <span className=" text-[#b39c2a]">Tasks</span> </h1>
      {profile?.eligible ? (
        <div className="flex flex-col gap-3 w-full">
          {dailyworkarray.map((task) => (
            <div
              key={task.id}
              className="p-4 border w-[350px] mx-auto border-black rounded-lg flex flex-col  items-center"
            >
              <p className="text-red-600">{task.work}</p>
              <a href={task.link} onClick={(e) => handleLinkClick(e, task)} className="relative inline-flex items-center justify-start px-6 py-3 border border-black overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                <span className="w-48 h-48 rounded rotate-[-40deg]  bg-[#b39c2a] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Today-Task</span>
              </a>

            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-lg" >
          <p className="text-red-600 text-lg font-semibold text-center">
            Please invest at least 1000 to start earning points.
          </p>
          <button >
            <a className="relative inline-flex items-center justify-start px-8 text-nowrap py-3 border border-black overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
              <span className="w-48 h-48 rounded rotate-[-40deg]  bg-[#b39c2a] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Invest</span>
            </a>
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyWork;
