-- Run this only after Supabase Storage is enabled for the project.
-- If storage.buckets does not exist, create the bucket manually in
-- Supabase Dashboard > Storage > New bucket:
--   Name: patient-files
--   Public bucket: OFF

insert into storage.buckets (id, name, public)
values ('patient-files', 'patient-files', false)
on conflict (id) do nothing;

drop policy if exists "patient files are private" on storage.objects;
create policy "patient files are private"
  on storage.objects for all
  using (
    bucket_id = 'patient-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'patient-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
