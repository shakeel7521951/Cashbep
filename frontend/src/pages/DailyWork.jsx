import React, { useEffect } from "react";
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
      <h1 className="text-2xl font-bold text-center">Daily Work Tasks</h1>
      {profile?.eligible ? (
        <div className="flex flex-col gap-3 w-full">
          {dailyworkarray.map((task) => (
            <div
              key={task.id}
              className="p-4 border border-black rounded-lg flex flex-col gap-4 items-center"
            >
              <p className="text-red-600">{task.work}</p>
              <a
                href={task.link}
                className="p-2 bg-[#F579C0] text-white font-medium rounded-md"
                onClick={(e) => handleLinkClick(e, task)}
              >
                Complete Task
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-100 rounded-lg shadow-md">
          <p className="text-red-600 text-lg font-semibold text-center">
            Please invest at least 1000 to start earning points.
          </p>
          <button className="px-6 py-2 bg-[#05DC81] text-white font-medium rounded-lg hover:bg-[#63bd98] transition duration-300">
            Invest
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyWork;
