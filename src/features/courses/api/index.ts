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

import { ENV } from '@/config/env';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getCategoryPlaceholder(category: string | undefined, id: string): string {
  const cat = (category ?? '').toLowerCase();
  
  if (cat.includes('smartphones') || cat.includes('phone') || cat.includes('mobile')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('laptop') || cat.includes('computer') || cat.includes('notebook') || cat.includes('laptops')) {
    return 'https://images.unsplash.com/photo-1496181130204-7552cc1454b4?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('fragrance') || cat.includes('beauty') || cat.includes('skincare')) {
    return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('grocer') || cat.includes('food')) {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('decor') || cat.includes('furniture') || cat.includes('home')) {
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80';
  }
  
  const fallbacks = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80',
  ];
  
  const index = Math.abs(hashCode(id)) % fallbacks.length;
  return fallbacks[index];
}

function normalizeImageUrl(url: string | undefined, category: string | undefined, id: string): string {
  if (!url || url.includes('dummyjson.com')) {
    return getCategoryPlaceholder(category, id);
  }

  // Handle relative paths
  if (url.startsWith('/')) {
    return `${ENV.apiBaseUrl}${url}`;
  }

  // Replace localhost or 127.0.0.1 references with the public base URL
  if (url.startsWith('http://localhost:') || url.startsWith('http://127.0.0.1:')) {
    const path = url.replace(/^http:\/\/(localhost|127\.0\.0\.1):\d+/, '');
    return `${ENV.apiBaseUrl}${path}`;
  }

  return url;
}

function toCourseViewModels(users: PublicUser[], products: RawPublicProduct[]): Course[] {
  return products.map((product, index) => {
    const instructor = users[index % Math.max(users.length, 1)];

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      thumbnailUrl: normalizeImageUrl(product.images[0], product.category, product.id),
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
