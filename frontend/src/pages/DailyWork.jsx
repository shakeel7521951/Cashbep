import React, { useEffect } from "react";
import { useLazyGetPointsQuery } from "../redux/userApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/userSlice";

const dailyworkarray = [
  {
    id: 1,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/profile",
  },
  {
    id: 2,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/tutorial",
  },
  {
    id: 3,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/referral",
  },
  {
    id: 4,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/survey",
  },
  {
    id: 5,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/blog",
  },
  {
    id: 6,
    work: "Visit This Website to get Points",
    link: "https://www.example.com/features",
  },
];

const DailyWork = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [triggerGetPoints, { data: pointsData, isLoading, isError, error }] =
    useLazyGetPointsQuery();

  const handleLinkClick = (event, task) => {
    event.preventDefault();

    setTimeout(() => {
      triggerGetPoints();
    }, 1000);

    window.open(task.link, "_blank");
  };

  useEffect(() => {
    if (pointsData) {
      console.log("Fetched Points Data:", pointsData?.user);
      dispatch(setProfile(pointsData?.user));
      toast.success("Claimed reward successfully!");
    }
    if (isError) {
      toast.warn(error?.data?.message);
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
      {isLoading && <p>Loading points...</p>}
    </div>
  );
};

export default DailyWork;
