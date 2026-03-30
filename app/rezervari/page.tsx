'use client';

import { useState, useMemo } from 'react';

/* ─── Constante ───────────────────────────────────────────── */

const ZILE    = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
const ZILE_FULL = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
const LUNI    = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
                 'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

// Sloturi orare 7:00 → 19:00 din 45 în 45 minute
const TIME_SLOTS: string[] = [];
for (let min = 7 * 60; min <= 19 * 60; min += 45) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
}
// Adaugă 19:00 explicit dacă nu e deja acolo
if (TIME_SLOTS[TIME_SLOTS.length - 1] !== '19:00') TIME_SLOTS.push('19:00');

/* ─── Helpers ─────────────────────────────────────────────── */

const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fmtDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, mo, d] = dateStr.split('-').map(Number);
  return `${d} ${LUNI[mo - 1]} ${y}`;
};

/* ─── Tipuri ──────────────────────────────────────────────── */

type Step = 1 | 2 | 3 | 'success';

interface FormData {
  nume: string;
  email: string;
  telefon: string;
  nr_persoane: number;
}

/* ─── Componenta ──────────────────────────────────────────── */

export default function RezervariPage() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 6);
    return d;
  }, [today]);

  const [step, setStep]               = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [calMonth, setCalMonth]        = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [form, setForm] = useState<FormData>({ nume: '', email: '', telefon: '', nr_persoane: 2 });
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');

  /* Următoarele 14 zile */
  const next14 = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    }), [today]);

  /* Zilele din luna afișată în calendar */
  const calDays = useMemo(() => {
    const year  = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    let startDow = first.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // Mon-first
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }, [calMonth]);

  const isDisabled = (d: Date) => d < today || d > maxDate;

  const prevMonth = () => {
    const m = new Date(calMonth);
    m.setMonth(m.getMonth() - 1);
    if (m >= new Date(today.getFullYear(), today.getMonth(), 1)) setCalMonth(m);
  };

  const nextMonth = () => {
    const m = new Date(calMonth);
    m.setMonth(m.getMonth() + 1);
    if (m <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) setCalMonth(m);
  };

  const selectDate = (d: Date) => {
    if (!isDisabled(d)) { setSelectedDate(fmt(d)); setStep(2); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rezervari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, data_ora: `${selectedDate}T${selectedTime}:00` }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); setLoading(false); return; }
      setStep('success');
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1); setSelectedDate(''); setSelectedTime('');
    setForm({ nume: '', email: '', telefon: '', nr_persoane: 2 }); setError('');
  };

  /* ─── UI ──────────────────────────────────────────────────── */

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-stone-900 flex items-center justify-center px-4 py-12">

      {/* Overlay foto fundal */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&auto=format&fit=crop')" }}
      />

      <div className="relative z-10 w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block text-teal-400 text-sm hover:text-teal-300 mb-4">← Înapoi la site</a>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">Rezervare</h1>
          <p className="text-gray-400 text-sm">Vibe Coffee · Gara Piatra Neamț</p>
        </div>

        {/* Indicatori pași */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {(['Data', 'Ora', 'Detalii'] as const).map((label, i) => {
              const s = i + 1;
              const active = step === s;
              const done   = typeof step === 'number' && step > s;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      active ? 'bg-teal-500 text-white' : done ? 'bg-teal-800 text-teal-300' : 'bg-gray-800 text-gray-500'
                    }`}>{done ? '✓' : s}</div>
                    <span className={`text-xs hidden sm:inline ${active ? 'text-teal-400' : done ? 'text-teal-700' : 'text-gray-600'}`}>{label}</span>
                  </div>
                  {s < 3 && <div className={`w-8 h-px ${done ? 'bg-teal-700' : 'bg-gray-800'}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PASUL 1: Data ──────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white/8 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-5">Alege data</h2>

            {/* Butoane rapide 14 zile */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: 'none' }}>
              {next14.map((d, i) => {
                const dStr = fmt(d);
                const sel  = selectedDate === dStr;
                return (
                  <button
                    key={dStr}
                    onClick={() => selectDate(d)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      sel ? 'bg-teal-500 text-white' : 'bg-white/8 text-gray-300 hover:bg-white/15'
                    }`}
                  >
                    <span className="opacity-70 mb-0.5">
                      {i === 0 ? 'Azi' : i === 1 ? 'Mâine' : ZILE_FULL[d.getDay()]}
                    </span>
                    <span className="text-base font-bold">{d.getDate()}</span>
                    <span className="opacity-70">{LUNI[d.getMonth()].slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            {/* Calendar */}
            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-white font-semibold text-sm">{LUNI[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {ZILE.map(z => <div key={z} className="text-center text-xs text-gray-600 py-1">{z}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((d, i) => {
                  if (!d) return <div key={`e${i}`} />;
                  const dStr    = fmt(d);
                  const dis     = isDisabled(d);
                  const sel     = selectedDate === dStr;
                  const isToday = fmt(d) === fmt(today);
                  return (
                    <button
                      key={dStr}
                      onClick={() => selectDate(d)}
                      disabled={dis}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        sel     ? 'bg-teal-500 text-white' :
                        dis     ? 'text-gray-700 cursor-not-allowed' :
                        isToday ? 'border border-teal-600 text-teal-400 hover:bg-teal-500/20' :
                                  'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PASUL 2: Ora ───────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white/8 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <button onClick={() => setStep(1)} className="text-teal-400 text-sm hover:text-teal-300 mb-4 flex items-center gap-1">
              ← {fmtDisplay(selectedDate)}
            </button>
            <h2 className="text-lg font-bold text-white mb-5">Alege ora</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => { setSelectedTime(slot); setStep(3); }}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === slot
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/8 text-gray-300 hover:bg-teal-500/25 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PASUL 3: Detalii ───────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white/8 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <button onClick={() => setStep(2)} className="text-teal-400 text-sm hover:text-teal-300 mb-4 flex items-center gap-1">
              ← {fmtDisplay(selectedDate)} · {selectedTime}
            </button>
            <h2 className="text-lg font-bold text-white mb-5">Detaliile tale</h2>

            <div className="space-y-4">
              {/* Nume */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Nume complet</label>
                <input
                  type="text"
                  value={form.nume}
                  onChange={e => setForm(f => ({ ...f, nume: e.target.value }))}
                  placeholder="ex: Maria Ionescu"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="ex: maria@email.ro"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Telefon (10 cifre)</label>
                <input
                  type="tel"
                  value={form.telefon}
                  onChange={e => setForm(f => ({ ...f, telefon: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="ex: 0740123456"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Nr persoane */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Număr de persoane (1–10)</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setForm(f => ({ ...f, nr_persoane: Math.max(1, f.nr_persoane - 1) }))}
                    className="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-xl font-bold leading-none"
                  >−</button>
                  <span className="text-2xl font-bold text-white w-6 text-center">{form.nr_persoane}</span>
                  <button
                    onClick={() => setForm(f => ({ ...f, nr_persoane: Math.min(10, f.nr_persoane + 1) }))}
                    className="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-xl font-bold leading-none"
                  >+</button>
                  <span className="text-gray-500 text-sm">{form.nr_persoane === 1 ? 'persoană' : 'persoane'}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/25 text-red-300 text-sm">{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !form.nume || !form.email || !form.telefon}
              className="mt-6 w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Se trimite...
                </>
              ) : 'Confirmă rezervarea'}
            </button>
          </div>
        )}

        {/* ── SUCCESS ────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="bg-white/8 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Rezervare confirmată!</h2>
            <p className="text-teal-300 font-medium mb-1">{fmtDisplay(selectedDate)} · {selectedTime}</p>
            <p className="text-gray-400 mb-1">{form.nr_persoane} {form.nr_persoane === 1 ? 'persoană' : 'persoane'} · {form.nume}</p>
            <p className="text-gray-500 text-sm mb-8">Te așteptăm la Vibe Coffee, Gara Piatra Neamț.</p>
            <button
              onClick={reset}
              className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              Rezervare nouă
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
