export function addYearsToDate(initialDate: Date, yearsToAdd: number): Date {
  const year = initialDate.getFullYear();
  const month = initialDate.getMonth();
  const day = initialDate.getDate();
  return new Date(year + yearsToAdd, month, day);
}

export function getFormattedDate(initialDate: string): Date | null {
  if (!initialDate) return null;
  const dateParts = initialDate.split(/-|\//);
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}

export function getFormattedDateToTime(initialDate: string): number {
  const [d, m, y] = initialDate.split(/-|\//);
  return new Date(+y, +m - 1, +d).getTime();
}
