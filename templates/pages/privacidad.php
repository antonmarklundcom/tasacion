<?php
declare(strict_types=1);
$cfg = site_config();
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Política de privacidad</h1>
      <p class="hero-sub">Qué datos pedimos, para qué los usamos y cómo podés ejercer tus derechos sobre ellos.</p>
    </div>
  </div>
</section>

<section class="legal-section">
  <div class="container legal-content">

    <h2>Responsable</h2>
    <p>Esta página es operada bajo el nombre <?= h($cfg['site_name']) ?><?= $cfg['ruc'] !== '' ? ', RUC ' . h($cfg['ruc']) : '' ?>. Para cualquier consulta sobre tus datos, escribinos por WhatsApp<?= $cfg['contact_email'] !== '' ? ' o al email ' . h($cfg['contact_email']) : '' ?>.</p>

    <h2>Qué datos pedimos</h2>
    <p>Cuando completás un formulario en este sitio (la valoración para vender o el formulario de contacto), pedimos nombre, teléfono, email y datos del inmueble que nos quieras contar: tipo de propiedad, zona, superficie aproximada y el motivo de tu consulta. El teléfono es el único dato obligatorio.</p>
    <p>Cuando hacés clic en un botón de WhatsApp, registramos la fecha, qué botón usaste, la página de origen y un hash del IP que no se puede revertir a la dirección original. No guardamos direcciones IP en texto plano.</p>

    <h2>Para qué usamos tus datos</h2>
    <p>Usamos tus datos exclusivamente para responder tu consulta, gestionar la valoración para vender o preparar el presupuesto del informe pericial. No los usamos para ningún otro fin.</p>

    <h2>Con quién se comparte</h2>
    <p>No vendemos tus datos a terceros. Los datos de los formularios pueden pasar por un proveedor de CRM (para organizar la consulta con el equipo correspondiente) y por un proveedor de envío de email (para notificarnos de tu solicitud), ambos actuando como encargados del tratamiento y no como dueños de tus datos.</p>

    <h2>Conservación</h2>
    <p>Guardamos los datos de tu consulta mientras dure el proceso de tasación o de valoración, y por un tiempo razonable después para poder responder si volvés a escribirnos. Podés pedirnos que los eliminemos antes.</p>

    <h2>Tus derechos</h2>
    <p>Podés pedirnos acceso a tus datos, su rectificación si algo está mal, o su supresión. Para ejercer cualquiera de estos derechos, escribinos por WhatsApp<?= $cfg['contact_email'] !== '' ? ' o al email ' . h($cfg['contact_email']) : '' ?> y te respondemos.</p>

    <h2>Cookies</h2>
    <p>Este sitio usa una cookie funcional para recordar tu preferencia de privacidad y, solo si la activás, cookies de una herramienta de estadística. Ver el detalle en la <a href="/politica-de-cookies/">política de cookies</a>.</p>

  </div>
</section>
