import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// localStorage mock
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
};

// matchMedia mock
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

function setupMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches: prefersDark,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    }),
  });
}

beforeEach(() => {
  // Clear store
  Object.keys(store).forEach((key) => delete store[key]);
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();

  // Install localStorage mock
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    configurable: true,
    value: localStorageMock,
  });

  // Clear document classes
  document.documentElement.classList.remove('dark');

  // Reset mocks
  mockAddEventListener.mockClear();
  mockRemoveEventListener.mockClear();

  // Default: OS prefers light
  setupMatchMedia(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  async function importUseTheme() {
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
    store['theme'] = 'dark';
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

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('setTheme("light") sets localStorage "theme" to "light"', async () => {
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('setTheme("system") removes localStorage "theme" key', async () => {
    store['theme'] = 'dark';
    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme');
  });

  it('resolvedTheme is "dark" when theme is "system" and OS prefers dark', async () => {
    setupMatchMedia(true);

    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('resolvedTheme is "light" when theme is "system" and OS prefers light', async () => {
    setupMatchMedia(false);

    const useTheme = await importUseTheme();
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('listens for OS theme changes when theme is "system"', async () => {
    const useTheme = await importUseTheme();
    renderHook(() => useTheme());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('cleans up OS theme change listener on unmount', async () => {
    const useTheme = await importUseTheme();
    const { unmount } = renderHook(() => useTheme());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
