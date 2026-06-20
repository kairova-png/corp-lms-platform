"use client";

import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

/** Поле ввода с подписью, подсказкой и состоянием ошибки. */
export function Input({ label, hint, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium mb-1.5 text-ink">{label}</span>}
      <input
        className={`w-full h-11 rounded-lg border bg-white px-3.5 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-zinc-300 focus:border-brand focus:ring-brand/20"
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-zinc-400">{hint}</span>
      ) : null}
    </label>
  );
}
