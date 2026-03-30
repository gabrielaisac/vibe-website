import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rezervari: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nume, email, telefon, nr_persoane, data_ora } = body;

  // Validare câmpuri obligatorii
  if (!nume || !email || !telefon || !data_ora) {
    return NextResponse.json(
      { error: 'Câmpurile nume, email, telefon și data sunt obligatorii.' },
      { status: 400 }
    );
  }

  // Validare nume — doar litere și spații
  if (!/^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$/.test(nume.trim())) {
    return NextResponse.json(
      { error: 'Numele poate conține doar litere.' },
      { status: 400 }
    );
  }

  // Validare telefon — exact 10 cifre
  if (!/^\d{10}$/.test(telefon.trim())) {
    return NextResponse.json(
      { error: 'Telefonul trebuie să conțină exact 10 cifre.' },
      { status: 400 }
    );
  }

  // Validare număr persoane — între 1 și 10
  const persoane = nr_persoane ?? 2;
  if (!Number.isInteger(persoane) || persoane < 1 || persoane > 10) {
    return NextResponse.json(
      { error: 'Numărul de persoane trebuie să fie între 1 și 10.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('rezervari')
    .insert([{ nume, email, telefon, nr_persoane: nr_persoane ?? 2, data_ora }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, rezervare: data }, { status: 201 });
}
