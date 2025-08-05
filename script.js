document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggleTema = document.getElementById("toggle-tema");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  // 🌗 Tema claro/oscuro
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado) root.setAttribute("data-tema", temaGuardado);

  toggleTema?.addEventListener("click", () => {
    const actual = root.getAttribute("data-tema") === "claro" ? "oscuro" : "claro";
    root.setAttribute("data-tema", actual);
    localStorage.setItem("tema", actual);
  });

  // 📱 Menú responsive
  menuToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("activo");
  });

  // 💬 Reseñas
  document.querySelectorAll(".btn-enviar-reseña").forEach(btn => {
    btn.addEventListener("click", () => {
      const producto = btn.closest(".producto");
      const textarea = producto.querySelector(".nueva-reseña");
      const lista = producto.querySelector(".lista-reseñas");

      if (textarea.value.trim() === "") return;

      const li = document.createElement("li");
      li.textContent = textarea.value;
      li.classList.add("fade-in");
      lista.appendChild(li);
      textarea.value = "";
    });
  });

  // 📤 Compartir producto
  document.querySelectorAll(".btn-compartir").forEach(btn => {
    btn.addEventListener("click", () => {
      const producto = btn.closest(".producto");
      const nombre = producto.querySelector("h3").textContent;
      const precio = producto.querySelector(".precio").textContent;
      const talla = producto.querySelector(".selector-talla").value;

      if (!talla) {
        alert("Por favor selecciona una talla antes de compartir.");
        return;
      }

      const mensaje = `¡Mira este producto en Realidad Real Styles!\n${nombre} (${talla}) - ${precio}`;
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank", "noopener");
    });
  });

  // 🛒 Agregar al carrito
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const producto = btn.closest(".producto");
      const nombre = producto.querySelector("h3").textContent;
      const precioTexto = producto.querySelector(".precio").textContent;
      const precio = parseFloat(precioTexto.replace(/[^\d.]/g, ""));
      const talla = producto.querySelector(".selector-talla").value;

      if (!talla) {
        producto.querySelector(".selector-talla").classList.add("error");
        setTimeout(() => producto.querySelector(".selector-talla").classList.remove("error"), 1500);
        return;
      }

      const nuevoItem = { nombre, precio, talla, cantidad: 1 };
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      const existente = carrito.find(item => item.nombre === nombre && item.talla === talla);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push(nuevoItem);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));

      const contador = document.getElementById("contador-carrito");
      if (contador) {
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalCantidad;
        contador.classList.add("actualizado");
        setTimeout(() => contador.classList.remove("actualizado"), 300);
      }

      const img = producto.querySelector("img");
      const carritoIcono = document.getElementById("contador-carrito");
      if (img && carritoIcono) flyToCart(img, carritoIcono);

      const sonidoAgregar = document.getElementById("sonido-agregar");
      if (sonidoAgregar) sonidoAgregar.play();
    });
  });

  // ✈️ Animación fly-to-cart
  function flyToCart(img, target) {
    const clone = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = 'all 0.8s ease-in-out';
    clone.style.zIndex = 1000;
    clone.style.borderRadius = '50%';
    clone.style.opacity = '0.9';
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.left = `${targetRect.left + targetRect.width / 2}px`;
      clone.style.top = `${targetRect.top + targetRect.height / 2}px`;
      clone.style.width = '20px';
      clone.style.height = '20px';
      clone.style.opacity = '0.3';
    });

    setTimeout(() => {
      clone.remove();
    }, 900);
  }
function toggleMenu() {
  const menu = document.getElementById('menu-movil');
  const fondo = document.getElementById('fondo-oscuro');
  const icono = document.getElementById('hamburguesa');

  menu.classList.toggle('activo');
  fondo.classList.toggle('activo');
  icono.classList.toggle('activo');
}

  // 🧵 Filtro por talla
  document.getElementById('filtro')?.addEventListener('change', e => {
    const tallaSeleccionada = e.target.value;
    document.querySelectorAll('.producto').forEach(producto => {
      const selector = producto.querySelector('.selector-talla');
      const opciones = Array.from(selector.options).map(opt => opt.value);
      producto.style.display = !tallaSeleccionada || opciones.includes(tallaSeleccionada) ? 'block' : 'none';
    });
  });
});
