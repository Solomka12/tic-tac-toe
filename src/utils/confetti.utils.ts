import confetti from 'canvas-confetti';

/**
 * Fires confetti animations.
 * @param angle - The angle of the confetti.
 * @param origin - The origin point of the confetti.
 */
export const fireConfetti = (
  angle = 90,
  { x = 0.5, y = 0.5 }: { x?: number; y?: number }
) => {
  const defaults = { angle, ticks: 400, origin: { x, y } };

  confetti({
    ...defaults,
    particleCount: 40,
    spread: 26,
    startVelocity: 55,
  });
  confetti({
    ...defaults,
    particleCount: 30,
    spread: 60,
    gravity: 0.8,
  });
  confetti({
    ...defaults,
    particleCount: 50,
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    gravity: 1.1,
  });
  confetti({
    ...defaults,
    particleCount: 15,
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    gravity: 0.9,
  });
  confetti({
    ...defaults,
    particleCount: 15,
    spread: 120,
    startVelocity: 45,
  });
};