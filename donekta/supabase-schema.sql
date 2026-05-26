-- Ejecuta esto en el SQL Editor de Supabase

-- Tabla de comunidades
create table communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  rfc text,
  address text,
  city text,
  state text,
  category text,
  mission text,
  description text,
  beneficiaries text,
  contact_name text,
  contact_email text,
  contact_phone text,
  website text,
  facebook text,
  instagram text,
  goal_amount numeric default 0,
  raised_amount numeric default 0,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamp with time zone default now()
);

-- Tabla de donaciones
create table donations (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references communities(id),
  donor_name text,
  donor_email text,
  amount numeric not null,
  created_at timestamp with time zone default now()
);

-- Permitir lectura pública de comunidades aprobadas
alter table communities enable row level security;
create policy "Comunidades aprobadas visibles" on communities for select using (status = 'approved');
create policy "Insertar comunidad" on communities for insert with check (true);
create policy "Actualizar comunidad" on communities for update using (true);

-- Permitir insertar donaciones
alter table donations enable row level security;
create policy "Insertar donación" on donations for insert with check (true);
create policy "Leer donaciones" on donations for select using (true);
