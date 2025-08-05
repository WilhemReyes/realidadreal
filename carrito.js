const carritoItems = document.getElementById('carrito-items');
const carritoTotal = document.getElementById('carrito-total');
const botonFinalizar = document.getElementById('finalizar-compra');
const nombreInput = document.getElementById('nombre-cliente');
const direccionInput = document.getElementById('direccion-cliente');
const botonVistaPrevia = document.getElementById('ver-previa');
const vistaPrevia = document.getElementById('vista-previa');

let carrito = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
  const data = localStorage.getItem('carrito');
  if (data) {
    carrito = JSON.parse(data);
    actualizarCarrito();
  }
}

// Calcular total
function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Actualizar vista del carrito
function actualizarCarrito() {
  carritoItems.innerHTML = '';

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('carrito-item');
    div.innerHTML = `
      <span>${item.nombre} (${item.talla}) x${item.cantidad}</span>
      <span>${item.precio * item.cantidad} CUP</span>
      <button onclick="eliminarItem(${index})">❌</button>
    `;
    carritoItems.appendChild(div);
  });

  carritoTotal.textContent = `Total: ${calcularTotal()} CUP`;
}

// Eliminar producto del carrito
function eliminarItem(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// Vista previa del pedido
botonVistaPrevia.addEventListener('click', () => {
  if (carrito.length === 0) {
    vistaPrevia.textContent = 'Tu carrito está vacío.';
    vistaPrevia.classList.remove('oculto');
    return;
  }

  const nombreCliente = nombreInput.value.trim();
  const direccionCliente = direccionInput.value.trim();

  let mensaje = `🧾 Vista previa del pedido:\n\n`;
  carrito.forEach(item => {
    mensaje += `• ${item.nombre} (${item.talla}) x${item.cantidad} – ${item.precio * item.cantidad} CUP\n`;
  });

  mensaje += `\nTotal: ${calcularTotal()} CUP\n`;
  mensaje += `Nombre: ${nombreCliente || 'No ingresado'}\n`;
  mensaje += `Dirección: ${direccionCliente || 'No ingresada'}\n`;

  vistaPrevia.textContent = mensaje;
  vistaPrevia.classList.remove('oculto');
});

// Finalizar compra por WhatsApp
botonFinalizar.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  const nombreCliente = nombreInput.value.trim();
  const direccionCliente = direccionInput.value.trim();

  nombreInput.classList.remove('error');
  direccionInput.classList.remove('error');

  if (!nombreCliente || !direccionCliente) {
    if (!nombreCliente) nombreInput.classList.add('error');
    if (!direccionCliente) direccionInput.classList.add('error');
    return;
  }

  let mensaje = `¡Hola! Soy ${nombreCliente} y quiero hacer este pedido:\n\n`;
  carrito.forEach(item => {
    mensaje += `• ${item.nombre} (${item.talla}) x${item.cantidad} – ${item.precio * item.cantidad} CUP\n`;
  });

  mensaje += `\nTotal: ${calcularTotal()} CUP\n`;
  mensaje += `Dirección: ${direccionCliente}\n\n¿Podemos coordinar el pago?`;

  const numeroWhatsApp = '+5354017939'; // ← Reemplaza con tu número real
  const url = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');

  carrito = [];
  localStorage.removeItem('carrito');
  actualizarCarrito();
  alert('✅ ¡Pedido enviado por WhatsApp!');
});

cargarCarrito();
