import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

// Interfaces para os props dos componentes
interface DatePickerProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    label?: string;
    value?: Date | null;
    onChange?: (date: Date | null) => void;
}

interface TimePickerProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    label?: string;
    value?: Date | null;
    onChange?: (date: Date | null) => void;
}

// Mock do DatePicker
export const DatePicker = ({ label, value, onChange, ...props }: DatePickerProps) => {
    return (
        <TextField
            label={label}
            type="date"
            value={value instanceof Date ? value.toISOString().split('T')[0] : value || ''}
            onChange={(e) => {
                if (onChange) {
                    onChange(new Date(e.target.value));
                }
            }}
            {...props}
        />
    );
};

// Mock do TimePicker
export const TimePicker = ({ label, value, onChange, ...props }: TimePickerProps) => {
    return (
        <TextField
            label={label}
            type="time"
            value={value instanceof Date ? `${value.getHours()}:${value.getMinutes().toString().padStart(2, '0')}` : value || ''}
            onChange={(e) => {
                if (onChange) {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const date = new Date();
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    onChange(date);
                }
            }}
            {...props}
        />
    );
};

// Mock do LocalizationProvider
export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

// Mock do AdapterDateFns
export const AdapterDateFns = function () { }; 