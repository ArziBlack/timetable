import React from 'react';
import { useGridState } from './hooks/usegrid';
import { GridControls } from './components/gridcontrols';
import { GridHeader } from './components/gridheader';
import { GridCell } from './components/gridcell';
import { generateTimeLabels, canMergeCells } from './lib/util';

const App = () => {
  const gridState = useGridState();
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
    handleCellClick,
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
  } = gridState;

  const gridSize = 5;
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeLabels = generateTimeLabels(columnCount, columnDurations, defaultSlotDuration);

  const handleDefaultDurationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveDefaultDurationEdit();
    if (e.key === 'Escape') cancelDefaultDurationEdit();
  };

  const handleDurationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveDurationEdit();
    if (e.key === 'Escape') cancelDurationEdit();
  };

  const startEditingDefaultDuration = () => {
    gridState.setEditingDefaultDuration(true);
    gridState.setTempDefaultDuration(defaultSlotDuration.toString());
  };

  const renderCell = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.has(cellKey);
    const mergeInfo = mergedCells.get(cellKey);
    const isColumnHovered = hoveredColumn === col;

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
        onCellClick={handleCellClick}
      />
    );
  };

  const renderHeader = (time: string, index: number) => (
    <GridHeader
      key={index}
      time={time}
      index={index}
      hoveredColumn={hoveredColumn}
      editingDuration={editingDuration}
      openPopover={openPopover}
      tempDuration={tempDuration}
      columnCount={columnCount}
      onMouseEnter={() => setHoveredColumn(index)}
      onMouseLeave={() => setHoveredColumn(null)}
      onTempDurationChange={gridState.setTempDuration}
      onKeyDown={handleDurationKeyDown}
      onBlur={saveDurationEdit}
      onOpenPopoverChange={(open: boolean) => setOpenPopover(open ? index : null)}
      onStartEditingDuration={() => startEditingDuration(index)}
      onAddColumnAfter={() => addColumnAfter(index)}
      onDeleteColumn={() => deleteColumn(index)}
    />
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <GridControls
        selectedCellsCount={selectedCells.size}
        canMerge={canMergeCells(selectedCells)}
        defaultSlotDuration={defaultSlotDuration}
        editingDefaultDuration={editingDefaultDuration}
        tempDefaultDuration={tempDefaultDuration}
        columnCount={columnCount}
        onMergeCells={mergeCells}
        onResetGrid={resetGrid}
        onStartEditingDefaultDuration={startEditingDefaultDuration}
        onTempDefaultDurationChange={gridState.setTempDefaultDuration}
        onSaveDefaultDurationEdit={saveDefaultDurationEdit}
        onCancelDefaultDurationEdit={cancelDefaultDurationEdit}
        onDefaultDurationKeyDown={handleDefaultDurationKeyDown}
      />

      <div className="inline-block border-4 border-gray-600 rounded-lg overflow-hidden shadow-lg overflow-x-auto">
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