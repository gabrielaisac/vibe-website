'use client';

import { useState, useEffect, useMemo } from 'react';

/* ─── Tipuri ──────────────────────────────────────────────── */

interface Rezervare {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  nr_persoane: number;
  data_ora: string;
  status: 'în așteptare' | 'confirmat' | 'respins';
  created_at: string;
}

type Filtru = 'toate' | 'în așteptare' | 'confirmat' | 'respins';

/* ─── Helpers ─────────────────────────────────────────────── */

const fmtData = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ro-RO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const STATUS_STYLE: Record<string, string> = {
  'în așteptare': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'confirmat':    'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'respins':      'bg-red-500/20 text-red-300 border border-red-500/30',
};

/* ─── Componenta ──────────────────────────────────────────── */

export default function AdminPage() {
  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filtru, setFiltru]       = useState<Filtru>('toate');
  const [cautare, setCautare]     = useState('');
  const [actiune, setActiune]     = useState<number | null>(null); // id-ul în procesare

  const fetchRezervari = async () => {
    setLoading(true);
    const res = await fetch('/api/rezervari');
    const json = await res.json();
    setRezervari(json.rezervari ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchRezervari(); }, []);

  const listaFiltrata = useMemo(() => {
    return rezervari.filter(r => {
      const potriviteFiltru = filtru === 'toate' || r.status === filtru;
      const potriviteCautare = r.nume.toLowerCase().includes(cautare.toLowerCase());
      return potriviteFiltru && potriviteCautare;
    });
  }, [rezervari, filtru, cautare]);

  const schimbaStatus = async (id: number, status: string) => {
    setActiune(id);
    await fetch('/api/rezervari', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchRezervari();
    setActiune(null);
  };

  const sterge = async (id: number) => {
    if (!confirm('Ștergi această rezervare?')) return;
    setActiune(id);
    await fetch(`/api/rezervari?id=${id}`, { method: 'DELETE' });
    await fetchRezervari();
    setActiune(null);
  };

  const counts = useMemo(() => ({
    toate:         rezervari.length,
    'în așteptare': rezervari.filter(r => r.status === 'în așteptare').length,
    confirmat:     rezervari.filter(r => r.status === 'confirmat').length,
    respins:       rezervari.filter(r => r.status === 'respins').length,
  }), [rezervari]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-teal-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Admin Rezervări</h1>
          <p className="text-gray-400 text-sm">Vibe Coffee · Gara Piatra Neamț</p>
        </div>

        {/* Filtre + Căutare */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Butoane filtru */}
          <div className="flex flex-wrap gap-2">
            {(['toate', 'în așteptare', 'confirmat', 'respins'] as Filtru[]).map(f => (
              <button
                key={f}
                onClick={() => setFiltru(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize
                  ${filtru === f
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-white/8 text-gray-300 hover:bg-white/15 border border-white/10'
                  }`}
              >
                {f} <span className="ml-1 opacity-70">({counts[f]})</span>
              </button>
            ))}
          </div>

          {/* Căutare */}
          <div className="md:ml-auto">
            <input
              type="text"
              placeholder="Caută după nume..."
              value={cautare}
              onChange={e => setCautare(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-xl bg-white/8 border border-white/10
                         text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50
                         focus:bg-white/12 transition-all text-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Gol */}
        {!loading && listaFiltrata.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Nicio rezervare găsită.
          </div>
        )}

        {/* TABEL — desktop */}
        {!loading && listaFiltrata.length > 0 && (
          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/8 backdrop-blur-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-left">
                  <th className="px-5 py-4 font-medium">Nume</th>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Data & Ora</th>
                  <th className="px-5 py-4 font-medium text-center">Pers.</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrata.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-t border-white/5 transition-colors hover:bg-white/4
                      ${i % 2 === 0 ? 'bg-white/2' : 'bg-transparent'}`}
                  >
                    <td className="px-5 py-4 text-white font-medium">{r.nume}</td>
                    <td className="px-5 py-4 text-gray-400">
                      <div>{r.email}</div>
                      <div className="text-xs mt-0.5">{r.telefon}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{fmtData(r.data_ora)}</td>
                    <td className="px-5 py-4 text-gray-300 text-center">{r.nr_persoane}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end">
                        {r.status !== 'confirmat' && (
                          <button
                            onClick={() => schimbaStatus(r.id, 'confirmat')}
                            disabled={actiune === r.id}
                            className="px-3 py-1.5 rounded-lg bg-teal-500/15 text-teal-400 hover:bg-teal-500/30
                                       text-xs font-medium transition-all disabled:opacity-40"
                          >
                            Confirmă
                          </button>
                        )}
                        {r.status !== 'respins' && (
                          <button
                            onClick={() => schimbaStatus(r.id, 'respins')}
                            disabled={actiune === r.id}
                            className="px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500/30
                                       text-xs font-medium transition-all disabled:opacity-40"
                          >
                            Respinge
                          </button>
                        )}
                        <button
                          onClick={() => sterge(r.id)}
                          disabled={actiune === r.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30
                                     text-xs font-medium transition-all disabled:opacity-40"
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CARDURI — mobile */}
        {!loading && listaFiltrata.length > 0 && (
          <div className="flex flex-col gap-4 md:hidden">
            {listaFiltrata.map(r => (
              <div
                key={r.id}
                className="rounded-2xl bg-white/8 backdrop-blur-md border border-white/10 p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold text-base">{r.nume}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{r.telefon}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">Data & Ora</p>
                    <p className="text-gray-300">{fmtData(r.data_ora)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Persoane</p>
                    <p className="text-gray-300">{r.nr_persoane}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-300 truncate">{r.email}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {r.status !== 'confirmat' && (
                    <button
                      onClick={() => schimbaStatus(r.id, 'confirmat')}
                      disabled={actiune === r.id}
                      className="flex-1 py-2 rounded-xl bg-teal-500/15 text-teal-400 hover:bg-teal-500/30
                                 text-sm font-medium transition-all disabled:opacity-40"
                    >
                      Confirmă
                    </button>
                  )}
                  {r.status !== 'respins' && (
                    <button
                      onClick={() => schimbaStatus(r.id, 'respins')}
                      disabled={actiune === r.id}
                      className="flex-1 py-2 rounded-xl bg-orange-500/15 text-orange-400 hover:bg-orange-500/30
                                 text-sm font-medium transition-all disabled:opacity-40"
                    >
                      Respinge
                    </button>
                  )}
                  <button
                    onClick={() => sterge(r.id)}
                    disabled={actiune === r.id}
                    className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/30
                               text-sm font-medium transition-all disabled:opacity-40"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
