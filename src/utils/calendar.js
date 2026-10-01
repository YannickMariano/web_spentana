import { SITE } from '../constants/site';

// Liens « Ajouter à l'agenda » pour un événement de src/data/events.js.
// Les événements sont sur la journée entière : la date de fin est exclusive
// (lendemain du dernier jour), comme l'attendent Google Agenda et le format iCal.

const compact = (iso) => iso.replaceAll('-', '');

function nextDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + 1));
  return date.toISOString().slice(0, 10);
}

function bounds(event) {
  return { start: compact(event.start), end: compact(nextDay(event.end ?? event.start)) };
}

export function googleCalendarUrl(event) {
  const { start, end } = bounds(event);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} · ${SITE.name}`,
    dates: `${start}/${end}`,
    details: event.desc ?? '',
    location: SITE.address,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Échappement des caractères spéciaux du format iCal (RFC 5545).
const icsText = (s) => String(s ?? '').replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// Télécharge un fichier .ics (Apple Calendrier, Outlook, Android...).
export function downloadIcs(event) {
  const { start, end } = bounds(event);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE.name}//Evenements//FR`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@spentana`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsText(`${event.title} · ${SITE.name}`)}`,
    `DESCRIPTION:${icsText(event.desc)}`,
    `LOCATION:${icsText(SITE.address)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
