<?php
declare(strict_types=1);

/**
 * Copy this file to config/secrets.php on the server (gitignored, never
 * committed) and fill in the values you have. Every key here can also be
 * set as an environment variable of the same name — env wins over this
 * file. Empty string means "not configured", and config/site.php renders
 * neutral copy instead of failing. See docs/PLACEHOLDERS.md.
 */
return [
  // Google Analytics / Tag Manager id (G-XXXXXXX or GTM-XXXXXXX). Empty =
  // no analytics script is ever requested, even after consent.
  'ANALYTICS_ID' => '',

  // Base URL of the VenderCRM instance leads are forwarded to, e.g.
  // https://crm.midominio.com. Empty = leads are only written to
  // storage/leads.log, never sent over the network.
  'VENDERCRM_URL' => '',

  // API key for the VenderCRM site, sent as the X-Api-Key header.
  'VENDERCRM_API_KEY' => '',

  // Resend.com API key used to email a copy of each lead. Empty = no
  // email is sent; the lead is still logged and (if configured) sent to
  // VenderCRM.
  'RESEND_API_KEY' => '',

  // Verified "From" address in Resend, e.g.
  // "Tasación.com.py <leads@tasacion.com.py>". Must be on a domain
  // verified in the Resend dashboard.
  'RESEND_FROM' => 'Tasación.com.py <leads@tasacion.com.py>',

  // Inbox that receives the lead notification email.
  'LEAD_TO_EMAIL' => '',

  // HTTP Basic auth for /go/stats.php.
  'STATS_USER' => 'admin',

  // Empty = /go/stats.php always answers 403, regardless of STATS_USER.
  'STATS_PASSWORD' => '',
];
