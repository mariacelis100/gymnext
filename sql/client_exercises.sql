-- Create the client_exercises table
create table if not exists public.client_exercises (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.members(id) on delete cascade,
    trainer_id uuid references public.members(id) on delete cascade,
    exercise_name text not null,
    description text,
    sets integer not null,
    reps integer not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add comments to the table
comment on table public.client_exercises is 'Table to store exercises assigned to clients by trainers';

-- Create indexes for better performance
create index if not exists idx_client_exercises_client_id on public.client_exercises(client_id);
create index if not exists idx_client_exercises_trainer_id on public.client_exercises(trainer_id);

-- Create a function to update the updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update the updated_at column
create trigger update_client_exercises_updated_at
    before update on public.client_exercises
    for each row
    execute function public.update_updated_at_column();

-- Create RLS policies
alter table public.client_exercises enable row level security;

-- Policy for trainers to view their assigned clients' exercises
create policy "Trainers can view their clients' exercises"
    on public.client_exercises for select
    using (
        trainer_id = auth.uid() or
        exists (
            select 1 from public.members
            where id = auth.uid()
            and role_name = 'admin'
        )
    );

-- Policy for trainers to insert exercises for their clients
create policy "Trainers can insert exercises for their clients"
    on public.client_exercises for insert
    with check (
        trainer_id = auth.uid() or
        exists (
            select 1 from public.members
            where id = auth.uid()
            and role_name = 'admin'
        )
    );

-- Policy for trainers to update their clients' exercises
create policy "Trainers can update their clients' exercises"
    on public.client_exercises for update
    using (
        trainer_id = auth.uid() or
        exists (
            select 1 from public.members
            where id = auth.uid()
            and role_name = 'admin'
        )
    );

-- Policy for trainers to delete their clients' exercises
create policy "Trainers can delete their clients' exercises"
    on public.client_exercises for delete
    using (
        trainer_id = auth.uid() or
        exists (
            select 1 from public.members
            where id = auth.uid()
            and role_name = 'admin'
        )
    );

-- Grant necessary permissions
grant all on public.client_exercises to authenticated;
grant usage on schema public to authenticated; 