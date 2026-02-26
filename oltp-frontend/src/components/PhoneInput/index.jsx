import React, { useState } from "react";
import PhoneInputLib from "react-phone-number-input";
import { isValidPhoneNumber as libIsValid, parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const isValidPhoneNumber = (value) => {
  if (!value) return false;
  try {
    if (!libIsValid(value)) return false;
    const parsed = parsePhoneNumber(value);
    return !!(parsed && parsed.isValid());
  } catch {
    return false;
  }
};

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
  const [touched, setTouched] = useState(false);

  const hasValue = value !== undefined && value !== null && value !== "";
  const valid = hasValue ? isValidPhoneNumber(value) : false;

  const shouldValidate = touched || showValidation;
  const showError = shouldValidate && hasValue && !valid;
  const showSuccess = shouldValidate && hasValue && valid;
  const showRequired = showValidation && !hasValue;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-center rounded-md border bg-white dark:bg-navy-700 transition-colors ${
          showSuccess
            ? "border-green-500"
            : showError || showRequired
            ? "border-red-500"
            : "border-gray-300 dark:border-navy-500"
        }`}
      >
        <PhoneInputLib
          international
          countryCallingCodeEditable={false}
          defaultCountry="IN"
          value={value}
          onChange={(val) => {
            setTouched(true);
            onChange(val);
          }}
          onBlur={() => setTouched(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="phone-input-custom w-full"
          style={{ "--PhoneInputCountryFlag-height": "1em" }}
        />
      </div>
      {showRequired && (
        <p className="mt-1 text-xs text-red-500">This field is required</p>
      )}
      {showError && (
        <p className="mt-1 text-xs text-red-500">
          Enter a valid phone number (e.g. +91 98765 43210)
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

export default PhoneInput;