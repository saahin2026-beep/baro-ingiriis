-- Seed practice_features descriptions (run AFTER the rows exist with their keys).
-- Idempotent — re-running just re-applies the same values.

update public.practice_features set
  description = 'Baro erayo cusub oo kala duwan',
  description_en = 'Learn new words by category'
where key = 'vocabulary';

update public.practice_features set
  description = 'Baro sida magacyada loo tiro-badiyeeyo',
  description_en = 'Singular to plural transformations'
where key = 'plurals';

update public.practice_features set
  description = 'Baro erayada lid ka ah',
  description_en = 'Antonym matching'
where key = 'opposites';

update public.practice_features set
  description = 'Baro sida erayada loo dhiso',
  description_en = 'Build words from parts'
where key = 'wordformation';

update public.practice_features set
  description = 'Baro fal-galka erayada',
  description_en = 'Verb tense practice'
where key = 'conjugation';

update public.practice_features set
  description = 'Dhis jumlado dhameystiran',
  description_en = 'Build complete sentences'
where key = 'sentencebuilder';
