create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references public.organizations on delete set null,
  email text not null,
  name text,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  name text not null,
  email text not null,
  company text,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  name text not null,
  description text,
  base_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  customer_id uuid not null references public.customers on delete cascade,
  title text not null,
  description text,
  total_price numeric(12,2) not null default 0,
  status text not null default 'draft',
  pdf_url text,
  public_token text not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

create unique index if not exists quotes_public_token_idx on public.quotes (public_token);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes on delete cascade,
  service_id uuid references public.services on delete set null,
  name text not null,
  description text,
  price numeric(12,2) not null default 0
);

create table if not exists public.email_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  customer_id uuid not null references public.customers on delete cascade,
  quote_id uuid references public.quotes on delete set null,
  subject text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.email_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.email_threads on delete cascade,
  direction text not null,
  content text not null,
  is_suggested boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.email_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  from_name text,
  from_email text,
  reply_to text,
  signature text,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  name text not null,
  subject text,
  body text,
  created_at timestamptz not null default now()
);

create or replace function public.current_organization_id()
returns uuid
language sql
stable
as $$
  select organization_id from public.users where id = auth.uid()
$$;

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.email_threads enable row level security;
alter table public.email_messages enable row level security;
alter table public.email_settings enable row level security;
alter table public.templates enable row level security;

create policy "Organizations are scoped to members" on public.organizations
  for select using (id = public.current_organization_id());

create policy "Organizations can be updated by members" on public.organizations
  for update using (id = public.current_organization_id());

create policy "Users can read org members" on public.users
  for select using (organization_id = public.current_organization_id());

create policy "Users can update own profile" on public.users
  for update using (id = auth.uid());

create policy "Users can insert own profile" on public.users
  for insert with check (id = auth.uid());

create policy "Customers scoped to org" on public.customers
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "Services scoped to org" on public.services
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "Quotes scoped to org" on public.quotes
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "Quote items scoped to org" on public.quote_items
  for all using (
    exists (
      select 1
      from public.quotes
      where public.quotes.id = public.quote_items.quote_id
        and public.quotes.organization_id = public.current_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.quotes
      where public.quotes.id = public.quote_items.quote_id
        and public.quotes.organization_id = public.current_organization_id()
    )
  );

create policy "Email threads scoped to org" on public.email_threads
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "Email messages scoped to org" on public.email_messages
  for all using (
    exists (
      select 1
      from public.email_threads
      where public.email_threads.id = public.email_messages.thread_id
        and public.email_threads.organization_id = public.current_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.email_threads
      where public.email_threads.id = public.email_messages.thread_id
        and public.email_threads.organization_id = public.current_organization_id()
    )
  );

create policy "Email settings scoped to org" on public.email_settings
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());

create policy "Templates scoped to org" on public.templates
  for all using (organization_id = public.current_organization_id())
  with check (organization_id = public.current_organization_id());
