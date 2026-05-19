import { apiClient } from '@/services/api';
import type { ApiEnvelope } from '@/types/api';
import type { Course } from '@/types/course';

import type { PublicUser, RawPublicProduct } from '../types';

type RandomUsersResponse = ApiEnvelope<{
  data?: Array<{
    id?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?:
      | string
      | {
          title?: string;
          first?: string;
          last?: string;
        };
  }>;
}>;

type RandomProductsResponse = ApiEnvelope<{
  data?: Array<{
    id?: string | number;
    _id?: string;
    title?: string;
    description?: string;
    images?: string[];
    featuredImage?: string;
    category?: string;
    price?: number;
    ratings?: number;
  }>;
}>;

function mapUsers(response: RandomUsersResponse): PublicUser[] {
  const rawUsers = response.data?.data ?? [];

  return rawUsers
    .map((user) => {
      const id = user.id ?? user._id;
      if (!id) {
        return null;
      }

      const fullNameFromNameObject =
        typeof user.name === 'object' && user.name !== null
          ? [user.name.first, user.name.last].filter(Boolean).join(' ').trim()
          : '';
      const fullNameFromFields = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
      const fullNameFromNameString = typeof user.name === 'string' ? user.name.trim() : '';
      const fullName =
        fullNameFromNameString || fullNameFromNameObject || fullNameFromFields;

      return { id, fullName: fullName || 'Unknown Instructor' };
    })
    .filter((user): user is PublicUser => Boolean(user));
}

function mapProducts(response: RandomProductsResponse): RawPublicProduct[] {
  const rawProducts = response.data?.data ?? [];
  const mapped: RawPublicProduct[] = [];

  rawProducts.forEach((item) => {
    const id = item._id ?? (item.id ? String(item.id) : undefined);
    const title = item.title?.trim();
    const description = item.description?.trim();

    if (!id || !title || !description) {
      return;
    }

    const imageCandidates = [
      ...(item.images ?? []),
      ...(item.featuredImage ? [item.featuredImage] : []),
    ].filter(Boolean);

    mapped.push({
      id,
      title,
      description,
      images: imageCandidates,
      category: item.category,
      price: item.price,
      rating: item.ratings,
    });
  });

  return mapped;
}

function toCourseViewModels(users: PublicUser[], products: RawPublicProduct[]): Course[] {
  return products.map((product, index) => {
    const instructor = users[index % Math.max(users.length, 1)];

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      thumbnailUrl:
        product.images[0] ??
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
      instructorName: instructor?.fullName ?? 'Mini LMS Instructor',
      category: product.category,
      price: product.price,
      rating: product.rating,
      isBookmarked: false,
      isEnrolled: false,
    };
  });
}

export async function fetchCourseCatalog() {
  const [usersResponse, productsResponse] = await Promise.all([
    apiClient.get<RandomUsersResponse>('/api/v1/public/randomusers'),
    apiClient.get<RandomProductsResponse>('/api/v1/public/randomproducts'),
  ]);

  const users = mapUsers(usersResponse);
  const products = mapProducts(productsResponse);

  return toCourseViewModels(users, products);
}
