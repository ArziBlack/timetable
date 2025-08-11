// GridControls.tsx
import React from "react";

interface GridControlsProps {
  selectedCellsCount: number;
  canMerge: boolean;
  defaultSlotDuration: number;
  editingDefaultDuration: boolean;
  tempDefaultDuration: string;
  columnCount: number;
  onMergeCells: () => void;
  onResetGrid: () => void;
  onStartEditingDefaultDuration: () => void;
  onTempDefaultDurationChange: (value: string) => void;
  onSaveDefaultDurationEdit: () => void;
  onCancelDefaultDurationEdit: () => void;
  onDefaultDurationKeyDown: (e: React.KeyboardEvent) => void;
}

export const GridControls: React.FC<GridControlsProps> = ({
  selectedCellsCount,
  canMerge,
  defaultSlotDuration,
  editingDefaultDuration,
  tempDefaultDuration,
  columnCount,
  onMergeCells,
  onResetGrid,
  onStartEditingDefaultDuration,
  onTempDefaultDurationChange,
  onSaveDefaultDurationEdit,
  onCancelDefaultDurationEdit,
  onDefaultDurationKeyDown,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Milton Data Grid
      </h1>
      <p className="text-gray-600 mb-4">
        Click cells to select them (blue highlight), then merge selected
        rectangular regions.
      </p>

      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <button
          onClick={onMergeCells}
          disabled={!canMerge}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${
              canMerge
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Merge Cells ({selectedCellsCount} selected)
        </button>

        <button
          onClick={onResetGrid}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          Reset Grid
        </button>

        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Default Slot Duration:
          </span>
          {editingDefaultDuration ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempDefaultDuration}
                onChange={(e) => onTempDefaultDurationChange(e.target.value)}
                onKeyDown={onDefaultDurationKeyDown}
                className="w-16 px-2 py-1 text-sm border rounded text-center"
                min="5"
                max="480"
                autoFocus
              />
              <span className="text-sm text-gray-600">min</span>
              <button
                onClick={onSaveDefaultDurationEdit}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
              >
                ✓
              </button>
              <button
                onClick={onCancelDefaultDurationEdit}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                ✗
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">
                {defaultSlotDuration} min
              </span>
              <button
                onClick={onStartEditingDefaultDuration}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Current columns: {columnCount} | Default slot duration:{" "}
        {defaultSlotDuration} minutes
      </div>
      <div className="relative">
        {selectedCellsCount > 0 && !canMerge && (
          <p className="text-amber-600 text-sm absolute -top-5 left-0">
            Selected cells must form a rectangular region to merge.
          </p>
        )}
      </div>
    </div>
  );
};
