/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

// Shadcn UI Components (simplified for this implementation)
const Popover = ({ open, onOpenChange, children }: any) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const PopoverTrigger = ({ children, onClick }: any) => {
  return (
    <button onClick={onClick} className="outline-none">
      {children}
    </button>
  );
};

const PopoverContent = ({ children, open, onClose }: any) => {
  if (!open) return null;
  
  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] min-w-[120px]">
      <div className="p-1" onClick={onClose}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [mergedCells, setMergedCells] = useState(new Map());
  const [hiddenCells, setHiddenCells] = useState(new Set());
  const [columnCount, setColumnCount] = useState(12);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [openPopover, setOpenPopover] = useState<number | null>(null);
  const [editingDuration, setEditingDuration] = useState<number | null>(null);
  const [tempDuration, setTempDuration] = useState('');
  const [defaultSlotDuration, setDefaultSlotDuration] = useState(45); // Default 45 minutes
  const [editingDefaultDuration, setEditingDefaultDuration] = useState(false);
  const [tempDefaultDuration, setTempDefaultDuration] = useState('45');

  const gridSize = 5;
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const baseStartTime = 8 * 60; // 8 AM in minutes from midnight
  
  // Store individual column durations (in minutes)
  const [columnDurations, setColumnDurations] = useState<{ [key: number]: number }>({});
  
  // Convert minutes from midnight to time string
  const minutesToTimeString = (minutes: number) => {
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

  // Get duration for a specific column (use default if not set)
  const getColumnDuration = (columnIndex: number) => {
    return columnDurations[columnIndex] || defaultSlotDuration;
  };

  // Calculate start and end times for each column
  const getColumnTimes = (columnIndex: number) => {
    let startTime = baseStartTime; // Start at 8 AM
    
    // Calculate start time by summing all previous column durations
    for (let i = 0; i < columnIndex; i++) {
      startTime += getColumnDuration(i);
    }
    
    const endTime = startTime + getColumnDuration(columnIndex);
    
    return {
      start: startTime,
      end: endTime,
      duration: getColumnDuration(columnIndex)
    };
  };

  // Generate time labels with start-end format
  const generateTimeLabels = (count: number) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      const { start, end } = getColumnTimes(i);
      const startStr = minutesToTimeString(start);
      const endStr = minutesToTimeString(end);
      labels.push(`${startStr} - ${endStr}`);
    }
    return labels;
  };

  const timeLabels = generateTimeLabels(columnCount);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellClick = (row: number, col: number) => {
    const cellKey = getCellKey(row, col);
    
    // Don't allow selection of hidden cells (already merged)
    if (hiddenCells.has(cellKey)) return;
    
    const newSelected = new Set(selectedCells);
    if (newSelected.has(cellKey)) {
      newSelected.delete(cellKey);
    } else {
      newSelected.add(cellKey);
    }
    setSelectedCells(newSelected);
  };

  const canMergeCells = () => {
    if (selectedCells.size < 2) return false;
    
    const cells = Array.from(selectedCells).map((key: any) => {
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

  const mergeCells = () => {
    if (!canMergeCells()) return;
    
    const cells = Array.from(selectedCells).map((key: any) => {
      const [row, col] = key.split('-').map(Number);
      return { row, col };
    });
    
    const minRow = Math.min(...cells.map(c => c.row));
    const maxRow = Math.max(...cells.map(c => c.row));
    const minCol = Math.min(...cells.map(c => c.col));
    const maxCol = Math.max(...cells.map(c => c.col));
    
    const rowSpan = maxRow - minRow + 1;
    const colSpan = maxCol - minCol + 1;
    const masterCell = getCellKey(minRow, minCol);
    
    const newMergedCells = new Map(mergedCells);
    newMergedCells.set(masterCell, { rowSpan, colSpan });
    
    const newHiddenCells = new Set(hiddenCells);
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellKey = getCellKey(r, c);
        if (cellKey !== masterCell) {
          newHiddenCells.add(cellKey);
        }
      }
    }
    
    setMergedCells(newMergedCells);
    setHiddenCells(newHiddenCells);
    setSelectedCells(new Set());
  };

  const addColumnAfter = (afterColumnIndex: number) => {
    const newColumnCount = columnCount + 1;
    
    // Update all cell references that come after the insertion point
    const newSelectedCells = new Set();
    selectedCells.forEach((cellKey: any) => {
      const [row, col] = cellKey.split('-').map(Number);
      if (col > afterColumnIndex) {
        newSelectedCells.add(getCellKey(row, col + 1));
      } else {
        newSelectedCells.add(cellKey);
      }
    });
    
    const newMergedCells = new Map();
    const newHiddenCells = new Set();
    
    mergedCells.forEach((mergeInfo, cellKey) => {
      const [row, col] = cellKey.split('-').map(Number);
      let newCellKey = cellKey;
      
      if (col > afterColumnIndex) {
        // Shift the merge to the right
        newCellKey = getCellKey(row, col + 1);
      }
      
      newMergedCells.set(newCellKey, mergeInfo);
      
      // Re-add hidden cells for this merge with updated positions
      const mergeRow = parseInt(newCellKey.split('-')[0]);
      const mergeCol = parseInt(newCellKey.split('-')[1]);
      
      for (let r = mergeRow; r < mergeRow + mergeInfo.rowSpan; r++) {
        for (let c = mergeCol; c < mergeCol + mergeInfo.colSpan; c++) {
          const hiddenKey = getCellKey(r, c);
          if (hiddenKey !== newCellKey) {
            newHiddenCells.add(hiddenKey);
          }
        }
      }
    });
    
    // Update column durations - shift indices after insertion point
    const newColumnDurations: { [key: number]: number } = {};
    Object.keys(columnDurations).forEach((key: string) => {
      const index = parseInt(key);
      if (index <= afterColumnIndex) {
        newColumnDurations[index] = columnDurations[index];
      } else {
        newColumnDurations[index + 1] = columnDurations[index];
      }
    });
    
    setColumnCount(newColumnCount);
    setSelectedCells(newSelectedCells);
    setMergedCells(newMergedCells);
    setHiddenCells(newHiddenCells);
    setColumnDurations(newColumnDurations);
    setOpenPopover(null);
  };

  const deleteColumn = (columnIndex: number) => {
    if (columnCount <= 1) return;
    
    const newColumnCount = columnCount - 1;
    
    // Clean up any selections, merges, or hidden cells in the removed column
    const newSelectedCells = new Set();
    selectedCells.forEach((cellKey: any) => {
      const [row, col] = cellKey.split('-').map(Number);
      if (col < columnIndex) {
        newSelectedCells.add(cellKey);
      } else if (col > columnIndex) {
        newSelectedCells.add(getCellKey(row, col - 1));
      }
    });
    
    const newMergedCells = new Map();
    const newHiddenCells = new Set();
    
    mergedCells.forEach((mergeInfo, cellKey) => {
      const [row, col] = cellKey.split('-').map(Number);
      
      // Skip merges that start in the deleted column
      if (col === columnIndex) return;
      
      // Skip merges that would extend into or beyond the deleted column
      if (col < columnIndex && col + mergeInfo.colSpan > columnIndex) return;
      
      let newCellKey = cellKey;
      if (col > columnIndex) {
        // Shift the merge to the left
        newCellKey = getCellKey(row, col - 1);
      }
      
      newMergedCells.set(newCellKey, mergeInfo);
      
      // Re-add hidden cells for this merge
      const mergeRow = parseInt(newCellKey.split('-')[0]);
      const mergeCol = parseInt(newCellKey.split('-')[1]);
      
      for (let r = mergeRow; r < mergeRow + mergeInfo.rowSpan; r++) {
        for (let c = mergeCol; c < mergeCol + mergeInfo.colSpan; c++) {
          if (c < newColumnCount) { // Don't add hidden cells beyond new column count
            const hiddenKey = getCellKey(r, c);
            if (hiddenKey !== newCellKey) {
              newHiddenCells.add(hiddenKey);
            }
          }
        }
      }
    });
    
    // Update column durations - remove deleted column and shift indices
    const newColumnDurations: { [key: number]: number } = {};
    Object.keys(columnDurations).forEach((key: string) => {
      const index = parseInt(key);
      if (index < columnIndex) {
        newColumnDurations[index] = columnDurations[index];
      } else if (index > columnIndex) {
        newColumnDurations[index - 1] = columnDurations[index];
      }
    });
    
    setColumnCount(newColumnCount);
    setSelectedCells(newSelectedCells);
    setMergedCells(newMergedCells);
    setHiddenCells(newHiddenCells);
    setColumnDurations(newColumnDurations);
    setOpenPopover(null);
  };

  const startEditingDuration = (columnIndex: number) => {
    setEditingDuration(columnIndex);
    setTempDuration(getColumnDuration(columnIndex).toString());
    setOpenPopover(null);
  };

  const saveDurationEdit = () => {
    if (editingDuration !== null) {
      const newDuration = parseInt(tempDuration);
      if (newDuration > 0 && newDuration <= 480) { // Max 8 hours
        setColumnDurations(prev => ({
          ...prev,
          [editingDuration]: newDuration
        }));
      }
    }
    setEditingDuration(null);
    setTempDuration('');
  };

  const cancelDurationEdit = () => {
    setEditingDuration(null);
    setTempDuration('');
  };

  const saveDefaultDurationEdit = () => {
    const newDuration = parseInt(tempDefaultDuration);
    if (newDuration > 0 && newDuration <= 480) { // Max 8 hours
      setDefaultSlotDuration(newDuration);
    }
    setEditingDefaultDuration(false);
    setTempDefaultDuration(defaultSlotDuration.toString());
  };

  const cancelDefaultDurationEdit = () => {
    setEditingDefaultDuration(false);
    setTempDefaultDuration(defaultSlotDuration.toString());
  };

  const resetGrid = () => {
    setSelectedCells(new Set());
    setMergedCells(new Map());
    setHiddenCells(new Set());
    setColumnCount(12);
    setColumnDurations({});
    setEditingDuration(null);
    setTempDuration('');
    setOpenPopover(null);
  };

  const renderCell = (row: number, col: number) => {
    const cellKey = getCellKey(row, col);
    
    if (hiddenCells.has(cellKey)) {
      return null;
    }
    
    const isSelected = selectedCells.has(cellKey);
    const mergeInfo = mergedCells.get(cellKey);
    const isColumnHovered = hoveredColumn === col;
    
    return (
      <td
        key={cellKey}
        className={`
          border-2 border-gray-400 h-[100px] w-[150px] cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'bg-blue-300 border-blue-500 shadow-lg' 
            : 'bg-white hover:bg-gray-100'
          }
          ${mergeInfo ? 'bg-green-100 border-green-500' : ''}
          ${isColumnHovered ? 'bg-gray-50' : ''}
        `}
        rowSpan={mergeInfo?.rowSpan || 1}
        colSpan={mergeInfo?.colSpan || 1}
        onClick={() => handleCellClick(row, col)}
      >
        <div className="flex items-center justify-center h-full text-sm font-medium text-gray-700">
          {mergeInfo ? `${mergeInfo.rowSpan}×${mergeInfo.colSpan}` : `${row},${col}`}
        </div>
      </td>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Milton Data Grid</h1>
        <p className="text-gray-600 mb-4">
          Click cells to select them (blue highlight), then merge selected rectangular regions.
        </p>
        
        <div className="flex gap-4 mb-4 flex-wrap items-center">
          <button
            onClick={mergeCells}
            disabled={!canMergeCells()}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${canMergeCells()
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Merge Cells ({selectedCells.size} selected)
          </button>
          
          <button
            onClick={resetGrid}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            Reset Grid
          </button>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Default Slot Duration:</span>
            {editingDefaultDuration ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempDefaultDuration}
                  onChange={(e) => setTempDefaultDuration(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDefaultDurationEdit();
                    if (e.key === 'Escape') cancelDefaultDurationEdit();
                  }}
                  className="w-16 px-2 py-1 text-sm border rounded text-center"
                  min="5"
                  max="480"
                  autoFocus
                />
                <span className="text-sm text-gray-600">min</span>
                <button
                  onClick={saveDefaultDurationEdit}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={cancelDefaultDurationEdit}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">{defaultSlotDuration} min</span>
                <button
                  onClick={() => {
                    setEditingDefaultDuration(true);
                    setTempDefaultDuration(defaultSlotDuration.toString());
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Current columns: {columnCount} | Default slot duration: {defaultSlotDuration} minutes
        </div>
        
        {selectedCells.size > 0 && !canMergeCells() && (
          <p className="text-amber-600 text-sm">
            Selected cells must form a rectangular region to merge.
          </p>
        )}
      </div>

      <div className="inline-block border-4 border-gray-600 rounded-lg overflow-hidden shadow-lg overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-300 border-2 border-gray-400 h-12 w-32 font-semibold text-gray-700 text-center sticky top-0 left-0 z-20">
                Time / Day
              </th>
              {timeLabels.map((time, index) => (
                <th 
                  key={index} 
                  className={`bg-gray-300 border-2 border-gray-400 h-12 w-16 font-semibold text-gray-700 text-center sticky top-0 z-10 text-sm whitespace-nowrap relative group cursor-pointer transition-all duration-200 ${
                    hoveredColumn === index ? 'bg-gray-400' : ''
                  }`}
                  onMouseEnter={() => setHoveredColumn(index)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  {editingDuration === index ? (
                    <div className="flex items-center justify-center h-full px-1">
                      <input
                        type="number"
                        value={tempDuration}
                        onChange={(e) => setTempDuration(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveDurationEdit();
                          if (e.key === 'Escape') cancelDurationEdit();
                        }}
                        onBlur={saveDurationEdit}
                        className="w-full text-xs text-center border rounded px-1 py-0.5"
                        autoFocus
                        placeholder="minutes"
                        min="5"
                        max="480"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full px-1">
                      <div className="text-xs leading-tight">{time}</div>
                    </div>
                  )}
                  
                  {hoveredColumn === index && editingDuration === null && (
                    <div className="absolute -top-1 right-1 z-[100]">
                      <Popover open={openPopover === index} onOpenChange={(open: boolean) => setOpenPopover(open ? index : null)}>
                        <PopoverTrigger onClick={() => setOpenPopover(openPopover === index ? null : index)}>
                          <div className="bg-white border border-gray-300 rounded p-1 shadow-lg hover:bg-gray-50">
                            <MoreVertical size={12} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent open={openPopover === index} onClose={() => setOpenPopover(null)}>
                          <div className="flex flex-col">
                            <button
                              onClick={() => startEditingDuration(index)}
                              className="px-3 py-2 text-left text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                              <span>✏️</span> Edit Duration
                            </button>
                            <button
                              onClick={() => addColumnAfter(index)}
                              className="px-3 py-2 text-left text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                              <span>➕</span> Add Column
                            </button>
                            <button
                              onClick={() => deleteColumn(index)}
                              disabled={columnCount <= 1}
                              className={`px-3 py-2 text-left text-sm rounded flex items-center gap-2 ${
                                columnCount > 1 
                                  ? 'hover:bg-red-50 text-red-600' 
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <span>🗑️</span> Delete Column
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: gridSize }, (_, row) => (
              <tr key={row}>
                <td className="bg-gray-200 border-2 border-gray-400 h-16 w-32 font-semibold text-gray-700 text-center sticky left-0 z-10">
                  <div className="flex items-center justify-center h-full">
                    {dayLabels[row]}
                  </div>
                </td>
                {Array.from({ length: columnCount }, (_, col) => renderCell(row, col))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ul className="space-y-1">
          <li>• <strong>Default Slot Duration</strong>: Set the default time duration for new columns</li>
          <li>• <strong>Column Menu</strong>: Hover over any time header to see the menu icon (⋮)</li>
          <li>• <strong>Edit Duration</strong>: Change the duration for a specific column (updates all subsequent times)</li>
          <li>• <strong>Add Column</strong>: Insert a new column after the selected one</li>
          <li>• <strong>Delete Column</strong>: Remove the selected column</li>
          <li>• <strong>Column Highlighting</strong>: Hover over headers to highlight the entire column</li>
          <li>• Time headers show as "Start Time - End Time" format</li>
          <li>• Each column can have its own custom duration</li>
          <li>• Click individual cells to select them (they'll turn blue)</li>
          <li>• Select multiple cells that form a rectangle and click "Merge Cells"</li>
          <li>• Merged cells show their dimensions and appear green</li>
          <li>• Use "Reset Grid" to start over with default settings</li>
        </ul>
      </div>
    </div>
  );
};

export default App;