import React from "react";
import PhoneInputLib from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const PhoneInput = ({
  value,
  onChange,
  placeholder = "Phone number",
  disabled = false,
  className = "",
  showValidation = false,
  label,
  required = false,
}) => {
  const isValid = value ? isValidPhoneNumber(value) : null;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}{required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-center rounded-md border bg-white dark:bg-navy-700 transition-colors ${
          showValidation && value
            ? isValid
              ? "border-green-500"
              : "border-red-500"
            : "border-gray-300 dark:border-navy-500"
        }`}
      >
        <PhoneInputLib
          international
          countryCallingCodeEditable={false}
          defaultCountry="IN"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="phone-input-custom w-full"
          style={{ "--PhoneInputCountryFlag-height": "1em" }}
        />
      </div>
      {showValidation && value && !isValid && (
        <p className="mt-1 text-xs text-red-500">
          Enter a valid international phone number (e.g. +91 98765 43210)
        </p>
      )}
      <style>{`
        .phone-input-custom {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px 12px;
          gap: 8px;
        }
        .phone-input-custom .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .phone-input-custom .PhoneInputCountrySelect {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .phone-input-custom .PhoneInputCountrySelectArrow {
          width: 0.3em;
          height: 0.3em;
          border-color: #6b7280;
          opacity: 1;
        }
        .phone-input-custom .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: inherit;
          font-size: 0.875rem;
          padding: 0;
        }
        .dark .phone-input-custom .PhoneInputInput {
          color: white;
        }
        .phone-input-custom .PhoneInputInput::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export { isValidPhoneNumber };
export default PhoneInput;