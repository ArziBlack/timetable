import React, { useState } from 'react';
import type { TimetableTemplate, TimetableDatabase } from '../interfaces/database';
import { saveAsTemplate, saveTemplateToDatabase, applyTemplate, deleteTemplate, getTemplates } from '../lib/template';
import type { CellContent } from '../interfaces/types';

interface TemplateManagerProps {
  database: TimetableDatabase;
  onDatabaseUpdate: (database: TimetableDatabase) => void;
  cellContents: Map<string, CellContent>;
  mergedCells: Map<string, any>;
  hiddenCells: Set<string>;
  columnCount: number;
  columnDurations: { [key: number]: number };
  defaultSlotDuration: number;
  onApplyTemplate: (template: ReturnType<typeof applyTemplate>) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  database,
  onDatabaseUpdate,
  cellContents,
  mergedCells,
  hiddenCells,
  columnCount,
  columnDurations,
  defaultSlotDuration,
  onApplyTemplate,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const templates = getTemplates(database);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const template = saveAsTemplate(
      templateName,
      cellContents,
      mergedCells,
      hiddenCells,
      columnCount,
      columnDurations,
      defaultSlotDuration
    );
    
    // Add description if provided
    if (templateDescription) {
      template.description = templateDescription;
    }

    const updatedDatabase = saveTemplateToDatabase(template, database);
    onDatabaseUpdate(updatedDatabase);
    setShowSaveModal(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const result = applyTemplate(template);
      onApplyTemplate(result);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedDatabase = deleteTemplate(templateId, database);
      onDatabaseUpdate(updatedDatabase);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Timetable Templates</h2>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowSaveModal(true)}
        >
          Save Current as Template
        </button>
      </div>

      {/* Template List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {templates.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No templates saved yet. Create your first template by clicking the button above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-500">{template.description}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Created: {template?.createdAt ? new Date(template.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleApplyTemplate(template.id)}
                  >
                    Apply
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Save as Template</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="templateName">
                Template Name
              </label>
              <input
                id="templateName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="templateDescription">
                Description (optional)
              </label>
              <textarea
                id="templateDescription"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Enter template description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShowSaveModal(false);
                  setTemplateName('');
                  setTemplateDescription('');
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveTemplate}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};