// GridHeader.tsx
import React from "react";
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GridHeaderProps {
  time: string;
  index: number;
  hoveredColumn: number | null;
  editingDuration: number | null;
  openPopover: number | null;
  tempDuration: string;
  columnCount: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTempDurationChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  onOpenPopoverChange: (open: boolean) => void;
  onStartEditingDuration: () => void;
  onAddColumnAfter: () => void;
  onDeleteColumn: () => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  time,
  index,
  hoveredColumn,
  editingDuration,
  openPopover,
  tempDuration,
  columnCount,
  onMouseEnter,
  onMouseLeave,
  onTempDurationChange,
  onKeyDown,
  onBlur,
  onOpenPopoverChange,
  onStartEditingDuration,
  onAddColumnAfter,
  onDeleteColumn,
}) => {
  return (
    <th
      className={`bg-gray-300 border-2 border-gray-400 h-12 w-16 font-semibold text-gray-700 text-center sticky top-0 z-10 text-sm whitespace-nowrap relative group cursor-pointer transition-all duration-200 ${
        hoveredColumn === index ? "bg-gray-400" : ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {editingDuration === index ? (
        <div className="flex items-center justify-center h-full px-1">
          <input
            type="number"
            value={tempDuration}
            onChange={(e) => onTempDurationChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            className="w-full min-w-[50px] text-xs text-center border rounded px-1 py-0.5"
            autoFocus
            placeholder="minutes"
            min="5"
            max="480"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full px-1">
          <div className="text-xs text-left leading-tight pl-3">
            {time.includes("-") ? (
              <>
                <span>{time.split("-")[0]}-</span>
                <wbr />
                <span>{time.split("-")[1]}</span>
              </>
            ) : (
              <span>{time}</span>
            )}
          </div>
        </div>
      )}

      {hoveredColumn === index && editingDuration === null && (
        <div className="absolute -top-1 right-1 z-[100]">
          <Popover
            open={openPopover === index}
            onOpenChange={onOpenPopoverChange}
          >
            <PopoverTrigger asChild>
              <button className="bg-white border border-gray-300 rounded p-1 shadow-lg hover:bg-gray-50 outline-none">
                <MoreVertical size={12} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="center" sideOffset={5}>
              <div className="flex flex-col">
                <button
                  onClick={onStartEditingDuration}
                  className="px-3 py-2 text-left text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <span>✏️</span> Edit Duration
                </button>
                <button
                  onClick={onAddColumnAfter}
                  className="px-3 py-2 text-left text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <span>➕</span> Add Column
                </button>
                <button
                  onClick={onDeleteColumn}
                  disabled={columnCount <= 1}
                  className={`px-3 py-2 text-left text-sm rounded flex items-center gap-2 ${
                    columnCount > 1
                      ? "hover:bg-red-50 text-red-600"
                      : "text-gray-400 cursor-not-allowed"
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
  );
};
