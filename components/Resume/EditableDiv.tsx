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
    if (ref.current) {
      if (!value && !isFocused) {
        ref.current.innerText = placeholder;
      } else if (value !== ref.current.innerText) {
        ref.current.innerText = value;
      }
    }
  }, [value, placeholder, isFocused]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue !== placeholder && newValue !== value) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (ref.current && ref.current.innerText === placeholder) {
      ref.current.innerText = "";
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (ref.current && ref.current.innerText.trim() === "") {
      ref.current.innerText = placeholder;
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded min-w-[4em] shadow-elevationLight p-0.5 ${className} ${
        !value && !isFocused ? "text-gray-400" : ""
      }`}
    />
  );
};

export default EditableDiv;