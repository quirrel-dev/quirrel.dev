interface Paddle {
  Audience: {
    subscribe(email: string, consent: boolean, callback: () => void): void
  }
}

export function usePaddle(): Paddle | undefined {
  if (typeof window !== "undefined") {
    return (window as any).Paddle
  }

  return undefined
}
