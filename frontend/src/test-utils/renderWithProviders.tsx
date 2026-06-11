import React from 'react';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react-native';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
    return render(ui, options);
}
