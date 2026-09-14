import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PetBhar Initiative',
    short_name: 'PetBhar',
    description: 'Direct grassroots community food relief and stray animal welfare.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A09',
    theme_color: '#0A0A09',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
