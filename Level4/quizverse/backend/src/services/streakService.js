import User from '../models/User.js';

/**
 * Update a user's daily streak.
 * Call this every time a user completes a quiz.
 */
export const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const lastPlayed = user.streak?.lastPlayed;

  if (!lastPlayed) {
    // First ever play
    user.streak = { current: 1, longest: 1, lastPlayed: now };
  } else {
    const diffMs = now - new Date(lastPlayed);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already played today — no change
    } else if (diffDays === 1) {
      // Consecutive day
      user.streak.current += 1;
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }
      user.streak.lastPlayed = now;
    } else {
      // Streak broken
      user.streak.current = 1;
      user.streak.lastPlayed = now;
    }
  }

  await user.save({ validateBeforeSave: false });
  return user.streak;
};

/**
 * Get streak info for a user.
 */
export const getStreakInfo = async (userId) => {
  const user = await User.findById(userId).select('streak');
  return user?.streak || { current: 0, longest: 0, lastPlayed: null };
};
