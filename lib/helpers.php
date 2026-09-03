<?php
declare(strict_types=1);

/** Escape for HTML output. */
function h(?string $s): string
{
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}

/** Site config, loaded once. */
function site_config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $cfg = require __DIR__ . '/../config/site.php';
    }
    return $cfg;
}

/** Absolute internal URL for a path (always trailing slash for page paths). */
function url(string $path): string
{
    if ($path === '' || $path[0] !== '/') {
        $path = '/' . $path;
    }
    return $path;
}

/** Absolute URL including base_url, for canonical/OG tags. */
function abs_url(string $path): string
{
    return rtrim(site_config()['base_url'], '/') . url($path);
}

/** Format guaraníes with dot thousands: gs(800000) -> "Gs. 800.000". */
function gs(int $amount): string
{
    return 'Gs. ' . number_format($amount, 0, ',', '.');
}

/**
 * Tracked WhatsApp link. Every WhatsApp button on the site must be built
 * with this — never a raw wa.me link in a template.
 */
function wa_url(string $src, string $type = 'general', string $zone = ''): string
{
    $qs = 'src=' . rawurlencode($src) . '&t=' . rawurlencode($type);
    if ($zone !== '') {
        $qs .= '&z=' . rawurlencode($zone);
    }
    return '/go/whatsapp.php?' . $qs;
}

/**
 * Page registry: one row per route. Templates read their own entry via
 * current_page(). `type` is the wa_url() prefill type used by that page's
 * default WhatsApp buttons. `nav` is the label shown in the header nav, or
 * null to omit from nav. `sitemap` marks the 16 indexable pages.
 */
function page_registry(): array
{
    static $pages = null;
    if ($pages !== null) {
        return $pages;
    }
    $pages = [
        '/' => [
            'template'    => 'home',
            'title'       => 'Tasación de inmuebles en Asunción · Informe pericial',
            'description' => 'Informe pericial de tasación con validez legal en Asunción y Gran Asunción, y valoración comercial sin costo para propietarios que van a vender.',
            'nav'         => 'Inicio',
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/tasaciones/casas/' => [
            'template'    => 'tasacion-casas',
            'title'       => 'Tasación de casas en Asunción',
            'description' => 'Informe pericial de tasación de casas en Asunción y Gran Asunción, firmado por tasador habilitado. Presupuesto según tipo de inmueble y superficie.',
            'nav'         => 'Casas',
            'type'        => 'casa',
            'sitemap'     => true,
        ],
        '/tasaciones/departamentos/' => [
            'template'    => 'tasacion-departamentos',
            'title'       => 'Tasación de departamentos en Asunción',
            'description' => 'Informe pericial de tasación de departamentos en Asunción, con visita, comparables del edificio y firma de tasador habilitado.',
            'nav'         => 'Departamentos',
            'type'        => 'departamento',
            'sitemap'     => true,
        ],
        '/tasaciones/terrenos/' => [
            'template'    => 'tasacion-terrenos',
            'title'       => 'Tasación de terrenos en Asunción y Gran Asunción',
            'description' => 'Informe pericial de tasación de terrenos y lotes en Asunción y Gran Asunción, con frente, zonificación y linderos considerados.',
            'nav'         => 'Terrenos',
            'type'        => 'terreno',
            'sitemap'     => true,
        ],
        '/tasaciones/corporativa/' => [
            'template'    => 'tasacion-corporativa',
            'title'       => 'Tasación corporativa de inmuebles',
            'description' => 'Informe pericial de tasación para empresas: balances, revalúo de activos, fusiones y sociedades que se separan, con validez legal.',
            'nav'         => 'Corporativa',
            'type'        => 'corporativa',
            'sitemap'     => true,
        ],
        '/tasaciones/hipotecaria/' => [
            'template'    => 'tasacion-hipotecaria',
            'title'       => 'Tasación hipotecaria · Informe para garantía',
            'description' => 'Informe pericial de tasación para presentar un inmueble como garantía ante bancos, cooperativas y financieras, con el formato que exigen.',
            'nav'         => 'Hipotecaria',
            'type'        => 'hipotecaria',
            'sitemap'     => true,
        ],
        '/tasaciones/locales-comerciales/' => [
            'template'    => 'tasacion-locales',
            'title'       => 'Tasación de locales comerciales',
            'description' => 'Informe pericial de tasación de locales comerciales, depósitos y galpones en Asunción, según tránsito, frente y habilitación de uso.',
            'nav'         => 'Locales comerciales',
            'type'        => 'local',
            'sitemap'     => true,
        ],
        '/tasaciones/campos/' => [
            'template'    => 'tasacion-campos',
            'title'       => 'Tasación de campos y estancias',
            'description' => 'Informe pericial de tasación de campos y estancias en el interior del país, con mejoras, acceso, título y mensura considerados.',
            'nav'         => 'Campos',
            'type'        => 'campo',
            'sitemap'     => true,
        ],
        '/valuacion-para-vender/' => [
            'template'    => 'valuacion',
            'title'       => 'Valoración para vender · Sin costo',
            'description' => 'Valoración comercial sin costo para propietarios que van a vender en Gran Asunción: rango de precio, comparables y plan de comercialización.',
            'nav'         => 'Valoración gratuita',
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/informes-periciales/' => [
            'template'    => 'informes',
            'title'       => 'Informe pericial de tasación · Validez legal',
            'description' => 'Informe pericial de tasación con validez legal para sucesiones, juicios, garantía bancaria y empresas. Presupuesto antes de empezar.',
            'nav'         => 'Informe pericial',
            'type'        => 'informe',
            'sitemap'     => true,
        ],
        '/nosotros/' => [
            'template'    => 'nosotros',
            'title'       => 'Quiénes somos',
            'description' => 'Un tasador habilitado firma el informe pericial; un equipo inmobiliario acompaña la valoración sin costo. Cobertura en Gran Asunción.',
            'nav'         => 'Nosotros',
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/preguntas-frecuentes/' => [
            'template'    => 'faq',
            'title'       => 'Preguntas frecuentes sobre tasación',
            'description' => 'Precio, plazos, validez legal del informe pericial, cómo funciona la valoración para vender y qué hacemos con tus datos.',
            'nav'         => 'Preguntas',
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/contacto/' => [
            'template'    => 'contacto',
            'title'       => 'Contacto',
            'description' => 'Escribinos por WhatsApp para cotizar un informe pericial o dejanos tus datos y te respondemos. Cobertura en Asunción y Gran Asunción.',
            'nav'         => 'Contacto',
            'type'        => 'contacto',
            'sitemap'     => true,
        ],
        '/gracias/' => [
            'template'    => 'gracias',
            'title'       => 'Recibimos tu solicitud',
            'description' => 'Recibimos tu solicitud. Te contactamos al número que dejaste.',
            'nav'         => null,
            'type'        => 'general',
            'sitemap'     => false,
            'noindex'     => true,
        ],
        '/politica-de-privacidad/' => [
            'template'    => 'privacidad',
            'title'       => 'Política de privacidad',
            'description' => 'Qué datos pedimos, para qué los usamos, con quién se comparten y cómo ejercer tus derechos sobre tus datos personales.',
            'nav'         => null,
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/politica-de-cookies/' => [
            'template'    => 'cookies',
            'title'       => 'Política de cookies',
            'description' => 'Qué cookies usa este sitio: una cookie funcional de preferencia y, solo con tu consentimiento, cookies de estadística.',
            'nav'         => null,
            'type'        => 'general',
            'sitemap'     => true,
        ],
        '/terminos-y-condiciones/' => [
            'template'    => 'terminos',
            'title'       => 'Términos y condiciones',
            'description' => 'Alcance del informe pericial y de la valoración para vender, precios de referencia, propiedad intelectual y ley aplicable.',
            'nav'         => null,
            'type'        => 'general',
            'sitemap'     => true,
        ],
    ];
    return $pages;
}

/** 301 redirects from the old GHL build, matched without trailing slash. */
function legacy_redirects(): array
{
    return [
        '/servicios/tasacion-de-casas-y-departamentos' => '/tasaciones/casas/',
        '/servicios/tasacion-de-terrenos'              => '/tasaciones/terrenos/',
        '/servicios/tasacion-de-locales-comerciales'   => '/tasaciones/locales-comerciales/',
        '/servicios/informe-de-tasacion'               => '/informes-periciales/',
        '/servicios/tasacion-online'                   => '/valuacion-para-vender/',
        '/cotizador'                                   => '/contacto/',
        '/gracias.html'                                => '/gracias/',
    ];
}

/** Prefix redirects: anything under these paths goes to the given target. */
function legacy_redirect_prefixes(): array
{
    return [
        '/zonas/' => '/',
        '/guias/' => '/preguntas-frecuentes/',
    ];
}

/** The registry entry for the currently-routed path, set by index.php. */
function current_page(): array
{
    global $CURRENT_PAGE;
    return $CURRENT_PAGE ?? [];
}

function current_path(): string
{
    global $CURRENT_PATH;
    return $CURRENT_PATH ?? '/';
}

/**
 * Render a page: pulls templates/pages/{template}.php into the shared
 * layout (head + header + <main> + footer).
 */
function render(string $path, array $entry): void
{
    global $CURRENT_PAGE, $CURRENT_PATH;
    $CURRENT_PAGE = $entry;
    $CURRENT_PATH = $path;

    $tplFile = __DIR__ . '/../templates/pages/' . $entry['template'] . '.php';

    include __DIR__ . '/../templates/layout/head.php';
    include __DIR__ . '/../templates/layout/header.php';
    echo "<main id=\"main\">\n";
    if (is_file($tplFile)) {
        include $tplFile;
    }
    echo "</main>\n";
    include __DIR__ . '/../templates/layout/footer.php';
}

/** Queue a JSON-LD block; footer.php prints all queued blocks. */
function add_jsonld(array $data): void
{
    global $JSONLD_BLOCKS;
    $JSONLD_BLOCKS[] = $data;
}

function jsonld_blocks(): array
{
    global $JSONLD_BLOCKS;
    return $JSONLD_BLOCKS ?? [];
}

function render_404(): void
{
    http_response_code(404);
    global $CURRENT_PAGE, $CURRENT_PATH;
    $CURRENT_PAGE = [
        'template'    => '404',
        'title'       => 'Página no encontrada',
        'description' => 'La página que buscás no existe. Volvé al inicio o escribinos por WhatsApp.',
        'nav'         => null,
        'type'        => 'general',
        'sitemap'     => false,
        'noindex'     => true,
    ];
    $CURRENT_PATH = current_path();

    include __DIR__ . '/../templates/layout/head.php';
    include __DIR__ . '/../templates/layout/header.php';
    echo "<main id=\"main\">\n";
    include __DIR__ . '/../templates/pages/404.php';
    echo "</main>\n";
    include __DIR__ . '/../templates/layout/footer.php';
}
