// utils.ts
import type { ColumnTimes } from '../interfaces/types';
import type { TimetableEntry } from '../interfaces/database';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const getCellKey = (row: number, col: number): string => `${row}-${col}`;

export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  if (mins === 0) {
    return `${displayHour}:00 ${period}`;
  } else {
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  }
};

// Original export timetable data to PDF function (preserved for backward compatibility)
export const exportTimetableToGridPDF = (
  timetableData: TimetableEntry[],
  title: string = 'Timetable',
  className?: string
): void => {
  // Create a new PDF document in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });
  
  // Add title
  const fullTitle = className ? `${title} - ${className}` : title;
  doc.setFontSize(16);
  doc.text(fullTitle, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Get unique days and time slots from the data
  const days = Array.from(new Set(timetableData.map(entry => entry.day)));
  const timeSlots = Array.from(new Set(timetableData.map(entry => entry.timeSlot)));
  timeSlots.sort((a, b) => {
    // Extract hours and minutes for comparison
    const getMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    return getMinutes(a) - getMinutes(b);
  });
  
  // Create a grid-like timetable
  const tableHead = [['', ...timeSlots]];
  const tableBody = days.map(day => {
    const rowData = [day];
    
    // Fill in cells for each time slot
    timeSlots.forEach(timeSlot => {
      const entriesForCell = timetableData.filter(
        entry => entry.day === day && entry.timeSlot === timeSlot
      );
      
      if (entriesForCell.length > 0) {
        // Join multiple entries with line breaks if needed
        rowData.push(
          entriesForCell
            .map(entry => entry.customText || '')
            .filter(text => text)
            .join('\n')
        );
      } else {
        rowData.push('');
      }
    });
    
    return rowData;
  });
  
  // Add the timetable grid
  autoTable(doc, {
    startY: 30,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { 
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: { 
      overflow: 'linebreak',
      cellPadding: 3,
      fontSize: 9
    },
    columnStyles: {
      0: { 
        cellWidth: 25,
        fontStyle: 'bold',
        fillColor: [200, 220, 240],
        halign: 'center'
      }
    },
    alternateRowStyles: {
      fillColor: [240, 245, 250]
    },
    didDrawCell: (data) => {
      // Add custom styling if needed
    }
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

// Export timetable data to PDF with screenshot
export const exportTimetableToPDF = (
  timetableData: TimetableEntry[],
  title: string = 'Timetable',
  className?: string,
  screenshotDataUrl?: string
): void => {
  // Create a new PDF document in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });
  
  // Add title
  const fullTitle = className ? `${title} - ${className}` : title;
  doc.setFontSize(16);
  doc.text(fullTitle, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
  
  // If screenshot is provided, add it to the PDF
  if (screenshotDataUrl) {
    // Add the screenshot
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the screenshot while maintaining aspect ratio
    const margin = 20; // margin in mm
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - margin - 30; // 30mm from the top for the title
    
    // Add the screenshot to the PDF
    doc.addImage(screenshotDataUrl, 'PNG', margin, 30, maxWidth, maxHeight);
    
    // Add a new page for the grid view
    doc.addPage();
    doc.setFontSize(16);
    doc.text(`${fullTitle} - Grid View`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
  }
  
  // Get unique days and time slots from the data
  const days = Array.from(new Set(timetableData.map(entry => entry.day)));
  const timeSlots = Array.from(new Set(timetableData.map(entry => entry.timeSlot)));
  timeSlots.sort((a, b) => {
    // Extract hours and minutes for comparison
    const getMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    return getMinutes(a) - getMinutes(b);
  });
  
  // Create a grid-like timetable
  const tableHead = [['', ...timeSlots]];
  const tableBody = days.map(day => {
    const rowData = [day];
    
    // Fill in cells for each time slot
    timeSlots.forEach(timeSlot => {
      const entriesForCell = timetableData.filter(
        entry => entry.day === day && entry.timeSlot === timeSlot
      );
      
      if (entriesForCell.length > 0) {
        // Join multiple entries with line breaks if needed
        rowData.push(
          entriesForCell
            .map(entry => entry.customText || '')
            .filter(text => text)
            .join('\n')
        );
      } else {
        rowData.push('');
      }
    });
    
    return rowData;
  });
  
  // Add the timetable grid
  autoTable(doc, {
    startY: 30,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { 
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: { 
      overflow: 'linebreak',
      cellPadding: 3,
      fontSize: 9
    },
    columnStyles: {
      0: { 
        cellWidth: 25,
        fontStyle: 'bold',
        fillColor: [200, 220, 240],
        halign: 'center'
      }
    },
    alternateRowStyles: {
      fillColor: [240, 245, 250]
    },
    didDrawCell: (data) => {
      // Add custom styling if needed
    }
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const getColumnDuration = (
  columnIndex: number, 
  columnDurations: { [key: number]: number }, 
  defaultSlotDuration: number
): number => {
  return columnDurations[columnIndex] || defaultSlotDuration;
};

export const getColumnTimes = (
  columnIndex: number,
  columnDurations: { [key: number]: number },
  defaultSlotDuration: number,
  baseStartTime: number = 8 * 60 // 8 AM
): ColumnTimes => {
  let startTime = baseStartTime;
  
  // Calculate start time by summing all previous column durations
  for (let i = 0; i < columnIndex; i++) {
    startTime += getColumnDuration(i, columnDurations, defaultSlotDuration);
  }
  
  const duration = getColumnDuration(columnIndex, columnDurations, defaultSlotDuration);
  const endTime = startTime + duration;
  
  return {
    start: startTime,
    end: endTime,
    duration
  };
};

export const generateTimeLabels = (
  count: number,
  columnDurations: { [key: number]: number },
  defaultSlotDuration: number,
  baseStartTime: number = 8 * 60
): string[] => {
  const labels = [];
  for (let i = 0; i < count; i++) {
    const { start, end } = getColumnTimes(i, columnDurations, defaultSlotDuration, baseStartTime);
    const startStr = minutesToTimeString(start);
    const endStr = minutesToTimeString(end);
    labels.push(`${startStr} - ${endStr}`);
  }
  return labels;
};

export const canMergeCells = (selectedCells: Set<string>): boolean => {
  if (selectedCells.size < 2) return false;
  
  const cells = Array.from(selectedCells).map((key: string) => {
    const [row, col] = key.split('-').map(Number);
    return { row, col };
  });
  
  // Check if cells form a rectangular region
  const minRow = Math.min(...cells.map(c => c.row));
  const maxRow = Math.max(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));
  const maxCol = Math.max(...cells.map(c => c.col));
  
  const expectedCount = (maxRow - minRow + 1) * (maxCol - minCol + 1);
  if (cells.length !== expectedCount) return false;
  
  // Check if all cells in the rectangle are selected
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (!selectedCells.has(getCellKey(r, c))) return false;
    }
  }
  
  return true;
};