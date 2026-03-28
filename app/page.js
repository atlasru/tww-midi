"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export default function MidiGallery() {
  const [midis, setMidis] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/thewildwestmidis/midis/contents")
      .then((res) => res.json())
      .then((data) => {
        const midiFiles = data.filter((f) => f.name.endsWith(".mid"));
        setMidis(midiFiles);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return midis.filter((m) => m.name.toLowerCase().includes(s));
  }, [midis, search]);

  const play = (m) => {
    setCurrent(m);
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.src = m.download_url;
        audioRef.current.play().catch(() => {});
      }
    });
  };

  // simple windowing (ultra-light): render only first N + more on scroll
  const [limit, setLimit] = useState(60);
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setLimit((l) => Math.min(l + 60, filtered.length));
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white px-4 md:px-6 py-6">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            MIDI Library
          </h1>
          <p className="text-xs text-gray-400 mt-1">created by atlasru</p>
        </div>

        <input
          type="text"
          placeholder="Search MIDI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
        />
      </header>

      {/* Global Player */}
      <div className="sticky top-2 z-10 mb-4 bg-[#11111a] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="truncate text-sm text-gray-300">
          {current ? current.name : "Nothing playing"}
        </div>
        <audio ref={audioRef} controls preload="none" className="w-56" />
      </div>

      {loading && <div className="text-gray-400">Loading…</div>}

      {/* List (ultra light) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visible.map((m) => (
          <button
            key={m.name}
            onClick={() => play(m)}
            className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition"
          >
            <div className="text-sm font-medium truncate mb-2">{m.name}</div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Play</span>
              <a
                href={m.download_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-white"
              >
                Download
              </a>
            </div>
          </button>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No MIDI files found.</div>
      )}

      {visible.length < filtered.length && (
        <div className="text-center text-gray-500 mt-6">Loading more…</div>
      )}
    </div>
  );
}
