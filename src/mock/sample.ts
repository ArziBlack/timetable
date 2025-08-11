// sampleData.ts - Demo data for testing
import type { TimetableDatabase } from '../interfaces/database';

export const sampleDatabase: TimetableDatabase = {
  teachers: [
    {
      id: 'teacher-math',
      name: 'Ms. Johnson',
      subjects: ['Mathematics', 'Statistics'],
      maxPeriodsPerDay: 4,
      unavailableSlots: ['0-0'] // Not available Monday first period
    },
    {
      id: 'teacher-english',
      name: 'Mr. Smith',
      subjects: ['English', 'Literature'],
      maxPeriodsPerDay: 3,
      unavailableSlots: []
    },
    {
      id: 'teacher-science',
      name: 'Dr. Brown',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      maxPeriodsPerDay: 4,
      unavailableSlots: []
    },
    {
      id: 'teacher-history',
      name: 'Ms. Davis',
      subjects: ['History', 'Geography'],
      maxPeriodsPerDay: 3,
      unavailableSlots: []
    },
    {
      id: 'teacher-pe',
      name: 'Coach Wilson',
      subjects: ['Physical Education', 'Health'],
      maxPeriodsPerDay: 2,
      unavailableSlots: []
    }
  ],
  subjects: [
    {
      id: 'math',
      name: 'Mathematics',
      teacherId: 'teacher-math',
      periodsPerWeek: 5,
      priority: 'high',
      avoidConsecutive: false
    },
    {
      id: 'english',
      name: 'English',
      teacherId: 'teacher-english',
      periodsPerWeek: 4,
      priority: 'high',
      avoidConsecutive: false
    },
    {
      id: 'physics',
      name: 'Physics',
      teacherId: 'teacher-science',
      periodsPerWeek: 3,
      priority: 'medium',
      avoidConsecutive: true
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      teacherId: 'teacher-science',
      periodsPerWeek: 3,
      priority: 'medium',
      avoidConsecutive: true
    },
    {
      id: 'biology',
      name: 'Biology',
      teacherId: 'teacher-science',
      periodsPerWeek: 2,
      priority: 'medium',
      avoidConsecutive: false
    },
    {
      id: 'history',
      name: 'History',
      teacherId: 'teacher-history',
      periodsPerWeek: 3,
      priority: 'medium',
      avoidConsecutive: false
    },
    {
      id: 'geography',
      name: 'Geography',
      teacherId: 'teacher-history',
      periodsPerWeek: 2,
      priority: 'low',
      avoidConsecutive: false
    },
    {
      id: 'pe',
      name: 'Physical Education',
      teacherId: 'teacher-pe',
      periodsPerWeek: 2,
      priority: 'low',
      avoidConsecutive: true
    }
  ],
  blockedSlots: [],
  blockedTexts: [
    'break', 'short break', 'devotion', 'morning devotion', 
    'assembly', 'lunch', 'recess', 'closing', 'games', 
    'sports', 'free period'
  ]
};

