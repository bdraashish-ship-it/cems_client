// components/widgets/DatePickerField.tsx
import React from 'react';
import { Calendar } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerFieldProps {
  label?: string;
  value?: string | Dayjs | null;          // ISO string or Dayjs object
  onChange?: (date: Dayjs | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minDate?: string | Dayjs;
  maxDate?: string | Dayjs;
  className?: string;
  inputFormat?: string;                   // e.g. "DD/MM/YYYY"
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = "Select date",
  minDate,
  maxDate,
  className = "",
  inputFormat = "DD/MM/YYYY",
}) => {
  const hasError = !!error;

  return (
    <div className={`input-field ${hasError ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="input-field__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-field__wrapper">
        <Calendar size={16} className="input-field__icon" />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={onChange}
            disabled={disabled}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            format={inputFormat}
            slotProps={{
              textField: {
                placeholder,
                error: hasError,
                helperText: hasError ? error : undefined,
                fullWidth: true,
                variant: 'outlined',
                InputProps: {
                  // Remove default MUI underline & padding conflicts
                  disableUnderline: true,
                  sx: {
                    '& fieldset': { border: 'none' },
                    paddingLeft: '44px !important', // space for calendar icon
                    '& input': {
                      padding: '8px 14px 8px 0',
                      fontSize: '0.9rem',
                      height: '40px',
                      boxSizing: 'border-box',
                    },
                  },
                },
                // Match your error style
                FormHelperTextProps: {
                  sx: {
                    margin: '4px 0 0 0',
                    fontSize: '0.75rem',
                    color: '#dc2626',
                  },
                },
              },
            }}
            sx={{
              width: '100%',
              // Make sure the picker popup looks modern
              '& .MuiPickersPopper-root': {
                zIndex: 1500,
              },
              '& .MuiPickersDay-root': {
                '&.Mui-selected': {
                  backgroundColor: '#2563eb',
                  color: 'white',
                  '&:hover': { backgroundColor: '#1e40af' },
                },
              },
              '& .MuiPickersCalendarHeader-root': {
                color: '#111827',
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Custom error message below (optional – if you prefer your own style over MUI helperText) */}
      {hasError && !error?.includes('helperText') && (
        <span className="input-field__error">{error}</span>
      )}
    </div>
  );
};