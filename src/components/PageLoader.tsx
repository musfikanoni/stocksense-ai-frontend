"use client";
import { useEffect, useState } from "react";

/* Fake candlestick data for the animated chart */
const CANDLES = [
  { h: 72, l: 48, o: 55, c: 68 },
  { h: 78, l: 60, o: 68, c: 62 },
  { h: 85, l: 58, o: 62, c: 80 },
  { h: 88, l: 70, o: 80, c: 74 },
  { h: 90, l: 68, o: 74, c: 86 },
  { h: 92, l: 76, o: 86, c: 78 },
  { h: 95, l: 72, o: 78, c: 90 },
];

function CandleChart({ loop = false }: { loop?: boolean }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => (v < CANDLES.length ? v + 1 : loop ? 1 : v));
    }, 220);
    return () => clearInterval(id);
  }, [loop]);

  const maxH = 100;

  return (
    <svg
      viewBox="0 0 112 100"
      className="w-28 h-28"
      aria-hidden="true"
    >
      {/* Subtle grid lines */}
      {[25, 50, 75].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="112"
          y2={y}
          stroke="rgba(245,200,75,0.08)"
          strokeWidth="0.5"
        />
      ))}

      {CANDLES.map((c, i) => {
        const x = 8 + i * 15;
        const bullish = c.c >= c.o;
        const color = bullish ? "#3ddc84" : "#ff4d5e";
        const bodyTop = Math.min(c.o, c.c);
        const bodyH = Math.abs(c.c - c.o) || 2;
        const opacity = i < visible ? 1 : 0;
        const scaledBodyTop = maxH - c.h + (c.h - bodyTop);
        const scaledBodyH = bodyH;
        const wickTop = maxH - c.h;
        const wickBot = maxH - c.l;

        return (
          <g
            key={i}
            style={{
              opacity,
              transition: "opacity 0.25s ease",
            }}
          >
            {/* Wick */}
            <line
              x1={x + 3}
              y1={wickTop}
              x2={x + 3}
              y2={wickBot}
              stroke={color}
              strokeWidth="1"
            />
            {/* Body */}
            <rect
              x={x}
              y={scaledBodyTop}
              width="6"
              height={scaledBodyH}
              rx="0.5"
              fill={color}
            />
          </g>
        );
      })}

      {/* Moving average line */}
      <polyline
        points={CANDLES.slice(0, visible)
          .map((c, i) => `${8 + i * 15 + 3},${maxH - (c.h + c.l) / 2}`)
          .join(" ")}
        fill="none"
        stroke="rgba(245,200,75,0.7)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ transition: "all 0.25s ease" }}
      />
    </svg>
  );
}

function TickerBadge({ text, change }: { text: string; change: string }) {
  const up = change.startsWith("+");
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-mono transition-transform duration-200 hover:scale-110 cursor-default"
      style={{
        background: up
          ? "rgba(61,220,132,0.12)"
          : "rgba(255,77,94,0.12)",
        color: up ? "#3ddc84" : "#ff4d5e",
        border: `1px solid ${up ? "rgba(61,220,132,0.25)" : "rgba(255,77,94,0.25)"}`,
      }}
    >
      <span className="font-semibold">{text}</span>
      <span>{change}</span>
    </span>
  );
}

export interface PageLoaderProps {
  fullScreen?: boolean;
  autoClose?: boolean;
  message?: string;
  className?: string;
}

export default function PageLoader({
  fullScreen = true,
  autoClose = false,
  message,
  className = "",
}: PageLoaderProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (autoClose) {
      // If user already saw splash in this session, skip immediately for instant page render
      if (typeof window !== "undefined" && sessionStorage.getItem("ss_splash_shown")) {
        setDone(true);
        return;
      }

      // First entrance in session: snappy 650ms high-fidelity branded welcome
      const duration = 650;
      const start = performance.now();
      let raf: number;

      const step = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(Math.round(eased * 100));
        if (p < 1) {
          raf = requestAnimationFrame(step);
        } else {
          try {
            sessionStorage.setItem("ss_splash_shown", "1");
          } catch {}
          setTimeout(() => setDone(true), 150);
        }
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    } else {
      // Smooth continuous progress reaching ~90% while data loads
      const duration = 1600;
      const start = performance.now();
      let raf: number;

      const step = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(Math.round(eased * 88));
        if (p < 1) {
          raf = requestAnimationFrame(step);
        }
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }
  }, [autoClose]);

  if (autoClose && done) return null;

  return (
    <div
      aria-label="Loading StockSense AI"
      className={className}
      style={{
        position: fullScreen ? "fixed" : "relative",
        inset: fullScreen ? 0 : undefined,
        zIndex: fullScreen ? 9999 : 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? undefined : "420px",
        width: "100%",
        background: fullScreen ? "#000000" : "transparent",
        backgroundImage: fullScreen
          ? "radial-gradient(60rem 28rem at 50% -8%, rgba(245,200,75,0.09), transparent 70%)"
          : "radial-gradient(35rem 20rem at 50% 50%, rgba(245,200,75,0.06), transparent 70%)",
        opacity: autoClose && done ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: autoClose && done ? "none" : "all",
      }}
    >
      {/* Background shimmer dots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "rgba(245,200,75,0.25)",
              left: `${5 + (i * 5.5) % 90}%`,
              top: `${10 + (i * 7) % 80}%`,
              animation: `pulse ${1.5 + (i % 4) * 0.4}s ${(i * 0.15) % 1.2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          animation: mounted ? "fadeUp 0.5s cubic-bezier(.2,.7,.2,1) both" : "none",
        }}
      >
        {/* Logo + Candle Chart side by side */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Logo mark */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #c99a1e, #f5c84b, #ffe58a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 32px rgba(245,200,75,0.35)",
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>

          {/* Animated candlestick chart */}
          <CandleChart loop={!autoClose} />
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            StockSense{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #c99a1e, #f5c84b, #ffe58a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI
            </span>
          </h1>
          <p
            style={{
              marginTop: "0.35rem",
              fontSize: "0.78rem",
              color: "#a39b85",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Intelligent market insights
          </p>
        </div>

        {/* Live ticker badges */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <TickerBadge text="AAPL" change="+1.24%" />
          <TickerBadge text="TSLA" change="-0.87%" />
          <TickerBadge text="NVDA" change="+3.15%" />
          <TickerBadge text="MSFT" change="+0.63%" />
        </div>

        {/* Progress bar */}
        <div style={{ width: 220 }}>
          <div
            style={{
              height: 3,
              borderRadius: 99,
              background: "rgba(245,200,75,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: 99,
                background:
                  "linear-gradient(90deg, #c99a1e, #f5c84b, #ffe58a)",
                boxShadow: "0 0 12px rgba(245,200,75,0.5)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.7rem",
              color: "#a39b85",
              textAlign: "center",
              letterSpacing: "0.06em",
            }}
          >
            {message ||
              (progress < 40
                ? "Fetching market data…"
                : progress < 75
                ? "Running AI analysis…"
                : progress < 95
                ? "Building your dashboard…"
                : "Ready")}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.2; transform: scale(1); }
          to   { opacity: 0.8; transform: scale(2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
