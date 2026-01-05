import React, { useState, useEffect, useCallback, useRef } from "react";
import { Vibe, View, SurpriseData } from "./types";
import { generateAIMessage } from "./services/geminiService";
import { FloatingElements } from "./components/FloatingHearts";
import { RunawayButton } from "./components/RunawayButton";

const App: React.FC = () => {
  const [view, setView] = useState<View>("HOME");
  const [data, setData] = useState<SurpriseData>({
    vibe: Vibe.LOVE,
    recipientName: "",
    senderName: "",
    message: "",
    photo: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnveiling, setIsUnveiling] = useState(false);
  const [isUnveiled, setIsUnveiled] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state from URL
  const syncStateFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const themeStr = params.get("v")?.toUpperCase();
    const encodedData = params.get("d");
    const photoData = params.get("p");

    if (themeStr && encodedData) {
      try {
        const decodedData = decodeURIComponent(escape(atob(encodedData)));
        const details = decodedData.split("|");
        const matchedVibe = Object.values(Vibe).find(
          (v) => v === themeStr,
        ) as Vibe;

        if (matchedVibe && details.length >= 2) {
          setData({
            vibe: matchedVibe,
            recipientName: details[0] || "",
            senderName: details[1] || "",
            message: details[2] || "",
            photo: photoData || "",
          });
          setView("SURPRISE");
          setIsUnveiled(false);
        }
      } catch (e) {
        console.error("Failed to decode data", e);
        setView("HOME");
      }
    } else {
      setView("HOME");
    }
  }, []);

  // Parse URL on mount
  useEffect(() => {
    syncStateFromURL();
    window.addEventListener("popstate", syncStateFromURL);
    return () => window.removeEventListener("popstate", syncStateFromURL);
  }, [syncStateFromURL]);

  // Sync URL from state
  useEffect(() => {
    if (view === "SURPRISE" || view === "FORM") {
      const params = new URLSearchParams();
      params.set("v", data.vibe.toLowerCase());

      const payload = [data.recipientName, data.senderName, data.message].join(
        "|",
      );

      params.set("d", btoa(unescape(encodeURIComponent(payload))));

      if (data.photo && !data.photo.startsWith("data:")) {
        params.set("p", data.photo);
      }

      const newSearch = `?${params.toString()}`;

      if (window.location.search !== newSearch) {
        window.history.replaceState({}, "", newSearch);
      }
    }
  }, [data, view]);

  const handleVibeSelect = (vibe: Vibe) => {
    setData((prev) => ({ ...prev, vibe }));
    setView("FORM");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createMagic = async () => {
    if (!data.recipientName || !data.senderName) {
      alert("Please provide both names to personalize the magic.");
      return;
    }

    setIsProcessing(true);
    let finalMessage = data.message;
    if (!finalMessage.trim()) {
      finalMessage = await generateAIMessage(data.vibe, data.recipientName);
    }

    setData((prev) => ({ ...prev, message: finalMessage }));

    setTimeout(() => {
      setIsProcessing(false);
      setView("SURPRISE");
      setIsUnveiled(false);
    }, 1500);
  };

  const handleUnveil = () => {
    setIsUnveiling(true);
    setTimeout(() => {
      setIsUnveiled(true);
      setIsUnveiling(false);
    }, 1200);
  };

  const reset = () => {
    setData({
      vibe: Vibe.LOVE,
      recipientName: "",
      senderName: "",
      message: "",
      photo: "",
    });
    setIsUnveiled(false);
    setShowCelebrate(false);
    setView("HOME");
    window.history.pushState({}, "", window.location.pathname);
  };

  const Watermark = () => (
    <a
      href="https://github.com/jignesh1236"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-[999] text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/80 transition-all duration-500 font-mono flex items-center gap-1 group"
    >
      <span>Jignesh</span>
      <span className="hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {"{"}github.com/jignesh1236{"}"}
      </span>
    </a>
  );

  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-white rounded-full animate-spin"></div>
        </div>
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase font-bold text-white/40 animate-pulse">
          Forging Your Surprise
        </p>
        <Watermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <Watermark />

      {view === "HOME" && (
        <main className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col items-center">
          <header className="text-center mb-16 md:mb-20 space-y-4">
            <div className="inline-block px-4 py-1 border border-white/10 rounded-full mb-4">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/50">
                Version 2.8 • Premium Experience
              </span>
            </div>
            <h1 className="text-5xl md:text-9xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 leading-tight">
              SURPRISE<span className="text-white/10">ME</span>
            </h1>
            <p className="text-white/30 text-sm md:text-lg font-light tracking-widest max-w-md md:max-w-xl mx-auto px-4">
              Elevate your emotions into a luxury digital masterpiece. Choose
              your frequency.
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 w-full max-w-5xl">
            <button
              onClick={() => handleVibeSelect(Vibe.LOVE)}
              className="col-span-2 md:col-span-8 group relative overflow-hidden glass-card rounded-[30px] md:rounded-[60px] p-6 md:p-10 text-left transition-all active:scale-95 md:hover:scale-[0.98]"
            >
              <div className="absolute top-6 right-6 md:top-10 md:right-10 text-4xl md:text-6xl group-hover:scale-125 transition-transform duration-700">
                ❤️
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-red-500 font-bold mb-2 md:mb-4 block">
                01 / Romance
              </span>
              <h2 className="text-3xl md:text-7xl font-bold mb-2 md:mb-4">
                Cinematic Love
              </h2>
              <p className="text-white/30 text-sm md:text-lg">
                For the ones who own your heartbeat.
              </p>
              <div className="mt-8 md:mt-12 h-px w-12 md:w-20 bg-white/20 group-hover:w-full transition-all duration-1000"></div>
            </button>

            <button
              onClick={() => handleVibeSelect(Vibe.PROPOSE)}
              className="col-span-1 md:col-span-4 group relative overflow-hidden glass-card rounded-[30px] p-6 md:p-10 text-left transition-all active:scale-95 md:hover:scale-[0.98]"
            >
              <div className="absolute top-6 right-6 md:top-10 md:right-10 text-3xl md:text-4xl group-hover:rotate-45 transition-transform duration-700">
                💍
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-yellow-500 font-bold mb-2 md:mb-4 block">
                02 / PROPOSE
              </span>
              <h2 className="text-xl md:text-3xl font-bold">The One</h2>
            </button>

            <button
              onClick={() => handleVibeSelect(Vibe.SORRY)}
              className="col-span-1 md:col-span-4 group relative overflow-hidden glass-card rounded-[30px] p-6 md:p-10 text-left transition-all active:scale-95 md:hover:scale-[0.98]"
            >
              <div className="absolute top-6 right-6 md:top-10 md:right-10 text-3xl md:text-4xl group-hover:scale-90 transition-transform duration-700">
                🥺
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold mb-2 md:mb-4 block">
                03 / Peace
              </span>
              <h2 className="text-xl md:text-3xl font-bold">Forgive</h2>
            </button>

            <button
              onClick={() => handleVibeSelect(Vibe.FRIEND)}
              className="col-span-1 md:col-span-4 group relative overflow-hidden glass-card rounded-[30px] p-6 md:p-10 text-left transition-all active:scale-95 md:hover:scale-[0.98]"
            >
              <div className="absolute top-6 right-6 md:top-10 md:right-10 text-3xl md:text-4xl group-hover:animate-ping transition-all">
                ✨
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-purple-500 font-bold mb-2 md:mb-4 block">
                04 / Energy
              </span>
              <h2 className="text-xl md:text-3xl font-bold">Bestie</h2>
            </button>

            <button
              onClick={() => handleVibeSelect(Vibe.BIRTHDAY)}
              className="col-span-2 md:col-span-4 group relative overflow-hidden glass-card rounded-[30px] p-6 md:p-10 text-left transition-all active:scale-95 md:hover:scale-[0.98]"
            >
              <div className="absolute top-6 right-6 md:top-10 md:right-10 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-700">
                🎂
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-yellow-400 font-bold mb-2 md:mb-4 block">
                05 / Celebration
              </span>
              <h2 className="text-xl md:text-3xl font-bold">HBD!</h2>
            </button>
          </div>
        </main>
      )}

      {view === "FORM" && (
        <main className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-screen animate-reveal">
          <div className="w-full glass-card rounded-[40px] md:rounded-[50px] p-8 md:p-14 space-y-10 md:space-y-12 relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-1 bg-white/20 w-full`}
            ></div>

            <header className="space-y-4">
              <button
                onClick={() => setView("HOME")}
                className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all"
              >
                ← Return to Base
              </button>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                THE DATA
              </h2>
            </header>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group space-y-2">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold ml-1">
                      Hero / Recipient
                    </label>
                    <input
                      type="text"
                      value={data.recipientName}
                      onChange={(e) =>
                        setData({ ...data, recipientName: e.target.value })
                      }
                      placeholder="THEIR NAME"
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 md:py-4 focus:outline-none focus:border-white text-xl md:text-2xl font-bold placeholder:text-white/10 uppercase transition-all"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold ml-1">
                      The Author
                    </label>
                    <input
                      type="text"
                      value={data.senderName}
                      onChange={(e) =>
                        setData({ ...data, senderName: e.target.value })
                      }
                      placeholder="YOUR NAME"
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 md:py-4 focus:outline-none focus:border-white text-xl md:text-2xl font-bold placeholder:text-white/10 uppercase transition-all"
                    />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold ml-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.photo}
                    onChange={(e) =>
                      setData({ ...data, photo: e.target.value })
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 md:py-4 focus:outline-none focus:border-white text-xl md:text-2xl font-bold placeholder:text-white/10 transition-all"
                  />
                  <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">
                    Paste a link to keep it shareable
                  </p>
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold ml-1">
                  The Narrative (Optional)
                </label>
                <textarea
                  value={data.message}
                  onChange={(e) =>
                    setData({ ...data, message: e.target.value })
                  }
                  placeholder="LEAVE BLANK FOR AI POETRY..."
                  rows={3}
                  className="w-full bg-transparent border-b border-white/10 px-0 py-3 md:py-4 focus:outline-none focus:border-white text-base md:text-lg font-light placeholder:text-white/10 resize-none transition-all"
                />
              </div>

              <button
                onClick={createMagic}
                className="w-full bg-white text-black font-black py-5 md:py-6 rounded-full text-base md:text-lg uppercase tracking-[0.3em] active:scale-95 md:hover:bg-neutral-200 md:hover:scale-[1.02] transition-all shadow-2xl"
              >
                MANIFEST MAGIC ✦
              </button>
            </div>
          </div>
        </main>
      )}

      {view === "SURPRISE" && (
        <main
          className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 text-center transition-all duration-1000 overflow-hidden ${
            !isUnveiled
              ? "bg-black"
              : data.vibe === Vibe.LOVE
                ? "bg-[#0a0002]"
                : data.vibe === Vibe.PROPOSE
                  ? "bg-[#1a1710]"
                  : data.vibe === Vibe.SORRY
                    ? "bg-[#00040a]"
                    : data.vibe === Vibe.BIRTHDAY
                      ? "bg-[#0d0d00]"
                      : "bg-[#0a000a]"
          }`}
        >
          {!isUnveiled ? (
            <div
              className={`relative w-full h-full flex flex-col items-center justify-center space-y-12 ${isUnveiling ? "opacity-0 scale-150 blur-3xl transition-all duration-1000" : "opacity-100"}`}
            >
              <div className="absolute inset-0 mesh-bg opacity-30"></div>
              <div className="z-10 text-center space-y-8 px-4">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.8em] text-white/40 font-bold">
                  Encrypted Memory for
                </div>
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase break-words">
                  {data.recipientName}
                </h2>
                <button
                  onClick={handleUnveil}
                  className="unveil-button px-10 py-4 md:px-12 md:py-5 border border-white/20 rounded-full text-base md:text-lg uppercase tracking-[0.5em] font-light active:bg-white active:text-black md:hover:bg-white md:hover:text-black transition-all"
                >
                  Unveil Magic
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative flex flex-col items-center justify-center animate-reveal px-4 overflow-y-auto pt-20 pb-40">
              {/* THEME SPECIFIC BACKGROUNDS */}
              {data.vibe === Vibe.LOVE && (
                <>
                  <FloatingElements type="HEART" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,85,0.1),transparent_70%)]"></div>
                  <div className="relative space-y-8 md:space-y-12 max-w-4xl py-12 flex flex-col items-center">
                    {data.photo && (
                      <div className="relative mb-6">
                        <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border-8 border-red-500/20 p-2 overflow-hidden shadow-[0_0_80px_rgba(255,45,85,0.5)] animate-float">
                          <img
                            src={data.photo}
                            className="w-full h-full object-cover rounded-full"
                            alt="Memory"
                          />
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-4xl animate-pulse">
                          💖
                        </div>
                      </div>
                    )}

                    <div className={`text-8xl md:text-[15rem] opacity-5 absolute left-1/2 -translate-x-1/2 select-none animate-[heartbeat_2s_infinite] ${data.photo ? '-top-24 md:-top-40' : 'top-1/2 -translate-y-1/2'}`}>
                      ❤️
                    </div>
                    <h3 className="text-white/30 text-[9px] md:text-sm uppercase tracking-[1em] font-bold">
                      A Digital Love Letter
                    </h3>
                    <h2 className="romantic-font text-5xl md:text-[10rem] text-red-500 font-bold leading-tight drop-shadow-[0_0_50px_rgba(255,45,85,0.5)] break-words">
                      My {data.recipientName}
                    </h2>
                    <p className="text-xl md:text-5xl font-light leading-snug italic text-white/80 max-w-3xl mx-auto px-2 break-words">
                      "{data.message}"
                    </p>
                    <div className="pt-6 md:pt-10 flex flex-col items-center space-y-2">
                      <div className="w-px h-12 md:h-20 bg-gradient-to-b from-red-500 to-transparent"></div>
                      <p className="text-white/30 text-[9px] md:text-xs uppercase tracking-[0.5em]">
                        Yours Always, {data.senderName}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {data.vibe === Vibe.PROPOSE && (
                <>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  <div className="relative w-full max-w-6xl py-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
                    {data.photo && (
                      <div className="w-64 h-80 md:w-80 md:h-[30rem] border-4 border-[#d4af37] p-2 bg-neutral-900 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                        <img
                          src={data.photo}
                          className="w-full h-full object-cover opacity-80"
                          alt="Eternal Moment"
                        />
                      </div>
                    )}

                    <div className={`glass-card rounded-none border-0 p-6 md:p-12 space-y-12 md:space-y-16 flex flex-col items-center ${data.photo ? 'md:items-start text-center md:text-left' : 'text-center'} flex-1`}>
                      <div className="luxury-text elegant-font text-base md:text-2xl uppercase tracking-[0.4em] font-bold">
                        The Promise
                      </div>
                      <h2 className="elegant-font text-6xl md:text-[10rem] italic leading-none tracking-tighter text-white break-words">
                        {data.recipientName}
                      </h2>
                      <p className="text-xl md:text-4xl text-neutral-400 font-serif leading-relaxed italic max-w-2xl break-words">
                        "{data.message}"
                      </p>

                      {!showCelebrate ? (
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center pt-4 md:pt-8 w-full">
                          <button
                            onClick={() => setShowCelebrate(true)}
                            className="luxury-text px-10 py-5 md:px-16 md:py-6 border-2 border-yellow-600/50 rounded-none text-xl md:text-2xl font-black uppercase tracking-[0.4em] active:scale-110 md:hover:scale-110 transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] w-full md:w-auto"
                          >
                            YES, ALWAYS 💍
                          </button>
                          <RunawayButton
                            label="Maybe..."
                            className="text-white/10 border-white/5 text-sm"
                          />
                        </div>
                      ) : (
                        <div className="animate-reveal py-8 w-full">
                          <h3 className="luxury-text text-3xl md:text-7xl font-black italic tracking-widest leading-tight uppercase">
                            Confirmed For Eternity
                          </h3>
                          <div className="mt-4 flex justify-center md:justify-start gap-4 text-3xl md:text-4xl">
                            ✨ 🕊️ ✨
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {data.vibe === Vibe.SORRY && (
                <>
                  <FloatingElements type="BLOB" />
                  <div className="relative w-full max-w-4xl py-12 flex flex-col items-center gap-12">
                    {data.photo && (
                      <div className="absolute top-0 right-0 md:top-10 md:right-10 w-40 h-40 md:w-64 md:h-64 opacity-40 blur-[2px] hover:opacity-100 hover:blur-0 transition-all duration-1000">
                        <div className="w-full h-full rounded-[40%_60%_70%_30%_/_40%_50%_60%_40%] overflow-hidden border-2 border-blue-500/30">
                          <img
                            src={data.photo}
                            className="w-full h-full object-cover grayscale"
                            alt="Reflections"
                          />
                        </div>
                      </div>
                    )}

                    <div className={`space-y-10 md:space-y-12 max-w-2xl flex flex-col items-center relative z-10 ${!data.photo ? 'w-full' : ''}`}>
                      <h3 className="text-blue-400/50 text-[9px] md:text-[10px] uppercase tracking-[1em] font-bold">
                        Quiet Reflection
                      </h3>
                      <h2 className="text-5xl md:text-[9rem] font-bold tracking-tighter leading-none text-white/90 break-words text-center">
                        SORRY, <br /> {data.recipientName}
                      </h2>
                      <div className="p-8 md:p-16 border border-white/5 rounded-[40px] md:rounded-[80px] bg-white/[0.01] backdrop-blur-2xl w-full">
                        <p className="text-xl md:text-4xl font-light text-blue-100/80 leading-relaxed italic break-words text-center">
                          "{data.message}"
                        </p>
                      </div>
                      <p className="text-white/20 text-[9px] md:text-xs tracking-[0.5em] uppercase">
                        Sent with sincerity by {data.senderName}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {data.vibe === Vibe.FRIEND && (
                <>
                  <div className="fixed inset-0 cyber-grid opacity-20"></div>
                  <div className="relative w-full max-w-5xl space-y-10 md:space-y-12 py-12 flex flex-col items-center">
                    <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                      {["REAL", "ONE", "VIBE", "LEGEND"].map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 md:px-6 md:py-2 border-2 border-purple-500 text-purple-400 text-[10px] md:text-xs font-black tracking-widest skew-x-12"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`relative text-center w-full flex flex-col items-center ${!data.photo ? 'justify-center min-h-[40vh]' : ''}`}>
                      <h2
                        className={`text-6xl md:text-[14rem] font-black italic tracking-tighter uppercase text-transparent stroke-white break-words ${!data.photo ? 'relative z-10' : ''}`}
                        style={{ WebkitTextStroke: "1px white" }}
                      >
                        {data.recipientName}
                      </h2>

                      {data.photo && (
                        <div className="absolute -bottom-10 right-0 md:-right-10 w-48 h-56 md:w-64 md:h-72 bg-white p-2 rotate-12 shadow-[15px_15px_0px_#af52de] transform hover:scale-110 transition-transform duration-500 z-20">
                          <div className="w-full h-[85%] overflow-hidden">
                            <img
                              src={data.photo}
                              className="w-full h-full object-cover"
                              alt="The Duo"
                            />
                          </div>
                          <div className="text-black font-black text-[10px] mt-2 tracking-tighter uppercase">
                            STAY WILD / {new Date().getFullYear()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white text-black p-8 md:p-14 -rotate-2 skew-y-1 shadow-[10px_10px_0px_var(--friend)] md:shadow-[20px_20px_0px_var(--friend)] w-full text-center relative z-10">
                      <p className="text-2xl md:text-6xl font-black leading-none uppercase italic break-words">
                        "{data.message}"
                      </p>
                    </div>
                    <p className="text-white text-lg md:text-2xl font-mono tracking-tighter pt-6 md:pt-10">
                      &gt; {data.senderName} HITS THE HYPE TRAIN
                    </p>
                  </div>
                </>
              )}

              {data.vibe === Vibe.BIRTHDAY && (
                <>
                  <FloatingElements type="CONFETTI" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,0,0.05),transparent_70%)]"></div>
                  <div className="relative w-full max-w-5xl py-12 flex flex-col items-center">
                    {data.photo && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 -z-10 blur-xl scale-150 overflow-hidden">
                        <img
                          src={data.photo}
                          className="w-full h-full object-cover rounded-full"
                          alt="BG"
                        />
                      </div>
                    )}

                    <div className={`space-y-10 md:space-y-16 flex flex-col items-center text-center ${!data.photo ? 'w-full py-20' : ''}`}>
                      {data.photo && (
                        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
                          <div className="absolute inset-[-15px] border-2 border-yellow-400 rounded-full animate-[spin_8s_linear_infinite]"></div>
                          <div className="w-full h-full rounded-full border-4 border-white overflow-hidden shadow-[0_0_100px_rgba(255,223,0,0.5)]">
                            <img
                              src={data.photo}
                              className="w-full h-full object-cover"
                              alt="The Icon"
                            />
                          </div>
                          <div className="absolute -top-4 -left-4 text-5xl">
                            👑
                          </div>
                        </div>
                      )}

                      <h3 className="text-yellow-400 text-[9px] md:text-sm uppercase tracking-[1.5em] font-black animate-pulse">
                        The World Celebrates You
                      </h3>
                      <div className="space-y-4">
                        <h2 className="text-6xl md:text-[12rem] font-black tracking-tighter leading-none italic uppercase bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent break-words">
                          HAPPY <br /> BIRTHDAY
                        </h2>
                        <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white break-words uppercase">
                          {data.recipientName}
                        </h2>
                      </div>
                      <div className="glass-card rounded-none p-8 md:p-16 border-l-4 border-l-yellow-400 transform hover:scale-[1.02] transition-transform w-full">
                        <p className="text-2xl md:text-6xl font-black italic leading-tight text-white/90 break-words">
                          "{data.message}"
                        </p>
                      </div>
                      <p className="text-yellow-400/50 text-[10px] md:text-sm tracking-[0.8em] uppercase font-bold">
                        Handcrafted by {data.senderName} ✦
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="fixed bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-center justify-center gap-4 bg-gradient-to-t from-black to-transparent z-[300]">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      alert(
                        "Link copied to clipboard! Share it with your special someone.",
                      );
                    } catch (err) {
                      alert(
                        "Failed to copy link. Please copy the URL from your browser's address bar.",
                      );
                    }
                  }}
                  className="px-8 py-3 md:px-10 md:py-4 glass-card rounded-full text-white/60 hover:text-white transition-all flex items-center gap-3 group text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase border border-white/5"
                >
                  🔗 Copy Shareable Link
                </button>
                <button
                  onClick={reset}
                  className="px-8 py-3 md:px-10 md:py-4 glass-card rounded-full text-white/40 active:text-white md:hover:text-white transition-all flex items-center gap-3 group text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase border border-white/5"
                >
                  ✦ Restart Experience
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
