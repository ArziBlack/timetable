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

## Core Components

### Data Structure
- **Teachers**: Each teacher has an ID, name, subjects they can teach, maximum periods per day, and unavailable time slots
- **Subjects**: Each subject has an ID, name, assigned teacher, number of periods per week, priority level, and constraints
- **Timetable Database**: Manages the collection of teachers, subjects, blocked slots, and blocked texts

### UI Components
- **Grid System**: Flexible grid with rows (days) and columns (time periods)
- **Cell Management**: Select, merge, edit, and format cells
- **Database Manager**: Interface for managing teachers and subjects
- **Grid Controls**: Tools for grid layout management and data export

## Key Features
- Time management with custom durations per column
- Cell merging for activities spanning multiple periods
- Intelligent automated scheduling algorithm
- Data export as JSON

## Technical Implementation
- Built with React + TypeScript + Vite
- Uses React hooks for state management
- Component-based architecture with clear separation of concerns

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Add teachers and subjects using the Database Manager
2. Either manually create a timetable by editing cells or use the auto-generate feature
3. Export your timetable data when finished

## Development

This project uses Vite with HMR and ESLint rules. Two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
