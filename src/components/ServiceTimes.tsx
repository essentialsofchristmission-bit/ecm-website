import { site } from "@/lib/content";
import { ClockIcon } from "./Icons";

export default function ServiceTimes({ light = false }: { light?: boolean }) {
  return (
    <ul className="space-y-3">
      {site.serviceTimes.map((s) => (
        <li key={s.name} className={`flex items-start gap-3 rounded-xl p-4 ${light ? "bg-white/10 text-white" : "bg-ecm-cream text-gray-800"}`}>
          <ClockIcon className={`mt-0.5 h-5 w-5 shrink-0 ${light ? "text-white" : "text-ecm-green"}`} />
          <div>
            <p className="font-bold">{s.name}</p>
            <p className={`text-sm ${light ? "text-white/85" : "text-gray-600"}`}>{s.day}, {s.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
