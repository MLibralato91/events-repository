-- Schema per le RSVP della festa
-- Esegui questo nell'SQL Editor di Supabase (https://app.supabase.com)

create table if not exists rsvps (
  id           uuid        default gen_random_uuid() primary key,
  created_at   timestamptz default timezone('utc', now()) not null,
  nome         text        not null,
  cognome      text        not null,
  email        text        not null,
  partecipa    boolean     not null,
  accompagnato boolean     not null default false,
  nome_accompagnatore text,
  note         text
);

-- Indice sull'email per evitare doppie registrazioni (opzionale)
-- create unique index if not exists rsvps_email_idx on rsvps (email);

-- Row Level Security (consigliato)
alter table rsvps enable row level security;

-- Permette INSERT da qualsiasi client autenticato (la anon key del form)
create policy "Chiunque può inserire un RSVP"
  on rsvps for insert
  to anon
  with check (true);

-- Solo chi è autenticato (es. tu dal pannello Supabase) può leggere
create policy "Solo admin può leggere"
  on rsvps for select
  to authenticated
  using (true);
