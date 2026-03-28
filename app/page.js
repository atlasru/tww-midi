import React, { useEffect, useState } from "react";

export default function MidiGallery() {
  const [midis, setMidis] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/thewildwestmidis/midis/contents")
      .then((res) => res.json())
      .then((data) => {
        const midiFiles = data.filter((file) => file.name.endsWith(".mid"));
        setMidis(midiFiles);
        setLoading(false);
      });
  }, []);

  const filtered = midis.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b12] via-[#12121f] to-[#1b1b2f] text-white px-6 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-blue-200 text-transparent bg-clip-text">
            MIDI Library
          </h1>
          <p className="text-sm text-gray-400 mt-1">created by atlasru</p>
        </div>

        <input
          type="text"
          placeholder="Search MIDI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-300/40 placeholder-gray-400"
        />
      </header>

      {loading && (
        <div className="text-center text-gray-400">Loading MIDI files...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((midi) => (
          <div
            key={midi.name}
            className="group backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300"
          >
            <h2 className="text-base font-medium mb-3 truncate group-hover:text-purple-200 transition">
              {midi.name}
            </h2>

            <audio controls className="w-full mb-3 opacity-80 group-hover:opacity-100 transition">
              <source src={midi.download_url} type="audio/midi" />
            </audio>

            <div className="flex justify-between items-center text-sm">
              <a
                href={midi.download_url}
                target="_blank"
                rel="noreferrer"
                className="text-purple-300 hover:text-purple-200 transition"
              >
                Download
              </a>

              <a
                href={midi.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No MIDI files found.
        </div>
      )}
    </div>
  );
}