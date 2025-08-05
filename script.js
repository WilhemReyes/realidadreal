document.addEventListener("DOMContentLoaded", () => {
  const toggleTema = document.getElementById("toggle-tema");
  const root = document.documentElement;

  // 🌗 Tema claro/oscuro
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado) root.setAttribute("data-tema", temaGuardado);

  toggleTema?.addEventListener("click", () => {
    const actual = root.getAttribute("data-tema") === "claro" ? "oscuro" : "claro";
    root.setAttribute("data-tema", actual);
    localStorage.setItem("tema", actual);
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

      const mensaje = `¡Mira este producto en Realia Real Styles!\n${nombre} (${talla}) - ${precio}`;
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank", "noopener");
    });
  });

  // 🛒 Agregar al carrito con animación y sonido
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const producto = btn.closest(".producto");
      const nombre = producto.querySelector("h3").textContent;
      const precioTexto = producto.querySelector(".precio").textContent;
      const precio = parseInt(precioTexto.replace(/\D/g, ""));
      const talla = producto.querySelector(".selector-talla").value;

      if (!talla) {
        alert("Por favor selecciona una talla antes de agregar al carrito.");
        return;
      }

      const nuevoItem = {
        nombre,
        precio,
        talla,
        cantidad: 1
      };

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
      }

      // ✈️ Fly to cart animation
      const img = producto.querySelector("img");
      const carritoIcono = document.getElementById("contador-carrito");
      if (img && carritoIcono) {
        flyToCart(img, carritoIcono);
      }

      // 🔊 Sonido al agregar
      const sonidoAgregar = document.getElementById("sonido-agregar");
      if (sonidoAgregar) sonidoAgregar.play();

      alert("✅ Producto agregado al carrito.");
    });
  });

  // ✈️ Fly to cart function
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

  // ✅ Finalizar compra (solo si estás en carrito.html)
  const botonFinalizar = document.getElementById("finalizar-compra");
  if (botonFinalizar) {
    botonFinalizar.addEventListener("click", () => {
      const nombreInput = document.getElementById("nombre-cliente");
      const direccionInput = document.getElementById("direccion-cliente");
      const nombreCliente = nombreInput.value.trim();
      const direccionCliente = direccionInput.value.trim();

      nombreInput.classList.remove("error");
      direccionInput.classList.remove("error");

      if (!nombreCliente || !direccionCliente) {
        if (!nombreCliente) nombreInput.classList.add("error");
        if (!direccionCliente) direccionInput.classList.add("error");
        return;
      }

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      let mensaje = `¡Hola! Soy ${nombreCliente} y quiero hacer este pedido:\n\n`;
      carrito.forEach(item => {
        mensaje += `• ${item.nombre} (${item.talla}) x${item.cantidad} – ${item.precio * item.cantidad} CUP\n`;
      });

      const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      mensaje += `\nTotal: ${total} CUP\n`;
      mensaje += `Dirección: ${direccionCliente}\n\n¿Podemos coordinar el pago?`;

      const numeroWhatsApp = '+5354017939'; // ← Reemplaza con tu número real
      const url = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');

      // 🔊 Sonido al finalizar
      const sonidoFinalizar = document.getElementById("sonido-finalizar");
      if (sonidoFinalizar) sonidoFinalizar.play();

      localStorage.removeItem("carrito");
      alert("✅ ¡Pedido enviado por WhatsApp!");
    });
  }
});
