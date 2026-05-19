import type { BookmarkMap } from '@/types/bookmark';
import type { Course } from '@/types/course';

export type CourseListState = {
  items: Course[];
  searchQuery: string;
  bookmarks: BookmarkMap;
};

export type PublicUser = {
  id: string;
  fullName: string;
};

export type RawPublicProduct = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  price?: number;
  rating?: number;
};
