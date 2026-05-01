/**
 * Splits an array into chunks of a specified size.
 * @param arr - The array to split.
 * @param gridCount - The size of each chunk.
 * @returns A 2D array of chunks.
 */
export const getSplitArr = <T>(arr: T[], gridCount = 10): T[][] => {
  return new Array(Math.ceil(arr.length / gridCount))
    .fill(null)
    .map((_, i) => arr.slice(gridCount * i, gridCount * i + gridCount));
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};