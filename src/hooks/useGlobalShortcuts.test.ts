import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock react-router
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Capture useHotkeys registrations
const hotkeyCallbacks = new Map<string, { callback: (...args: unknown[]) => void; options: Record<string, unknown> }>();

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: (keys: string, callback: (...args: unknown[]) => void, options?: Record<string, unknown>) => {
    hotkeyCallbacks.set(keys, { callback, options: options ?? {} });
  },
}));

import { useGlobalShortcuts } from './useGlobalShortcuts';

beforeEach(() => {
  vi.clearAllMocks();
  hotkeyCallbacks.clear();
});

describe('useGlobalShortcuts', () => {
  it('returns helpOpen state and setHelpOpen', () => {
    const { result } = renderHook(() => useGlobalShortcuts());
    expect(result.current.helpOpen).toBe(false);
    expect(typeof result.current.setHelpOpen).toBe('function');
  });

  it('registers hotkeys for keys 1 through 5', () => {
    renderHook(() => useGlobalShortcuts());
    expect(hotkeyCallbacks.has('1')).toBe(true);
    expect(hotkeyCallbacks.has('2')).toBe(true);
    expect(hotkeyCallbacks.has('3')).toBe(true);
    expect(hotkeyCallbacks.has('4')).toBe(true);
    expect(hotkeyCallbacks.has('5')).toBe(true);
  });

  it('registers hotkeys for /, ?, [, ]', () => {
    renderHook(() => useGlobalShortcuts());
    expect(hotkeyCallbacks.has('/')).toBe(true);
    expect(hotkeyCallbacks.has('shift+/')).toBe(true);
    expect(hotkeyCallbacks.has('[')).toBe(true);
    expect(hotkeyCallbacks.has(']')).toBe(true);
  });

  it('navigates to /graph when key 1 callback fires', () => {
    renderHook(() => useGlobalShortcuts());
    hotkeyCallbacks.get('1')!.callback();
    expect(mockNavigate).toHaveBeenCalledWith('/graph');
  });

  it('navigates to /environment when key 2 callback fires', () => {
    renderHook(() => useGlobalShortcuts());
    hotkeyCallbacks.get('2')!.callback();
    expect(mockNavigate).toHaveBeenCalledWith('/environment');
  });

  it('navigates to /simulation when key 3 callback fires', () => {
    renderHook(() => useGlobalShortcuts());
    hotkeyCallbacks.get('3')!.callback();
    expect(mockNavigate).toHaveBeenCalledWith('/simulation');
  });

  it('navigates to /history when key 4 callback fires', () => {
    renderHook(() => useGlobalShortcuts());
    hotkeyCallbacks.get('4')!.callback();
    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });

  it('navigates to /chat when key 5 callback fires', () => {
    renderHook(() => useGlobalShortcuts());
    hotkeyCallbacks.get('5')!.callback();
    expect(mockNavigate).toHaveBeenCalledWith('/chat');
  });

  it('all hotkeys use enableOnFormTags: false', () => {
    renderHook(() => useGlobalShortcuts());
    for (const [, entry] of hotkeyCallbacks) {
      expect(entry.options).toHaveProperty('enableOnFormTags', false);
    }
  });

  it('shift+/ sets helpOpen to true', () => {
    const { result } = renderHook(() => useGlobalShortcuts());
    act(() => {
      hotkeyCallbacks.get('shift+/')!.callback();
    });
    expect(result.current.helpOpen).toBe(true);
  });

  it('dispatches panel-prev event on [ key', () => {
    renderHook(() => useGlobalShortcuts());
    const handler = vi.fn();
    window.addEventListener('panel-prev', handler);
    hotkeyCallbacks.get('[')!.callback();
    expect(handler).toHaveBeenCalled();
    window.removeEventListener('panel-prev', handler);
  });

  it('dispatches panel-next event on ] key', () => {
    renderHook(() => useGlobalShortcuts());
    const handler = vi.fn();
    window.addEventListener('panel-next', handler);
    hotkeyCallbacks.get(']')!.callback();
    expect(handler).toHaveBeenCalled();
    window.removeEventListener('panel-next', handler);
  });
});
