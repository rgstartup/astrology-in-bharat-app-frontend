"use client";

import React from "react";

interface FormInputProps {
  label: string;
  type?: "text" | "email" | "tel" | "date" | "time" | "number" | "textarea";
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value = "",
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  rows,
  options
}) => {
  const baseClassName = `form-control ${className}`;

  if (type === "textarea" || rows) {
    return (
      <div className="w-100">
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <textarea
          className={baseClassName}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows || 3}
        />
      </div>
    );
  }

  if (options) {
    return (
      <div className="w-100">
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <select
          className={`${baseClassName} form-select`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
        >
          <option value="">{placeholder || "Select option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-100">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className={baseClassName}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </div>
  );
};

export default FormInput;



