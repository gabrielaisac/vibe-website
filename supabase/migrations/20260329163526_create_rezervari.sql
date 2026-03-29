-- Tabel rezervari pentru Vibe Caffè

CREATE TABLE rezervari (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  telefon     TEXT        NOT NULL,
  nr_persoane INT         NOT NULL DEFAULT 2,
  data_ora    TIMESTAMPTZ NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'în așteptare',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activăm Row Level Security
ALTER TABLE rezervari ENABLE ROW LEVEL SECURITY;

-- Oricine poate adăuga o rezervare nouă
CREATE POLICY "public insert" ON rezervari
  FOR INSERT TO anon WITH CHECK (true);

-- Oricine poate citi rezervările
CREATE POLICY "public select" ON rezervari
  FOR SELECT TO anon USING (true);

-- Oricine poate modifica o rezervare
CREATE POLICY "public update" ON rezervari
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Oricine poate șterge o rezervare
CREATE POLICY "public delete" ON rezervari
  FOR DELETE TO anon USING (true);
