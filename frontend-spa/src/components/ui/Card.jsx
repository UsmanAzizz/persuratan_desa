import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, description, className = '' }) => {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center ${className}`}>
      {children}
    </div>
  );
};
