import { NextResponse } from "next/server";
import { EVENT, eventStartUtc, eventEndUtc, formatIcsUtc } from "@/lib/event";

export async function GET() {
  const start = eventStartUtc();
  const end = eventEndUtc();

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSVP Party//IT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@rsvp-party`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${EVENT.age} anni di ${EVENT.name}`,
    `LOCATION:${EVENT.venue}, ${EVENT.address}`,
    "DESCRIPTION:Ti aspettiamo per festeggiare insieme!",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${EVENT.name.toLowerCase()}-${EVENT.age}-anni.ics"`,
    },
  });
}
