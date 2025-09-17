# Timetable Generator Application

A React-based application for creating and managing school timetables both manually and automatically.

## Features

### Manual Timetable Creation
- Interactive grid system with days (Monday-Friday) and customizable time periods
- Cell selection, merging, and formatting options
- Text editing with alignment and orientation controls
- Custom time durations for each column

### Automated Timetable Generation
- Define teachers with subjects they can teach and availability constraints
- Configure subjects with required periods per week and priority levels
- Automatically generate optimal timetables respecting all constraints
- Block specific slots for breaks, lunch, assemblies, etc.

### Template Management
- Save current timetable layouts as reusable templates
- Apply templates to quickly set up new timetables
- Manage multiple templates with names and descriptions
- Templates preserve column structure and time durations

## Core Components

### Data Structure
- **Teachers**: Each teacher has an ID, name, subjects they can teach, maximum periods per day, and unavailable time slots
- **Subjects**: Each subject has an ID, name, assigned teacher, number of periods per week, priority level, and constraints
- **Classes**: Each class has an ID, name, and assigned subjects
- **Templates**: Saved timetable layouts with metadata and cell contents
- **Timetable Database**: Manages the collection of teachers, subjects, classes, blocked slots, and templates

### UI Components
- **Grid System**: Flexible grid with rows (days) and columns (time periods)
- **Cell Management**: Select, merge, edit, and format cells
- **Database Manager**: Interface for managing teachers, subjects, and classes
- **Template Manager**: Interface for saving, applying, and managing templates
- **Grid Controls**: Tools for grid layout management and data export
- **Class Timetable**: Individual timetable view for each class

## Key Features
- Time management with custom durations per column
- Cell merging for activities spanning multiple periods
- Intelligent automated scheduling algorithm
- Template system for reusing timetable layouts
- Data export as JSON and PDF

## Technical Implementation
- Built with React + TypeScript + Vite
- Uses React hooks for state management
- Component-based architecture with clear separation of concerns

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── components/             # UI components
│   ├── ClassTimetable.tsx  # Individual class timetable view
│   ├── DatabaseManager.tsx # Interface for managing database entities
│   ├── TemplateManager.tsx # Interface for template management
│   ├── gridcell.tsx        # Grid cell component
│   ├── gridcontrols.tsx    # Grid control tools
│   └── gridheader.tsx      # Grid header component
├── hooks/
│   └── usegrid.ts          # Custom hook for grid functionality
├── interfaces/             # TypeScript interfaces
│   ├── database.ts         # Database entity interfaces
│   └── types.ts            # Common type definitions
├── lib/                    # Utility functions
│   ├── template.ts         # Template management functions
│   ├── timetable.ts        # Timetable generation logic
│   └── util.ts             # General utility functions
└── mock/
    └── sample.ts           # Sample data for testing
```

## Key Functions

### Template Management
- `saveAsTemplate`: Creates a template from current timetable state
- `saveTemplateToDatabase`: Persists a template to the database
- `applyTemplate`: Applies a template to the current timetable
- `deleteTemplate`: Removes a template from the database

### Timetable Generation
- `handleGenerateAutomatedTimetableWithAlert`: Generates timetables with validation
- `extractTimetableData`: Converts grid data to structured timetable entries
- `exportTimetableToPDF`: Exports timetable to PDF format

### Grid Management
- `mergeCells`: Combines selected cells
- `resetGrid`: Clears the grid and resets to default state
- `handleExportData`: Exports timetable data as JSON

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Add teachers, subjects, and classes using the Database Manager
2. Either manually create a timetable by editing cells or use the auto-generate feature
3. Save useful layouts as templates for future use
4. Export your timetable data when finished

## Development

This project uses Vite with HMR and ESLint rules. Two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
