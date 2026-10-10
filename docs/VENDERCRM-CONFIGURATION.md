# Persistent CRM configuration

Preferred file: parent(actual web root)/private/vendercrm.php. Return VENDERCRM_URL (HTTPS base origin) and VENDERCRM_API_KEY. VENDERCRM_CONFIG_FILE may select an absolute file physically outside the web root. This file controls only URL/key; its outbox_dir field is ignored.

Existing parent/root vendercrm-config.php remains compatible with url/api_key or canonical aliases. Shared URL/key override legacy transport fields. Existing outbox_dir remains unchanged; TASACION_OUTBOX_DIR may override it. Runtime VENDERCRM_URL/VENDERCRM_API_KEY override file transport values last. Incomplete shared setup fails safely. Private shared code is evaluated once with output suppression.

Preserve recovery entries, idempotency, cron policy and the existing outbox location. Deployment and actual receipt remain unverified.
