import UserModel from '../Model/UserModel.js';
import Feedbackmodel from '../Model/Feedbackmodel.js';
import Errorhandler from '../Utils/ErrorHandler.js';
import { catchAsyncError } from '../MiddleWare/CatchAsyncError.js';

export const Signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password, referralCode } = req.body;

  let referredByUser = null;

  if (referralCode) {
    const [username, , userId] = referralCode.split('/');
    if (!username || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code format',
      });
    }

    referredByUser = await UserModel.findOne({
      referralLink: referralCode,
    });

    if (!referredByUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code',
      });
    }
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    referredBy: referredByUser ? referredByUser._id : null,
  });

  if (referredByUser) {
    referredByUser.referredPoints = referredByUser.referredPoints || [];
    referredByUser.referredPoints.push({
      userId: user._id,
      points: 1000,
    });
    await referredByUser.save();
  }

  const token = user.getJWTToken();

  res
    .status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'User Created Successfully',
      user,
    });
});

export const getReferredUserData = catchAsyncError(async (req, res, next) => {
  try {
    const { referralCode } = req.query;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required',
      });
    }

    const referredByUser = await UserModel.findOne({
      referralLink: referralCode,
    }).populate({
      path: 'referredPoints.userId',
      select: 'name email UserLevel totalPointsEarned referralLink',
    });

    if (!referredByUser) {
      return res.status(404).json({
        success: false,
        message: 'Referred user not found',
      });
    }

    const referredUsersData = [];

    for (let point of referredByUser.referredPoints) {
      if (point.userId) {
        const latestUser = await UserModel.findById(point.userId).select(
          'name email UserLevel totalPointsEarned referralLink'
        );

        if (latestUser) {
          referredUsersData.push({
            name: latestUser.name,
            email: latestUser.email,
            UserLevel: latestUser.UserLevel,
            totalPointsEarned: latestUser.totalPointsEarned,
            referralLink: latestUser.referralLink,
          });
        }
      }
    }

    if (referredUsersData.length > 0) {
      return res.status(200).json({
        success: true,
        referredUsers: referredUsersData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No referred users found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export const Login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User Not Found',
    });
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new Errorhandler('Invalid Email or Password', 401));
  }
  const token = user.getJWTToken();
  res
    .status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'User Logged In Successfully',
      user,
      token,
    });
});

export const Logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: 'User Logged Out Successfully',
  });
});

export const getallusers = catchAsyncError(async (req, res, next) => {
  const users = await UserModel.find();
  res.json({
    success: true,
    count: users.length,
    users,
  });
});

export const Myprofile = catchAsyncError(async (req, res, next) => {
  const user = await req.user;

  if (!user) {
    return next(new Errorhandler('User not logged in', 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePass = catchAsyncError(async (req, res, next) => {
  const { oldPassword, Password, ConfirmPassword } = req.body;

  if (!oldPassword || !Password || !ConfirmPassword) {
    return next(
      new Errorhandler('Please provide all the required fields', 400)
    );
  }

  let user = await UserModel.findById(req.user._id).select('+password');

  if (!user) {
    return next(new Errorhandler('User not found', 404));
  }

  const isPasswordmatch = await user.comparePassword(oldPassword);

  if (!isPasswordmatch) {
    return next(new Errorhandler('Old password is incorrect', 401));
  }

  if (Password !== ConfirmPassword) {
    return next(new Errorhandler('Passwords do not match', 400));
  }

  user.password = Password;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

export const DailyClaim = catchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new Errorhandler('User not logged in', 400));
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    return next(new Errorhandler('User not found', 404));
  }

  if(user.eligible === 'false'){
    return null
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const lastClaimDate = user.dailyPoints?.lastClaimDate
    ? user.dailyPoints.lastClaimDate.toISOString().split('T')[0]
    : null;

  if (lastClaimDate !== currentDate) {
    user.dailyPoints.count = 0;
    user.dailyPoints.lastClaimDate = new Date();
  }

  if (user.dailyPoints.count >= 5) {
    return res.status(400).json({
      success: false,
      message: 'Daily claim limit reached. Try again tomorrow.',
    });
  }

  const pointsToAdd = 20;
  user.dailyPoints.count += 1;
  user.dailyPoints.totalPoints += pointsToAdd;
  user.totalPointsEarned += pointsToAdd;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Daily points added successfully',
    dailyClaimCount: user.dailyPoints.count,
    user,
  });
});

export const investment = catchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;
  const { amount } = req.body;

  if (!userId) {
    return next(new Errorhandler('User not logged in', 400));
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    return next(new Errorhandler('User not found', 404));
  }

  if (!amount || amount < 1000) {
    return next(new Errorhandler('Amount is compulsory and must be at least 1000', 400));
  }

  user.eligible = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Investment successful. User is now eligible.',
    user,
  });
});

export const addFeedback = catchAsyncError(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new Errorhandler('Feedback content is required', 400));
  }

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(new Errorhandler('User not found', 404));
  }

  const existingFeedback = await Feedbackmodel.findOne({
    userId: req.user._id,
  });

  if (existingFeedback) {
    await Feedbackmodel.findByIdAndDelete(existingFeedback._id);
  }

  const feedback = await Feedbackmodel.create({
    userId: req.user._id,
    content,
  });

  const populatedFeedback = await Feedbackmodel.findById(feedback._id).populate(
    {
      path: 'userId',
      select: 'name email',
    }
  );

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    feedback: populatedFeedback,
  });
});

export const convertPoints = catchAsyncError(async (req, res, next) => {
  try {
    const POINTS_TO_PKR_RATE = 4;
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new Errorhandler('User not found', 404));
    }

    const totalPoints = user.dailyPoints?.totalPoints;

    if (typeof totalPoints !== 'number' || isNaN(totalPoints)) {
      return next(
        new Errorhandler('Invalid totalPoints value for the user', 400)
      );
    }

    const convertedPKR = Math.floor(totalPoints / POINTS_TO_PKR_RATE);

    user.convertedPointsInPKR += convertedPKR;
    user.dailyPoints.totalPoints = 0;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Your Bep coins have been successfully exchanged.',
      data: {
        totalPoints: user.dailyPoints.totalPoints,
        convertedPointsInPKR: user.convertedPointsInPKR,
      },
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const convertReferredPoints = catchAsyncError(async (req, res, next) => {
  try {
    const POINTS_TO_PKR_RATE = 4;
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new Errorhandler('User not found', 404));
    }

    if (
      !Array.isArray(user.referredPoints) ||
      user.referredPoints.length === 0
    ) {
      return next(
        new Errorhandler('No referred points found for the user', 400)
      );
    }

    const totalReferredPoints = user.referredPoints.reduce(
      (acc, ref) => acc + (ref.points || 0),
      0
    );

    if (typeof totalReferredPoints !== 'number' || isNaN(totalReferredPoints)) {
      return next(
        new Errorhandler('Invalid points value in referredPoints array', 400)
      );
    }

    const convertedPKR = Math.floor(totalReferredPoints / POINTS_TO_PKR_RATE);

    user.referredPoints = user.referredPoints.map((ref) => ({
      ...ref,
      points: 0,
    }));

    user.convertedPointsInPKR = (user.convertedPointsInPKR || 0) + convertedPKR;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        'The coins from your referral link have been successfully exchanged.',
      data: {
        totalReferredPoints,
        convertedPointsInPKR: user.convertedPointsInPKR,
      },
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});