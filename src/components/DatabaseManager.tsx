/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DatabaseManager.tsx
import React, { useState } from 'react';
import { Plus, Trash2, Users, BookOpen, Zap, Database } from 'lucide-react';
import type { Teacher, Subject, TimetableDatabase } from '../interfaces/database';

interface DatabaseManagerProps {
  database: TimetableDatabase;
  onDatabaseUpdate: (database: TimetableDatabase) => void;
  onGenerateTimetable: () => void;
  onLoadSampleData?: () => void;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  database,
  onDatabaseUpdate,
  onGenerateTimetable,
  onLoadSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects'>('teachers');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    subjects: [],
    maxPeriodsPerDay: 3
  });
  
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    teacherId: '',
    periodsPerWeek: 3,
    priority: 'medium'
  });

  const addTeacher = () => {
    if (!newTeacher.name?.trim()) return;
    
    const teacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: newTeacher.name.trim(),
      subjects: newTeacher.subjects || [],
      maxPeriodsPerDay: newTeacher.maxPeriodsPerDay || 3,
      unavailableSlots: newTeacher.unavailableSlots || []
    };
    
    onDatabaseUpdate({
      ...database,
      teachers: [...database.teachers, teacher]
    });
    
    setNewTeacher({ name: '', subjects: [], maxPeriodsPerDay: 3 });
    setShowAddTeacher(false);
  };

  const removeTeacher = (teacherId: string) => {
    onDatabaseUpdate({
      ...database,
      teachers: database.teachers.filter((t: Teacher) => t.id !== teacherId),
      subjects: database.subjects.filter((s: Subject) => s.teacherId !== teacherId)
    });
  };

  const addSubject = () => {
    if (!newSubject.name?.trim() || !newSubject.teacherId) return;
    
    const subject: Subject = {
      id: `subject-${Date.now()}`,
      name: newSubject.name.trim(),
      teacherId: newSubject.teacherId,
      periodsPerWeek: newSubject.periodsPerWeek || 3,
      priority: newSubject.priority || 'medium',
      duration: newSubject.duration,
      preferredSlots: newSubject.preferredSlots || [],
      avoidConsecutive: newSubject.avoidConsecutive || false
    };
    
    onDatabaseUpdate({
      ...database,
      subjects: [...database.subjects, subject]
    });
    
    setNewSubject({ name: '', teacherId: '', periodsPerWeek: 3, priority: 'medium' });
    setShowAddSubject(false);
  };

  const removeSubject = (subjectId: string) => {
    onDatabaseUpdate({
      ...database,
      subjects: database.subjects.filter((s: Subject) => s.id !== subjectId)
    });
  };

  const updateBlockedTexts = (texts: string) => {
    const textArray = texts.split(',').map(t => t.trim()).filter(t => t);
    onDatabaseUpdate({
      ...database,
      blockedTexts: textArray
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="text-red-500">🔴</span>;
      case 'medium': return <span className="text-yellow-500">🟡</span>;
      case 'low': return <span className="text-green-500">🟢</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Timetable Database
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onGenerateTimetable}
            disabled={database.subjects.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              database.subjects.length > 0
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4" />
            Auto-Generate Timetable
          </button>
          
          {onLoadSampleData && (
            <button
              onClick={onLoadSampleData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <Database className="w-4 h-4" />
              Load Sample Data
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'teachers' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Teachers ({database.teachers.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'subjects' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Subjects ({database.subjects.length})
        </button>
      </div>

      {/* Teachers Tab */}
      {activeTab === 'teachers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Teachers</h3>
            <button
              onClick={() => setShowAddTeacher(!showAddTeacher)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
          </div>

          {showAddTeacher && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Teacher Name"
                  value={newTeacher.name || ''}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Max Periods Per Day"
                  value={newTeacher.maxPeriodsPerDay || ''}
                  onChange={(e) => setNewTeacher({ ...newTeacher, maxPeriodsPerDay: parseInt(e.target.value) || 3 })}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addTeacher}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add Teacher
                </button>
                <button
                  onClick={() => setShowAddTeacher(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {database.teachers.map((teacher: Teacher) => (
              <div key={teacher.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <span className="font-medium">{teacher.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    (Max: {teacher.maxPeriodsPerDay} periods/day)
                  </span>
                </div>
                <button
                  onClick={() => removeTeacher(teacher.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {database.teachers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No teachers added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <button
              onClick={() => setShowAddSubject(!showAddSubject)}
              disabled={database.teachers.length === 0}
              className={`px-3 py-1 rounded flex items-center gap-1 text-sm ${
                database.teachers.length > 0
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          {showAddSubject && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={newSubject.name || ''}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <select
                  value={newSubject.teacherId || ''}
                  onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select Teacher</option>
                  {database.teachers.map((teacher: Teacher) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Periods Per Week"
                  value={newSubject.periodsPerWeek || ''}
                  onChange={(e) => setNewSubject({ ...newSubject, periodsPerWeek: parseInt(e.target.value) || 3 })}
                  className="border rounded px-3 py-2"
                  min="1"
                  max="10"
                />
                <select
                  value={newSubject.priority || 'medium'}
                  onChange={(e) => setNewSubject({ ...newSubject, priority: e.target.value as any })}
                  className="border rounded px-3 py-2"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSubject.avoidConsecutive || false}
                    onChange={(e) => setNewSubject({ ...newSubject, avoidConsecutive: e.target.checked })}
                  />
                  <span className="text-sm">Avoid consecutive periods</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addSubject}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add Subject
                </button>
                <button
                  onClick={() => setShowAddSubject(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {database.subjects.map((subject: Subject) => {
              const teacher = database.teachers.find((t: Teacher) => t.id === subject.teacherId);
              return (
                <div key={subject.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(subject.priority)}
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-gray-500 text-sm">
                      by {teacher?.name} • {subject.periodsPerWeek} periods/week
                    </span>
                    {subject.avoidConsecutive && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Non-consecutive
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {database.subjects.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                {database.teachers.length === 0 
                  ? 'Add teachers first to create subjects'
                  : 'No subjects added yet'
                }
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blocked Texts Configuration */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Blocked Texts</h3>
        <p className="text-gray-600 text-sm mb-3">
          Cells containing these texts will be skipped during auto-generation (comma-separated):
        </p>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          value={(database.blockedTexts || []).join(', ')}
          onChange={(e) => updateBlockedTexts(e.target.value)}
          placeholder="break, short break, devotion, assembly, lunch, recess"
        />
      </div>
    </div>
  );
};