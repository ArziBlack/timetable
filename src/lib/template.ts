// lib/template.ts
import { v4 as uuidv4 } from 'uuid';
import type { TimetableTemplate, TimetableEntry, TimetableDatabase } from '../interfaces/database';
import type { CellContent } from '../interfaces/types';
import { extractTimetableData } from './timetable';

// Save current timetable as a template
export const saveAsTemplate = (
  cellContents: Map<string, CellContent>,
  mergedCells: Map<string, any>,
  hiddenCells: Set<string>,
  columnCount: number,
  columnDurations: { [key: number]: number },
  defaultSlotDuration: number,
  name: string,
  description?: string
): TimetableTemplate => {
  // Extract timetable data
  const entries = extractTimetableData(
    cellContents,
    mergedCells,
    hiddenCells,
    columnCount,
    columnDurations,
    defaultSlotDuration
  );

  // Create template object
  const template: TimetableTemplate = {
    id: uuidv4(),
    name,
    description,
    entries,
    columnCount,
    columnDurations,
    defaultSlotDuration,
    createdAt: new Date().toISOString()
  };

  return template;
};

// Save template to database
export const saveTemplateToDatabase = (
  template: TimetableTemplate,
  database: TimetableDatabase
): TimetableDatabase => {
  // Create a copy of the database
  const updatedDatabase = { ...database };
  
  // Initialize templates array if it doesn't exist
  if (!updatedDatabase.templates) {
    updatedDatabase.templates = [];
  }
  
  // Add or update template
  const existingIndex = updatedDatabase.templates.findIndex(t => t.id === template.id);
  if (existingIndex >= 0) {
    updatedDatabase.templates[existingIndex] = template;
  } else {
    updatedDatabase.templates.push(template);
  }
  
  return updatedDatabase;
};

// Load template and apply to grid
export const applyTemplate = (
  template: TimetableTemplate
): {
  cellContents: Map<string, CellContent>;
  columnCount: number;
  columnDurations: { [key: number]: number };
  defaultSlotDuration: number;
} => {
  // Create cell contents from template entries
  const cellContents = new Map<string, CellContent>();
  
  template.entries.forEach(entry => {
    if (entry.customText) {
      cellContents.set(entry.cellKey, {
        text: entry.customText,
        isVertical: false,
        alignment: 'center',
        className: entry.class?.id
      });
    }
  });
  
  return {
    cellContents,
    columnCount: template.columnCount,
    columnDurations: { ...template.columnDurations },
    defaultSlotDuration: template.defaultSlotDuration
  };
};

// Delete template from database
export const deleteTemplate = (
  templateId: string,
  database: TimetableDatabase
): TimetableDatabase => {
  // Create a copy of the database
  const updatedDatabase = { ...database };
  
  // Remove template if it exists
  if (updatedDatabase.templates) {
    updatedDatabase.templates = updatedDatabase.templates.filter(t => t.id !== templateId);
  }
  
  return updatedDatabase;
};

// Get all templates from database
export const getTemplates = (database: TimetableDatabase): TimetableTemplate[] => {
  return database.templates || [];
};

// Get template by ID
export const getTemplateById = (
  templateId: string,
  database: TimetableDatabase
): TimetableTemplate | undefined => {
  return database.templates?.find(t => t.id === templateId);
};