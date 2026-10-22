/**
 * Envío del formulario de contacto del home al endpoint productivo.
 * Replica el comportamiento de https://kikilatam.com (kikilatam.prolibu.com).
 *
 * Soporta ES y EN según <html lang>.
 *
 * MODO LOCAL: si el sitio se abre en localhost/127.0.0.1 no se hace el POST
 * real; se muestra el éxito de forma simulada para poder probar el flujo
 * sin crear leads en el CRM productivo.
 */

(function () {
  'use strict';

  var CONTACT_URL = (window.KK_CRM && window.KK_CRM.url) || '';
  var CONTACT_TOKEN = (window.KK_CRM && window.KK_CRM.token) || ''; // Ya no va en el código: se inyecta desde variables de entorno.
  var THANK_YOU_URL = '/thank-you-contact';

  var LANG = (document.documentElement.lang || 'es').toLowerCase();
  var IS_EN = LANG.indexOf('en') === 0;

  // Países soportados por el campo "¿Dónde quieres vender?" -> código ISO
  // que espera el CRM en address.country (claves ES y EN).
  var COUNTRY_ISO = {
    'México': 'MX',
    'Mexico': 'MX',
    'Colombia': 'CO',
    'Perú': 'PE',
    'Peru': 'PE',
    'Estados Unidos': 'US',
    'United States': 'US',
    'USA': 'US'
  };

  var MSG = IS_EN ? {
    name: 'Please enter your full name (at least 4 characters).',
    email: 'Please enter a valid business email.',
    phone: 'Please enter your WhatsApp including the country code.',
    company: 'Please enter your company name.',
    requirement: 'Select where you want to sell.',
    product: 'Select the type of product you sell.',
    successTitle: 'Success!',
    successText: 'Your message has been sent.',
    errorSend: 'We could not send your message. Please try again in a few minutes.',
    productLabel: 'Product',
    ordersLabel: 'Monthly orders',
    noOrders: 'Not specified',
    objectiveLabel: 'Objective'
  } : {
    name: 'Por favor escribe tu nombre completo (mínimo 4 caracteres).',
    email: 'Por favor escribe un email corporativo válido.',
    phone: 'Por favor escribe tu WhatsApp incluyendo el código del país.',
    company: 'Por favor escribe el nombre de tu empresa.',
    requirement: 'Selecciona dónde quieres vender.',
    product: 'Selecciona el tipo de producto que vendes.',
    successTitle: '¡Listo!',
    successText: 'Recibimos tus datos. Te contactaremos pronto.',
    errorSend: 'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
    productLabel: 'Producto',
    ordersLabel: 'Órdenes mensuales',
    noOrders: 'No especificado',
    objectiveLabel: 'Objetivo'
  };

  var LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];

  // Sin endpoint configurado (p. ej. sitio de revisión en Vercel) el envío también es simulado.
  function isLocal() {
    return LOCAL_HOSTS.indexOf(window.location.hostname) !== -1 || !CONTACT_URL;
  }

  function valueOf(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setLoading(loading) {
    var spinner = document.querySelector('#contactForm .fa-spinner');
    var btn = document.querySelector('#contactForm button[type="submit"]');
    if (spinner) {
      spinner.style.display = loading ? 'inline-block' : 'none';
    }
    if (btn) {
      btn.disabled = loading;
    }
  }

  function showError(title, text) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({ title: title, text: text, icon: 'error', confirmButtonText: 'OK' });
    } else {
      alert(title + ' - ' + text);
    }
  }

  function showSuccess(title, text, redirect) {
    var done = function () {
      var form = document.getElementById('contactForm');
      if (form) {
        form.reset();
      }
      if (redirect) {
        window.location.href = redirect;
      }
    };
    if (typeof Swal !== 'undefined') {
      Swal.fire({ title: title, text: text, icon: 'success', confirmButtonText: 'OK' }).then(done);
    } else {
      done();
    }
  }

  var form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = valueOf('name');
    var email = valueOf('email');
    var contactNumber = valueOf('contactNumber');
    var company = valueOf('company');
    var requirement = valueOf('requirement');
    var product = valueOf('product');
    var message = valueOf('message');
    var orders = valueOf('orders');

    // Validación de campos obligatorios.
    if (!name || name.length < 4) {
      showError('Error', MSG.name);
      return;
    }
    if (!email || !validateEmail(email)) {
      showError('Error', MSG.email);
      return;
    }
    if (!contactNumber) {
      showError('Error', MSG.phone);
      return;
    }
    if (!company) {
      showError('Error', MSG.company);
      return;
    }
    if (!requirement) {
      showError('Error', MSG.requirement);
      return;
    }
    if (!product) {
      showError('Error', MSG.product);
      return;
    }

    // Payload idéntico al formulario productivo del sitio v6.
    var payload = {
      firstName: name,
      email: email,
      companyName: company,
      mobile: contactNumber,
      whatsapp: contactNumber,
      source: 'HOME',
      'address.country': COUNTRY_ISO[requirement] || requirement,
      'customFields.mensajeWeb':
        MSG.productLabel + ': ' + product +
        ' | ' + MSG.ordersLabel + ': ' + (orders || MSG.noOrders) +
        ' | ' + MSG.objectiveLabel + ': ' + message
    };

    // Modo local: no enviar al CRM productivo.
    if (isLocal()) {
      console.info('[kiki-form] Modo local detectado: no se envió el lead.', payload);
      showSuccess(MSG.successTitle, MSG.successText, false);
      return;
    }

    setLoading(true);

    fetch(CONTACT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONTACT_TOKEN
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('Respuesta del server: ', data);
        setLoading(false);
        showSuccess(MSG.successTitle, MSG.successText, THANK_YOU_URL);
      })
      .catch(function (error) {
        console.error('Error:', error);
        setLoading(false);
        showError('Error', MSG.errorSend);
      });
  });
})();