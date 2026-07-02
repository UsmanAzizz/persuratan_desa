import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}, ref) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`px-4 py-2 bg-white border rounded-lg text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-rose-500 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
