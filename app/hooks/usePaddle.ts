interface Paddle {
  Audience: {
    subscribe(email: string, consent: boolean, callback: () => void): void
  }
}

export function usePaddle(): Paddle {
  return (window as any).Paddle
}
