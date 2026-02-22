-- Ver usuarios de Auth que no tienen fila en la tabla users
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- Reemplaza los valores antes de ejecutar
INSERT INTO organizations (id, name)
VALUES (gen_random_uuid(), 'Mi Empresa')
RETURNING id;

-- Usa el id que devolvio arriba
INSERT INTO public.users (id, organization_id, email, name, role)
VALUES (
  'USER-ID-DE-AUTH',
  'ORG-ID-DEL-PASO-ANTERIOR',
  'tu@email.com',
  'Tu Nombre',
  'owner'
);
