// lib/template.ts
import { v4 as uuidv4 } from 'uuid';
import type { TimetableTemplate, TimetableEntry, TimetableDatabase } from '../interfaces/database';
import type { CellContent } from '../interfaces/types';
import { extractTimetableData } from './timetable';

// Save current grid state as a template
export const saveAsTemplate = (
  name: string,
  cellContents: Map<string, CellContent>,
  mergedCells: Map<string, any>,
  hiddenCells: Set<string>,
  columnCount: number,
  columnDurations: { [key: number]: number },
  defaultSlotDuration: number
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
  
  // Store merged cells information
  const mergedCellsData: { [key: string]: any } = {};
  mergedCells.forEach((value, key) => {
    mergedCellsData[key] = value;
  });
  
  // Store hidden cells as array
  const hiddenCellsArray = Array.from(hiddenCells);
  
  // Create template object
  const template: TimetableTemplate = {
    id: uuidv4(),
    name,
    entries,
    columnCount,
    columnDurations,
    defaultSlotDuration,
    mergedCellsData,
    hiddenCellsArray
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
  mergedCells: Map<string, any>;
  hiddenCells: Set<string>;
} => {
  // Create cell contents from template entries
  const cellContents = new Map<string, CellContent>();
  const mergedCells = new Map<string, any>();
  const hiddenCells = new Set<string>();
  
  // Process entries to restore cell contents and properties
  template.entries.forEach(entry => {
    if (entry.customText) {
      // Store all cell properties from the template
      cellContents.set(entry.cellKey, {
        text: entry.customText,
        // Store cell formatting properties if available, or use defaults
        isVertical: entry.isVertical !== undefined ? entry.isVertical : false,
        alignment: entry.alignment || 'center',
        className: entry.class?.id
      });
    }
  });
  
  // Restore merged cells if available
  if (template.mergedCellsData) {
    Object.entries(template.mergedCellsData).forEach(([key, value]) => {
      mergedCells.set(key, value);
    });
  }
  
  // Restore hidden cells if available
  if (template.hiddenCellsArray) {
    template.hiddenCellsArray.forEach(cellKey => {
      hiddenCells.add(cellKey);
    });
  }
  
  return {
    cellContents,
    columnCount: template.columnCount,
    columnDurations: { ...template.columnDurations },
    defaultSlotDuration: template.defaultSlotDuration,
    mergedCells,
    hiddenCells
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