export default function Home() {
  // Función para manejar el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    // Recoger los valores de los campos y quitar espacios en blanco
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const role = e.target.role.value;

    // Validaciones en la página
    if (!name) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    // Validación de correo con expresión regular sencilla
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validar que el teléfono contenga solo números
    const phoneRegex = /^\d+$/;
    if (!phone || !phoneRegex.test(phone)) {
      alert("El teléfono debe contener solamente números.");
      return;
    }

    // Validar que se seleccione un cargo
    if (!role) {
      alert("Por favor, selecciona tu cargo (Empresario, estudiante o cliente).");
      return;
    }

    // Crear objeto con los datos del formulario
    const formData = { name, email, phone, role };

    // URL de tu Web App de Google Apps Script
    const WEB_APP_URL = "https://n8n-docker-render-1.onrender.com/webhook/contacto-formulario";

try {
  const response = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error("La solicitud no fue exitosa.");
  }

  alert("¡Datos enviados correctamente!");
  e.target.reset();
} catch (error) {
  console.error("Error al enviar datos:", error);
  alert("Hubo un error al enviar tus datos.");
}
}

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="text-center py-20 px-6 bg-gradient-to-r from-sky-500 to-blue-800 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Facturación Electrónica para tu negocio
        </h1>
        <p className="text-lg mb-6">
          Fácil, rápida y 100% legal en Colombia
        </p>
        <form
          className="max-w-md mx-auto grid gap-4 text-gray-900 bg-white p-6 rounded shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="p-3 rounded border border-gray-300"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="p-3 rounded border border-gray-300"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            className="p-3 rounded border border-gray-300"
            required
          />

          {/* Campo para seleccionar el cargo */}
          <select
            name="role"
            className="p-3 rounded border border-gray-300"
            required
          >
            <option value="">-- Selecciona tu cargo --</option>
            <option value="Empresario">Empresario</option>
            <option value="estudiante">Estudiante</option>
            <option value="cliente">Cliente</option>
          </select>

          <button
            type="submit"
            className="bg-sky-600 text-white py-3 rounded hover:bg-sky-700"
          >
            Solicitar información
          </button>
        </form>
      </section>

      <section className="py-16 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué usar FactuPOS?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Cumple con la DIAN</h3>
              <p>
                Facturación electrónica totalmente legal y actualizada a la
                normativa colombiana.
              </p>
            </div>
            <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Fácil y rápida</h3>
              <p>
                Emite tus facturas en segundos desde cualquier dispositivo
                conectado.
              </p>
            </div>
            <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Soporte confiable</h3>
              <p>
                Te acompañamos en cada paso para que tengas todo funcionando sin
                errores.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-center">
        <h2 className="text-2xl font-bold mb-8">
          Empresas que confían en nosotros
        </h2>
        <div className="flex justify-center gap-8 flex-wrap">
          <img
            src="/images/logo1.png"
            alt="Logo 1"
            className="h-12 grayscale hover:grayscale-0 transition"
          />
          <img
            src="/images/logo2.png"
            alt="Logo 2"
            className="h-12 grayscale hover:grayscale-0 transition"
          />
          <img
            src="/images/logo3.png"
            alt="Logo 3"
            className="h-12 grayscale hover:grayscale-0 transition"
          />
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; {new Date().getFullYear()} FactuPOS. Todos los derechos reservados.</p>
      </footer>

      {/* Botón fijo de WhatsApp con ícono más oficial */}
      <a
        href="https://wa.me/573136759329"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50"
        title="Escríbenos por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-7 w-7"
          fill="currentColor"
        >
          {/* Ícono oficial de WhatsApp (versión de Font Awesome) */}
          <path d="M380.9 97.1C339 55.3 283.2 32 224 32 100.3 32 0 132.3 0 256c0 45.5 12 89.9 34.9 128.4L0 480l97.6-34.1c36.2 19.8 77.7 30.3 119.4 30.3 123.7 0 224-100.3 224-224 0-59.2-23.3-115-65.1-157.9zM224 438.6c-36.5 0-72.2-9.8-103.1-28.3l-7.3-4.3-57.8 20.2 19.5-56.5-4.6-7.4C49.6 325.8 38 292.6 38 256 38 141.1 141.1 38 256 38c114.9 0 218 103.1 218 218 0 114.9-103.1 218-218 218zm101.3-148.7c-5.5-2.8-32.4-16-37.5-17.9-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 17.9-17.5 21.6-3.2 3.7-6.5 4.2-12 1.4-32.4-16-53.7-28.7-75-65-5.7-9.8 5.7-9.1 16.4-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.1-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.6 22.7 57.3c2.8 3.7 39.3 60.1 95.4 84.2 13.3 5.8 23.7 9.3 31.8 11.9 13.3 4.3 25.4 3.7 35 2.3 10.7-1.5 32.4-13.2 37.1-25.9 4.7-12.7 4.7-23.6 3.3-25.9-1.3-2.3-5-3.7-10.5-6.5z" />
        </svg>
      </a>
    </main>
  );
}
