import { useMutation } from '@tanstack/react-query'

export function useConnectionTest<T>(testFn: () => Promise<T>) {
  const mutation = useMutation({
    mutationFn: testFn,
  })

  return {
    test: () => mutation.mutate(),
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  }
}
