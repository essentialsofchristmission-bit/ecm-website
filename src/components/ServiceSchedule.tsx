import { nextService, startTime, type ServiceTime } from "@/lib/schedule";

// An icon that fits each service: prayer for prayer meetings, a church for Sunday, an open Bible otherwise.
function ServiceIcon({ s }: { s: ServiceTime }) {
  const cls = "h-7 w-7";
  if (/prayer/i.test(s.name))
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c-.6 0-1 .5-1 1v6.5L7.6 14a3 3 0 00-.6 1.8V21M12 3c.6 0 1 .5 1 1v6.5l3.4 3.5a3 3 0 01.6 1.8V21M9 21h6" /></svg>;
  if (/sunday/i.test(`${s.day} ${s.name}`))
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 014 0v5" /></svg>;
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5V19.5" /></svg>;
}

/** The weekly services as cards, with the next (or current) one marked. */
export default function ServiceSchedule({ services }: { services: ServiceTime[] }) {
  const next = nextService(services);
  return (
    <ul className="grid gap-5 sm:grid-cols-3">
      {services.map((s) => {
        const isNext = next?.name === s.name;
        return (
          <li
            key={s.name}
            className={`group relative flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 ${isNext ? "ring-2 ring-ecm-green" : "ring-gray-100"}`}
          >
            {isNext && (
              <span className={`absolute -top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${next.onNow ? "bg-ecm-red-dark" : "bg-ecm-green"}`}>
                {next.onNow ? "On now" : "Next"}
              </span>
            )}
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ecm-green/10 text-ecm-green transition-colors group-hover:bg-ecm-green group-hover:text-white">
              <ServiceIcon s={s} />
            </span>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-ecm-red-dark">{s.day}</p>
            <p className="mt-1 font-display text-5xl uppercase leading-none text-ecm-navy">{startTime(s)}</p>
            <p className="mt-3 text-lg font-bold text-ecm-green">{s.name}</p>
            <p className="mt-1 text-sm text-gray-600">{s.time}</p>
          </li>
        );
      })}
    </ul>
  );
}
