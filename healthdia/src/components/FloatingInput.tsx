/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isRTL?: boolean;
  className?: string;
  onFocus?: any;
  onBlur?: any;
  value?: any;
  required?: boolean;
  onChange?: (e: any) => void;
}

export function FloatingInput(allProps: FloatingInputProps) {
  const { label, isRTL, className = '', onFocus, onBlur, value, ...props } = allProps;
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className="relative w-full">
      <input
        {...props}
        value={value}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`w-full text-xs sm:text-sm p-4 pt-6 pb-2 border border-zinc-200 rounded-xl focus:border-zinc-950 focus:outline-none transition-all font-sans bg-zinc-50/20 focus:bg-white ${className} ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      />
      <label
        className={`absolute pointer-events-none transition-all duration-250 text-xs font-semibold tracking-tight ${
          focused || hasValue
            ? 'top-2 text-[9px] text-zinc-450 font-bold uppercase'
            : 'top-4 text-zinc-400'
        } ${isRTL ? 'right-4 left-auto' : 'left-4 right-auto'}`}
      >
        {label}
      </label>
    </div>
  );
}

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isRTL?: boolean;
  className?: string;
  onFocus?: any;
  onBlur?: any;
  value?: any;
  required?: boolean;
  onChange?: (e: any) => void;
}

export function FloatingTextarea(allProps: FloatingTextareaProps) {
  const { label, isRTL, className = '', onFocus, onBlur, value, ...props } = allProps;
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        value={value}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`w-full text-xs sm:text-sm p-4 pt-6 pb-2 border border-zinc-200 rounded-xl focus:border-zinc-950 focus:outline-none transition-all font-sans bg-zinc-50/20 focus:bg-white ${className} ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      />
      <label
        className={`absolute pointer-events-none transition-all duration-250 text-xs font-semibold tracking-tight ${
          focused || hasValue
            ? 'top-2 text-[9px] text-zinc-450 font-bold uppercase'
            : 'top-4 text-zinc-400'
        } ${isRTL ? 'right-4 left-auto' : 'left-4 right-auto'}`}
      >
        {label}
      </label>
    </div>
  );
}
