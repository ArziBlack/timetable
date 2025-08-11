// database/types.ts
export interface Teacher {
    id: string;
    name: string;
    subjects: string[];
    maxPeriodsPerDay?: number;
    unavailableSlots?: string[]; // cellKeys like "1-3" (row-col)
  }
  
  export interface Subject {
    id: string;
    name: string;
    teacherId: string;
    periodsPerWeek: number;
    priority: 'high' | 'medium' | 'low';
    duration?: number; // in minutes, if different from default
    preferredSlots?: string[]; // preferred time slots
    avoidConsecutive?: boolean; // avoid back-to-back periods
  }
  
  export interface TimetableEntry {
    cellKey: string;
    row: number;
    col: number;
    subject?: Subject;
    teacher?: Teacher;
    customText?: string;
    day: string;
    timeSlot: string;
  }
  
  export interface TimetableDatabase {
    teachers: Teacher[];
    subjects: Subject[];
    blockedSlots: string[]; // for breaks, devotion, etc.
    blockedTexts: string[]; // texts to avoid when auto-generating
  }