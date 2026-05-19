import { create } from 'zustand';
import type { BookmarkMap } from '@/types/bookmark';

export type AppBootstrapStatus = 'idle' | 'bootstrapping' | 'ready';

type AppStoreState = {
  bootstrapStatus: AppBootstrapStatus;
  isOnline: boolean;
  bookmarks: BookmarkMap;
  enrolledCourseIds: string[];
  setBootstrapStatus: (status: AppBootstrapStatus) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setBookmarks: (bookmarks: BookmarkMap) => void;
  toggleBookmark: (courseId: string) => void;
  setEnrolledCourseIds: (courseIds: string[]) => void;
  toggleEnrollment: (courseId: string) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
  bootstrapStatus: 'idle',
  isOnline: true,
  bookmarks: {},
  enrolledCourseIds: [],
  setBootstrapStatus: (bootstrapStatus) => set({ bootstrapStatus }),
  setOnlineStatus: (isOnline) => set({ isOnline }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  toggleBookmark: (courseId) =>
    set((state) => {
      if (state.bookmarks[courseId]) {
        const next = { ...state.bookmarks };
        delete next[courseId];
        return { bookmarks: next };
      }

      return {
        bookmarks: {
          ...state.bookmarks,
          [courseId]: {
            courseId,
            createdAt: new Date().toISOString(),
          },
        },
      };
    }),
  setEnrolledCourseIds: (enrolledCourseIds) => set({ enrolledCourseIds }),
  toggleEnrollment: (courseId) =>
    set((state) => {
      if (state.enrolledCourseIds.includes(courseId)) {
        return {
          enrolledCourseIds: state.enrolledCourseIds.filter((id) => id !== courseId),
        };
      }

      return {
        enrolledCourseIds: [...state.enrolledCourseIds, courseId],
      };
    }),
}));
