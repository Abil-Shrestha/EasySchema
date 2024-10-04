import React, { useState, useRef, useEffect } from "react";

interface EditableDivProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const EditableDiv: React.FC<EditableDivProps> = ({ value, onChange, placeholder, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.textContent) {
      ref.current.textContent = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (ref.current && !ref.current.textContent?.trim()) {
      // Set cursor at the beginning of the div
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(ref.current, 0);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded min-w-[4em] shadow-elevationLight p-0.5 ${className}`}
        style={{ minHeight: '1.5em', wordBreak: 'break-word' }}
      />
      {!isFocused && !value && (
        <div className="absolute top-0 left-0 p-0.5 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default EditableDiv;