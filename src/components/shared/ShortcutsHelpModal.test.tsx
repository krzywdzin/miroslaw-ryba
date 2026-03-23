import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'shortcuts.title': 'Keyboard Shortcuts',
        'shortcuts.navigate': 'Navigate between stages',
        'shortcuts.chatFocus': 'Focus chat input',
        'shortcuts.panelSwitch': 'Switch panels',
        'shortcuts.help': 'Help (shortcuts)',
      };
      return map[key] ?? key;
    },
  }),
}));

import { ShortcutsHelpModal } from './ShortcutsHelpModal';

describe('ShortcutsHelpModal', () => {
  it('renders dialog with title when open', () => {
    render(<ShortcutsHelpModal open={true} onOpenChange={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Keyboard Shortcuts' })).toBeInTheDocument();
  });

  it('renders all 4 shortcut entries', () => {
    render(<ShortcutsHelpModal open={true} onOpenChange={() => {}} />);
    expect(screen.getByText('Navigate between stages')).toBeInTheDocument();
    expect(screen.getByText('Focus chat input')).toBeInTheDocument();
    expect(screen.getByText('Switch panels')).toBeInTheDocument();
    expect(screen.getByText('Help (shortcuts)')).toBeInTheDocument();
  });

  it('renders kbd elements with correct key labels', () => {
    render(<ShortcutsHelpModal open={true} onOpenChange={() => {}} />);
    expect(screen.getByText('1-5')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('[ ]')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('does not render content when open is false', () => {
    render(<ShortcutsHelpModal open={false} onOpenChange={() => {}} />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });
});
