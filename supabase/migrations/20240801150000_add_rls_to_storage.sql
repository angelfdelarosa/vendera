
create or replace function get_uid()
returns uuid
language sql
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- 2. Add a trigger to set the owner of the uploaded object
create or replace trigger on_upload_set_owner
  after insert
  on storage.objects
  for each row
  execute procedure storage.set_object_owner();
