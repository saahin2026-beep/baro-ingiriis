-- Seed the 4 profile_setup_content rows with the current Somali + English copy.
-- Re-runnable: ON CONFLICT DO NOTHING preserves any admin edits.

insert into public.profile_setup_content (step, field_key, title_so, title_en, subtitle_so, subtitle_en, placeholder_so, placeholder_en) values
  (0, 'username',
    'Magacaad ku yaqaanaan?', 'What should we call you?',
    'Username-kaaga', 'Your username',
    'tusaale: ahmed_99', 'e.g. ahmed_99'),
  (1, 'phone',
    'Telefoonkaaga gali', 'Enter your phone number',
    'Telefoonkaaga', 'Your phone number',
    '+252 61 XXX XXXX', '+252 61 XXX XXXX'),
  (2, 'birthday',
    'Goormaad dhashay?', 'When were you born?',
    'Taariikhda dhalashada', 'Date of birth',
    '', ''),
  (3, 'city',
    'Xaggee ka timid?', 'Where are you from?',
    'Magaalaada', 'Your city',
    '', '')
on conflict (step) do nothing;
