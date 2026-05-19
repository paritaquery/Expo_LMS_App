export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
};

export type UserStatistics = {
  enrolledCourses: number;
  bookmarkedCourses: number;
  progressPercent: number;
};
