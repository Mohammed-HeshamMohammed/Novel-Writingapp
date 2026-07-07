import React, { useState } from 'react';

interface FormField {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

interface SidebarModalProps {
  type: string;
  item?: any;
  themeClasses: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const FORM_FIELDS: Record<string, FormField[]> = {
  chapter: [
    { name: 'title', placeholder: 'Chapter title', required: true },
    { name: 'number', placeholder: 'Chapter number (e.g., 1, 2, Prologue)' },
    { 
      name: 'status', 
      type: 'select',
      options: ['Draft', 'In Progress', 'Completed', 'Needs Review'],
      defaultValue: 'Draft'
    }
  ],
  character: [
    { name: 'name', placeholder: 'Character name', required: true },
    { name: 'role', placeholder: 'Role (e.g., Protagonist, Antagonist)' },
    { name: 'description', type: 'textarea', placeholder: 'Character description' }
  ],
  location: [
    { name: 'name', placeholder: 'Location name', required: true },
    { name: 'description', type: 'textarea', placeholder: 'Location description' }
  ],
  timeline: [
    { name: 'title', placeholder: 'Event title', required: true },
    { name: 'date', placeholder: 'Date (e.g., Day 1, Morning, 1985)' },
    { name: 'description', type: 'textarea', placeholder: 'Event description' }
  ]
};

export const SidebarModal: React.FC<SidebarModalProps> = ({
  type,
  item,
  themeClasses,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<any>(item ? { 
    title: item.title || '',
    number: item.number || '',
    status: item.status || 'Draft',
    name: item.name || '',
    role: item.role || '',
    description: item.description || '',
    date: item.date || ''
  } : {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanFormData = { ...formData };
      
      if (type === 'chapter' && String(cleanFormData.number).trim() === '') {
        cleanFormData.number = undefined;
      }

      onSubmit(cleanFormData);
    } catch (error) {
      console.error(`Error ${item ? 'updating' : 'adding'} ${type}:`, error);
    }
  };

  const renderFormField = (field: FormField) => {
    const commonProps = {
      key: field.name,
      value: formData[field.name] || field.defaultValue || '',
      onChange: (e: any) => setFormData({ ...formData, [field.name]: e.target.value }),
      className: `w-full p-3 ${themeClasses.input} rounded-xl border mb-3`,
      placeholder: field.placeholder,
      required: field.required
    };

    if (field.type === 'select') {
      return (
        <select {...commonProps}>
          {field.options?.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          className={`${commonProps.className} h-24 resize-none`}
        />
      );
    }

    return <input type="text" {...commonProps} />;
  };

  const typeFields = FORM_FIELDS[type];
  if (!typeFields) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.cardBg} p-6 rounded-2xl border ${themeClasses.border} backdrop-blur-xl w-full max-w-md`}>
        <h3 className={`${themeClasses.text} text-lg font-semibold mb-4`}>
          {item ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <form onSubmit={handleSubmit}>
          {typeFields.map(renderFormField)}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              {item ? 'Save' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 ${themeClasses.cardBg} ${themeClasses.text} rounded-xl border ${themeClasses.border} ${themeClasses.hover} transition-colors`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};