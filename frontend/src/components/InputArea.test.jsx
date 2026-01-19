import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import InputArea from './InputArea';

describe('InputArea Component', () => {
    it('renders input field', () => {
        const mockOnSend = vi.fn();
        render(React.createElement(InputArea, { onSend: mockOnSend, disabled: false }));

        const input = screen.getByPlaceholderText(/escribe/i);
        expect(input).toBeInTheDocument();
    });

    it('input accepts text', () => {
        const mockOnSend = vi.fn();
        render(React.createElement(InputArea, { onSend: mockOnSend, disabled: false }));

        const input = screen.getByPlaceholderText(/escribe/i);
        fireEvent.change(input, { target: { value: 'test message' } });

        expect(input.value).toBe('test message');
    });

    it('disables input when disabled prop is true', () => {
        const mockOnSend = vi.fn();
        render(React.createElement(InputArea, { onSend: mockOnSend, disabled: true }));

        const input = screen.getByPlaceholderText(/escribe/i);
        expect(input).toBeDisabled();
    });
});
