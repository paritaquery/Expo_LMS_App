export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorName: string;
  price?: number;
  category?: string;
  rating?: number;
  isBookmarked?: boolean;
  isEnrolled?: boolean;
};
