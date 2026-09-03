<?php
declare(strict_types=1);

$secrets = is_file(__DIR__ . '/secrets.php') ? require __DIR__ . '/secrets.php' : [];
$env = fn(string $k, string $d = ''): string => (string)(getenv($k) ?: ($secrets[$k] ?? $d));

return [
  'site_name'   => 'Tasación.com.py',
  'base_url'    => 'https://tasacion.com.py',
  'locale'      => 'es_PY',
  'wa_number'   => '595995628862',     // digits only, one place for the whole site
  'wa_display'  => '0995 628 862',
  'price_min'   => 800000,
  'price_max'   => 1500000,
  'price_note'  => 'según tipo de inmueble y superficie',   // IVA: PLACEHOLDER, see docs/PLACEHOLDERS.md
  'coverage'    => ['Asunción','Luque','San Lorenzo','Fernando de la Mora','Lambaré','Capiatá','Mariano Roque Alonso','Ñemby','Villa Elisa','San Antonio','Limpio','Areguá','Itauguá'],

  // PLACEHOLDERS — empty means "render neutral copy", never render the brackets
  'perito_name'    => '',   // e.g. 'Arq. Nombre Apellido'
  'perito_license' => '',   // e.g. 'Matrícula N° 1234'
  'contact_email'  => '',   // shown in footer/contacto only when set
  'contact_phone'  => '',   // landline; shown only when set
  'ruc'            => '',
  'address'        => 'Asunción, Paraguay',

  // integrations (from secrets.php or env)
  'analytics_id'      => $env('ANALYTICS_ID'),        // G-XXXX or GTM-XXXX
  'vendercrm_url'     => $env('VENDERCRM_URL'),
  'vendercrm_api_key' => $env('VENDERCRM_API_KEY'),
  'resend_api_key'    => $env('RESEND_API_KEY'),
  'resend_from'       => $env('RESEND_FROM', 'Tasación.com.py <leads@tasacion.com.py>'),
  'lead_to_email'     => $env('LEAD_TO_EMAIL'),
  'stats_user'        => $env('STATS_USER', 'admin'),
  'stats_password'    => $env('STATS_PASSWORD'),      // empty = stats page disabled (403)

  'log_dir'           => __DIR__ . '/../storage',
];
