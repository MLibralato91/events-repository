const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const WEEKDAY_LETTERS = ["L", "M", "M", "G", "V", "S", "D"];

export default function EventCalendar({ date }: { date: Date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = lunedì
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <p className="text-center font-serif text-lg text-ink mb-4">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAY_LETTERS.map((w, i) => (
          <span key={i} className="stub-label text-[0.6rem]">
            {w}
          </span>
        ))}

        {cells.map((d, i) =>
          d === null ? (
            <span key={i} />
          ) : (
            <span key={i} className="relative flex items-center justify-center h-9">
              <span
                className={
                  d === day
                    ? "flex items-center justify-center w-8 h-8 rounded-full bg-ink text-paper-card font-semibold text-sm"
                    : "text-sm text-ink/80"
                }
              >
                {d}
              </span>
              {d === day && (
                <span className="absolute -top-1 -right-0.5 text-accent text-xs">
                  ♥
                </span>
              )}
            </span>
          )
        )}
      </div>
    </div>
  );
}
