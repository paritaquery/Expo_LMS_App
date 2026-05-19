export type BookmarkRecord = {
  courseId: string;
  createdAt: string;
};

export type BookmarkMap = Record<string, BookmarkRecord>;
