import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock matchMedia before importing the hook
const mockMatchMedia = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

beforeEach(() => {
  // Clear localStorage
  localStorage.clear();

  // Clear document classes
  document.documentElement.classList.remove('dark');

  // Setup matchMedia mock
  mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  // We import dynamically so the mock is in place
  async function importUseTheme() {
    // Reset module cache to get fresh import
    vi.resetModules();
    const mod = await import('./useTheme');
    return mod.useTheme;
  }

  it('defaults to "system" when no localStorage value exists', async () => {
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('reads initial theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark');
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme("dark") adds "dark" class to document.documentElement', async () => {
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setTheme("light") removes "dark" class from document.documentElement', async () => {
    document.documentElement.classList.add('dark');
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setTheme("dark") sets localStorage "theme" to "dark"', async () => {
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('setTheme("light") sets localStorage "theme" to "light"', async () => {
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('setTheme("system") removes localStorage "theme" key', async () => {
    localStorage.setItem('theme', 'dark');
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('resolvedTheme is "dark" when theme is "system" and OS prefers dark', async () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('resolvedTheme is "light" when theme is "system" and OS prefers light', async () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('listens for OS theme changes when theme is "system"', async () => {
    const useTheme = await importUseTheme();
    renderHook(() => useTheme());

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('cleans up OS theme change listener on unmount', async () => {
    const useTheme = await importUseTheme();
    const { unmount } = renderHook(() => useTheme());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
