// interface InputProps {
//   label: string;
//   placeholder?: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const Input = ({ label, placeholder, value, onChange }: InputProps) => {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-slate-600 mb-1">
//         {label}
//       </label>
//       <input
//         value={value}
//         placeholder={placeholder}
//         onChange={onChange}
//         className="w-full rounded-lg border px-3 py-2"
//       />
//     </div>
//   );
// };

// export default Input;


import React, { type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

const Input = ({ label, icon, className, ...props }: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          {...props}
          className={`w-full rounded-lg border px-3 py-2 ${
            icon ? "pl-9" : ""
          } ${className ?? ""}`}
        />
      </div>
    </div>
  );
};

export default Input;
