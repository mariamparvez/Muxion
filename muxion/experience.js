// Experience anniversary: 1 September 2018, measured in India time.
export function experienceYears(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric'}).formatToParts(now);
  const year = Number(parts.find(part => part.type === 'year').value);
  const month = Number(parts.find(part => part.type === 'month').value);
  return Math.max(0, year - 2018 - (month < 9 ? 1 : 0));
}
