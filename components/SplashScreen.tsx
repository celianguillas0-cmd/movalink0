"use client";
import { useEffect, useState } from "react";
import { LogoMark } from "./Icons";

const LETTERS = "ovalink".split("");

export default function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 1100);
    const t2 = setTimeout(() => setGone(true), 1550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        transition: "opacity 0.45s ease, transform 0.45s ease",
        opacity: hiding ? 0 : 1,
        transform: hiding ? "translateY(-10px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          color: "#fff",
        }}
      >
        <div className="ml-splash-m" style={{ width: "2.25rem", height: "2.25rem" }}>
          <LogoMark className="w-full h-full" />
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "var(--font-geist-sans), -apple-system, sans-serif",
            fontSize: "1.625rem",
            fontWeight: 600,
            letterSpacing: "-0.025em",
          }}
        >
          {LETTERS.map((char, i) => (
            <span
              key={i}
              className="ml-splash-char"
              style={{ animationDelay: `${175 + i * 72}ms` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
