interface Paddle {
  Checkout: {
    open(args: { product: number; passthrough?: string; email?: string })
  }
}

export function usePaddle(): Paddle | undefined {
  if (typeof window !== "undefined") {
    return (window as any).Paddle
  }

  return undefined
}
