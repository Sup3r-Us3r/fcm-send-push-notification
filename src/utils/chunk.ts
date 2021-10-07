export function chunk(array: any[], chunkSize: number) {
  if (chunkSize <= 0) {
    throw 'Invalid chunk size';
  }

  const results = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }

  return results;
}
