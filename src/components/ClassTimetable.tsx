import React from 'react';
import { useGridState } from '../hooks/usegrid';
import { GridCell } from './gridcell';
import { GridHeader } from './gridheader';
import type { CellContent } from '../interfaces/types';
import type { Class as TimetableClass } from '../interfaces/database';
import { canMergeCells } from '../lib/util';

interface ClassTimetableProps {
  classData: TimetableClass;
  dayLabels: string[];
  timeLabels: string[];
  onGenerateTimetable: (classId: string) => void;
  cellContents: Map<string, CellContent>;
  onExportClassPDF?: (classId: string, className: string) => void;
}

export const ClassTimetable: React.FC<ClassTimetableProps> = ({
  classData,
  dayLabels,
  timeLabels,
  onGenerateTimetable,
  cellContents,
  onExportClassPDF
}) => {
  // Each class timetable has its own grid state
  const gridState = useGridState();
  
  // Initialize with the cell contents for this class
  React.useEffect(() => {
    const classCellContents = new Map<string, CellContent>();
    
    // Filter cell contents for this class
    cellContents.forEach((content, key) => {
      if (content.className === classData.id) {
        classCellContents.set(key, content);
      }
    });
    
    gridState.setAllCellContents(classCellContents);
  }, [cellContents, classData.id]);
  
  const {
    selectedCells,
    mergedCells,
    hiddenCells,
    columnCount,
    hoveredColumn,
    openPopover,
    editingDuration,
    tempDuration,
    defaultSlotDuration,
    editingDefaultDuration,
    tempDefaultDuration,
    columnDurations,
    editingCell,
    tempCellText,
    handleCellClick,
    handleCellDoubleClick,
    mergeCells,
    addColumnAfter,
    deleteColumn,
    startEditingDuration,
    saveDurationEdit,
    cancelDurationEdit,
    saveDefaultDurationEdit,
    cancelDefaultDurationEdit,
    resetGrid,
    setHoveredColumn,
    setOpenPopover,
    setTempCellText,
    toggleCellVertical,
    setCellAlignment,
    saveCellEdit,
    cancelCellEdit,
  } = gridState;

  // Default duration editing is handled at the grid level
  const handleDefaultDurationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveDefaultDurationEdit();
    }
    if (e.key === 'Escape') {
      cancelDefaultDurationEdit();
    }
  };

  const renderHeader = (label: string, col: number) => (
    <GridHeader
      key={col}
      time={label}
      index={col}
      hoveredColumn={hoveredColumn}
      editingDuration={editingDuration}
      openPopover={openPopover}
      tempDuration={tempDuration}
      columnCount={columnCount}
      onMouseEnter={() => setHoveredColumn(col)}
      onMouseLeave={() => setHoveredColumn(null)}
      onTempDurationChange={(value) => gridState.setTempDuration(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveDurationEdit();
        }
        if (e.key === 'Escape') {
          cancelDurationEdit();
        }
      }}
      onBlur={cancelDurationEdit}
      onOpenPopoverChange={(open) => open ? setOpenPopover(col) : setOpenPopover(null)}
      onStartEditingDuration={() => startEditingDuration(col)}
      onAddColumnAfter={() => addColumnAfter(col)}
      onDeleteColumn={() => deleteColumn(col)}
    />
  );

  const renderCell = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.has(cellKey);
    const mergeInfo = mergedCells.get(cellKey);
    const isColumnHovered = hoveredColumn === col;
    const cellContent = gridState.cellContents.get(cellKey);

    return (
      <GridCell
        key={cellKey}
        row={row}
        col={col}
        cellKey={cellKey}
        isSelected={isSelected}
        isColumnHovered={isColumnHovered}
        mergeInfo={mergeInfo}
        hiddenCells={hiddenCells}
        cellContent={cellContent}
        editingCell={editingCell}
        tempCellText={tempCellText}
        onCellClick={handleCellClick}
        onCellDoubleClick={handleCellDoubleClick}
        onTempCellTextChange={setTempCellText}
        onSaveCellEdit={saveCellEdit}
        onCancelCellEdit={cancelCellEdit}
        onToggleCellVertical={toggleCellVertical}
        onSetCellAlignment={setCellAlignment}
      />
    );
  };

  return (
    <div className="inline-block border-4 border-gray-600 rounded-lg overflow-hidden shadow-lg overflow-x-auto mb-8 mr-4">
      <div className="bg-blue-600 text-white font-bold py-2 px-4 text-center flex justify-between items-center">
        <span>{classData.name}</span>
        <div className="flex gap-2">
          <button 
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs py-1 px-2 rounded"
            onClick={() => onGenerateTimetable(classData.id)}
          >
            Generate Timetable
          </button>
          {onExportClassPDF && (
            <button 
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
              onClick={() => onExportClassPDF(classData.id, classData.name)}
            >
              Export PDF
            </button>
          )}
        </div>
      </div>
      
      {/* Class-specific grid controls */}
      <div className="p-2 bg-gray-100 border-b-2 border-gray-400">
        <button
          onClick={mergeCells}
          disabled={!canMergeCells(selectedCells)}
          className={`
            px-3 py-1 rounded text-sm font-medium transition-all duration-200 mr-2
            ${canMergeCells(selectedCells)
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"}
          `}
        >
          Merge Cells ({selectedCells.size})
        </button>
        
        <button
          onClick={resetGrid}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-all duration-200 shadow-sm"
        >
          Reset Grid
        </button>
      </div>
      
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="bg-gray-300 border-2 border-gray-400 h-12 w-32 font-semibold text-gray-700 text-center sticky top-0 left-0 z-20">
              Time / Day
            </th>
            {timeLabels.map(renderHeader)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: dayLabels.length }, (_, row) => (
            <tr key={row}>
              <td className="bg-gray-200 border-2 border-gray-400 h-16 w-32 font-semibold text-gray-700 text-center sticky left-0 z-10">
                <div className="flex items-center justify-center h-full">
                  {dayLabels[row]}
                </div>
              </td>
              {Array.from({ length: columnCount }, (_, col) =>
                renderCell(row, col)
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};