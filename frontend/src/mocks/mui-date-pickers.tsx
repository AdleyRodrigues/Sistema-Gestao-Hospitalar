import React from 'react';
import { TextField } from '@mui/material';

// Mock do DatePicker
export const DatePicker = ({ label, value, onChange, ...props }: any) => {
    return (
        <TextField
            label={label}
            type="date"
            value={value instanceof Date ? value.toISOString().split('T')[0] : value}
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
export const TimePicker = ({ label, value, onChange, ...props }: any) => {
    return (
        <TextField
            label={label}
            type="time"
            value={value instanceof Date ? `${value.getHours()}:${value.getMinutes()}` : value}
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