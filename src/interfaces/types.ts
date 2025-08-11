// types.ts
export interface MergeInfo {
    rowSpan: number;
    colSpan: number;
  }
  
  export interface ColumnTimes {
    start: number;
    end: number;
    duration: number;
  }
  
  export interface GridState {
    selectedCells: Set<string>;
    mergedCells: Map<string, MergeInfo>;
    hiddenCells: Set<string>;
    columnCount: number;
    hoveredColumn: number | null;
    openPopover: number | null;
    editingDuration: number | null;
    tempDuration: string;
    defaultSlotDuration: number;
    editingDefaultDuration: boolean;
    tempDefaultDuration: string;
    columnDurations: { [key: number]: number };
  }
  
  export interface GridActions {
    handleCellClick: (row: number, col: number) => void;
    mergeCells: () => void;
    addColumnAfter: (afterColumnIndex: number) => void;
    deleteColumn: (columnIndex: number) => void;
    startEditingDuration: (columnIndex: number) => void;
    saveDurationEdit: () => void;
    cancelDurationEdit: () => void;
    saveDefaultDurationEdit: () => void;
    cancelDefaultDurationEdit: () => void;
    resetGrid: () => void;
    setHoveredColumn: (column: number | null) => void;
    setOpenPopover: (popover: number | null) => void;
    setTempDuration: (duration: string) => void;
    setTempDefaultDuration: (duration: string) => void;
    setEditingDefaultDuration: (editing: boolean) => void;
  }