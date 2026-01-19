import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from './App';

// Mock fetch globally
global.fetch = vi.fn();

describe('App Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders the application header', () => {
        render(React.createElement(App));

        expect(screen.getByText('QuoteMaster')).toBeInTheDocument();
        expect(screen.getByText('AI Beta')).toBeInTheDocument();
    });

    it('renders ChatArea component', () => {
        render(React.createElement(App));

        // Looking for welcome message or chat container
        const chatContainer = screen.getByRole('main');
        expect(chatContainer).toBeInTheDocument();
    });

    it('renders InputArea component', () => {
        render(React.createElement(App));

        // Look for input element (placeholder "Escribe...")
        const input = screen.getByPlaceholderText(/escribe/i);
        expect(input).toBeInTheDocument();
    });

    it('displays version number', () => {
        render(React.createElement(App));

        expect(screen.getByText('v1.2.0')).toBeInTheDocument();
    });
});
