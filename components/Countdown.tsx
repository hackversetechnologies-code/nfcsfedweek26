"use client";
import { useEffect, useState } from "react";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export default function Countdown({ target, dark = false }: { target: string; dark?: boolean }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const targetMs = new Date(target).getTime();
    const update = () => {
      const diff = Math.max(0, targetMs - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      });
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [target]);

  const border = dark ? "border-white/15" : "border-border";
  const tag = dark ? "text-[#8C8C86]" : "text-gray-muted";

  const units: [string, number][] = [["Days", t.d], ["Hours", t.h], ["Min", t.m], ["Sec", t.s]];

  return (
    <div className={`flex justify-center items-baseline border-t border-b ${border} py-6`}>
      {units.map(([label, val], i) => (
        <div key={label} className={`flex-1 px-1 ${i > 0 ? `border-l ${border}` : ""}`}>
          <div className="font-serif font-medium text-[clamp(34px,9vw,54px)] leading-none tabular-nums">
            {pad(val)}
          </div>
          <span className={`block mt-2 text-[10px] uppercase tracking-wide ${tag}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
