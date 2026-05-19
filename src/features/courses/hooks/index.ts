import { useQuery } from '@tanstack/react-query';

import { fetchCourseCatalog } from '@/features/courses/api';

export function useCourseCatalog() {
  return useQuery({
    queryKey: ['course-catalog'],
    queryFn: fetchCourseCatalog,
  });
}
