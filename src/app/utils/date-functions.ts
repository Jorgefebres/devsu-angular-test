export function addYearsToDate(initialDate: Date, yearsToAdd: number) {
  const year = initialDate.getFullYear();
  const month = initialDate.getMonth();
  const day = initialDate.getDate();
  return new Date(year + yearsToAdd, month, day);
}

export function getFormattedDate(initialDate: string) {
  const dateParts = initialDate.split(/-|\//);
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}

export function getFormattedDateToTime(initialDate: string) {
  const [d, m, y] = initialDate.split(/-|\//);
  return new Date(+y, +m - 1, +d).getTime();
}
