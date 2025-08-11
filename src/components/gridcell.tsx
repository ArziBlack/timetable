// GridCell.tsx
import React from 'react';
import type { MergeInfo } from '../interfaces/types';

interface GridCellProps {
  row: number;
  col: number;
  cellKey: string;
  isSelected: boolean;
  isColumnHovered: boolean;
  mergeInfo?: MergeInfo;
  hiddenCells: Set<string>;
  onCellClick: (row: number, col: number) => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  row,
  col,
  cellKey,
  isSelected,
  isColumnHovered,
  mergeInfo,
  hiddenCells,
  onCellClick,
}) => {
  if (hiddenCells.has(cellKey)) {
    return null;
  }

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
      onClick={() => onCellClick(row, col)}
    >
      <div className="flex items-center justify-center h-full text-sm font-medium text-gray-700">
        {mergeInfo ? `${mergeInfo.rowSpan}×${mergeInfo.colSpan}` : `${row},${col}`}
      </div>
    </td>
  );
};