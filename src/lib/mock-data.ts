import { Timestamp } from 'firebase/firestore';
import type { Trip, Collaborator } from './types';
import { placeholderImages } from './placeholder-images';

const getPlaceholderImage = (id: string) => {
  const img = placeholderImages.find(p => p.id === id);
  if (!img) return { imageUrl: 'https://picsum.photos/seed/default/600/400', imageHint: 'landscape' };
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
};

export const collaborators: Collaborator[] = [
  { id: '1', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '2', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: '3', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: '4', name: 'Diana', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Romantic Getaway to Paris',
    destination: 'Paris, France',
    startDate: Timestamp.fromDate(new Date('2024-10-12')),
    endDate: Timestamp.fromDate(new Date('2024-10-19')),
    ...getPlaceholderImage('trip-paris'),
    ownerId: 'user1',
    collaboratorIds: ['1', '2'],
  },
  {
    id: '2',
    name: 'Autumn in Kyoto',
    destination: 'Kyoto, Japan',
    startDate: Timestamp.fromDate(new Date('2024-11-05')),
    endDate: Timestamp.fromDate(new Date('2024-11-12')),
    ...getPlaceholderImage('trip-japan'),
    ownerId: 'user1',
    collaboratorIds: ['1', '3', '4'],
  },
  {
    id: '3',
    name: 'Jungle Adventure',
    destination: 'Costa Rica',
    startDate: Timestamp.fromDate(new Date('2025-01-20')),
    endDate: Timestamp.fromDate(new Date('2025-01-28')),
    ...getPlaceholderImage('trip-costa-rica'),
    ownerId: 'user1',
    collaboratorIds: ['1', '4'],
  },
  {
    id: '4',
    name: 'Santorini Views',
    destination: 'Santorini, Greece',
    startDate: Timestamp.fromDate(new Date('2024-09-01')),
    endDate: Timestamp.fromDate(new Date('2024-09-08')),
    ...getPlaceholderImage('trip-greece'),
    ownerId: 'user1',
    collaboratorIds: ['1', '2', '3'],
  },
  {
    id: '5',
    name: 'City That Never Sleeps',
    destination: 'New York, USA',
    startDate: Timestamp.fromDate(new Date('2024-12-22')),
    endDate: Timestamp.fromDate(new Date('2024-12-29')),
    ...getPlaceholderImage('trip-new-york'),
    ownerId: 'user1',
    collaboratorIds: ['1', '2'],
  },
  {
    id: '6',
    name: 'Ancient Wonders',
    destination: 'Machu Picchu, Peru',
    startDate: Timestamp.fromDate(new Date('2025-06-15')),
    endDate: Timestamp.fromDate(new Date('2025-06-25')),
    ...getPlaceholderImage('trip-peru'),
    ownerId: 'user1',
    collaboratorIds: ['1'],
  },
];
