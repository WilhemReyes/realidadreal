let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();

  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const talla = btn.closest('.producto').querySelector('.select-talla').value;
      if (!talla) {
        alert('Selecciona una talla antes de añadir al carrito');
        return;
      }

      const producto = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        precio: parseFloat(btn.dataset.precio),
        talla: talla
      };

      agregarAlCarrito(producto);
      actualizarCarrito();
      guardarCarrito();
    });
  });

  document.getElementById('finalizar-compra').addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const provincia = document.getElementById('provincia').value;
    const municipio = document.getElementById('municipio').value;
    const ci = document.getElementById('ci').value.trim();

    if (!nombre || !direccion || !provincia || !municipio || !ci) {
      alert('Completa todos los campos antes de finalizar la compra');
      return;
    }

    let mensaje = `🛍️ Pedido desde Realidad Real Style\n\n`;
    carrito.forEach(item => {
      mensaje += `• ${item.nombre} - Talla ${item.talla} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    mensaje += `\n💰 Total: $${total.toFixed(2)}\n\n`;
    mensaje += `📍 Dirección: ${direccion}, ${municipio}, ${provincia}\n👤 Nombre: ${nombre}\n🆔 CI: ${ci}
    
    Procedemos con el Pago?\n\n`;
    

    const url = `https://wa.me/5354017939?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  });
});

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id && item.talla === producto.talla);
  if (existente) {
    existente.cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
}

function actualizarCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  const total = document.getElementById('carrito-total');
  contenedor.innerHTML = '';
  let suma = 0;

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'carrito-item';
    div.innerHTML = `
      <span>${item.nombre} - Talla ${item.talla} (x${item.cantidad})</span>
      <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
      <button class="eliminar" data-index="${index}">🗑️</button>
    `;
    contenedor.appendChild(div);
    suma += item.precio * item.cantidad;
  });

  total.textContent = `Total: $${suma.toFixed(2)}`;
  actualizarContador();

  document.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
      guardarCarrito();
    });
  });
}

function actualizarContador() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('contador-carrito').textContent = totalItems;
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function abrirCarrito() {
  document.getElementById('modal-carrito').classList.add('activo');
}

function cerrarCarrito() {
  document.getElementById('modal-carrito').classList.remove('activo');
}
