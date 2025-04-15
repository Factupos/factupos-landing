// Home.jsx
import { useRef, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  // Referencias a cada campo para manejar el foco secuencial con Enter
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const roleRef = useRef(null);

  // Cuando el componente se monta, enfocamos el campo de nombre
  // (Usa un efecto si estás en Next.js de la forma adecuada, por ejemplo con useEffect).
  // Aquí, para simplicidad, podríamos hacer:
  if (typeof window !== "undefined") {
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }

  // Maneja la lógica de avance con Enter
  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita el envío del formulario al presionar Enter
      if (nextField) {
        nextField.current?.focus();
      } else {
        // Si no hay siguiente campo, envía el formulario
        handleSubmit(e);
      }
    }
  };

  // Función para manejar el envío del formulario
  async function handleSubmit(e) {
    // Si esta función se llama desde el Enter del último campo, revisa si e es un evento
    if (e?.preventDefault) {
      e.preventDefault();
    }

    // Evita doble envío si ya está cargando
    if (isLoading) return;

    setIsLoading(true);

    // Recoger los valores de los campos y quitar espacios en blanco
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const role = roleRef.current.value;

    // Validaciones en la página
    if (!name) {
      alert("Por favor, ingresa tu nombre.");
      setIsLoading(false);
      return;
    }

    // Validación de correo con expresión regular sencilla
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    // Validar que el teléfono contenga solo números
    const phoneRegex = /^\d+$/;
    if (!phone || !phoneRegex.test(phone)) {
      alert("El teléfono debe contener solamente números.");
      setIsLoading(false);
      return;
    }

    // Validar que se seleccione un cargo
    if (!role) {
      alert("Por favor, selecciona tu perfil.");
      setIsLoading(false);
      return;
    }

    // Crear objeto con los datos del formulario
    const formData = { name, email, phone, role };

    // URL de tu Web App de Google Apps Script o backend
    const WEB_APP_URL =
      "https://n8n-docker-render-1.onrender.com/webhook/contacto-formulario";

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      if (!response.ok) {
        throw new Error("La solicitud no fue exitosa.");
      }

      alert("¡Tus datos se han enviado correctamente!");
      // Resetea los campos
      e.target?.reset(); // si se llamó desde el submit, e.target es el form
      // O puedes resetear uno a uno
      nameRef.current.value = "";
      emailRef.current.value = "";
      phoneRef.current.value = "";
      roleRef.current.value = "";
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Hubo un error al enviar tus datos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Sección de cabecera con gradiente más vibrante */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-cyan-500 to-blue-800 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          ¡Facturación Electrónica Moderna para Tu Negocio!
        </h1>
        <p className="text-lg md:text-xl mb-8 font-semibold">
          Fácil, rápida y 100% legal en Colombia
        </p>

        {/* FORMULARIO */}
        <form
          className="max-w-md mx-auto grid gap-6 text-gray-900 bg-white p-6 rounded-xl shadow-2xl"
          onSubmit={handleSubmit}
        >
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              ¿Cómo te llamas?
            </label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              ¿Cuál es tu correo electrónico?
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => handleKeyDown(e, phoneRef)}
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              ¿Cuál es tu número de teléfono?
            </label>
            <input
              ref={phoneRef}
              type="tel"
              name="phone"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => handleKeyDown(e, roleRef)}
            />
          </div>

          {/* Cargo/Perfil */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              ¿Cuál es tu perfil?
            </label>
            <select
              ref={roleRef}
              name="role"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => handleKeyDown(e, null)}
            >
              <option value="">-- Selecciona tu perfil --</option>
              <option value="Empresario">Empresario</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-500 to-blue-700 text-white py-3 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Solicitar información"}
          </button>

          {/* Animación de carga (ejemplo sencillo con texto) */}
          {isLoading && (
            <div className="text-sky-600 font-semibold text-center">
              Guardando tu información, por favor espera...
            </div>
          )}
        </form>
      </section>

      {/* Sección con tarjetas */}
      <section className="py-16 bg-blue-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-blue-900">
            ¿Por qué usar FactuPOS?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-sky-700">
                Cumple con la DIAN
              </h3>
              <p className="leading-relaxed">
                Facturación electrónica totalmente legal y actualizada a la
                normativa colombiana.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-sky-700">
                Fácil y rápida
              </h3>
              <p className="leading-relaxed">
                Emite tus facturas en segundos desde cualquier dispositivo
                conectado.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-sky-700">
                Soporte confiable
              </h3>
              <p className="leading-relaxed">
                Te acompañamos en cada paso para que tengas todo funcionando sin
                errores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos de empresas */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-700">
          Empresas que confían en nosotros
        </h2>
        <div className="flex justify-center gap-8 flex-wrap">
          <img
            src="/images/logo1.png"
            alt="Logo 1"
            className="h-12 grayscale hover:grayscale-0 transition duration-300"
          />
          <img
            src="/images/logo2.png"
            alt="Logo 2"
            className="h-12 grayscale hover:grayscale-0 transition duration-300"
          />
          <img
            src="/images/logo3.png"
            alt="Logo 3"
            className="h-12 grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} FactuPOS. Todos los derechos
          reservados.
        </p>
      </footer>

      {/* Botón fijo de WhatsApp más llamativo y con efecto de hover/click */}
      <a
        href="https://wa.me/573136759329"
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl
                  bg-gradient-to-tr from-green-400 to-green-600
                  hover:scale-110 active:scale-90 transition-transform"
        title="Escríbenos por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-7 w-7 text-white"
          fill="currentColor"
        >
          <path d="M380.9 97.1C339 55.3 283.2 32 224 32 100.3 32 0 132.3 0 256c0 45.5 12 
                  89.9 34.9 128.4L0 480l97.6-34.1c36.2 19.8 77.7 30.3 119.4 
                  30.3 123.7 0 224-100.3 224-224 0-59.2-23.3-115-65.1-157.9zM224 
                  438.6c-36.5 0-72.2-9.8-103.1-28.3l-7.3-4.3-57.8 
                  20.2 19.5-56.5-4.6-7.4C49.6 325.8 38 292.6 38 256 
                  38 141.1 141.1 38 256 38c114.9 0 218 103.1 218 
                  218 0 114.9-103.1 218-218 218zm101.3-148.7c-5.5-2.8-32.4-16-37.5-17.9-5.1-1.9-8.8-2.8-12.5
                  2.8-3.7 5.5-14.3 17.9-17.5 
                  21.6-3.2 3.7-6.5 4.2-12 1.4-32.4-16-53.7-28.7-75-65-5.7-9.8 
                  5.7-9.1 16.4-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.1-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7
                  1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 
                  46.3s19.9 53.6 22.7 57.3c2.8 
                  3.7 39.3 60.1 95.4 84.2 13.3 
                  5.8 23.7 9.3 31.8 11.9 13.3 
                  4.3 25.4 3.7 35 2.3 10.7-1.5 
                  32.4-13.2 37.1-25.9 4.7-12.7 
                  4.7-23.6 3.3-25.9-1.3-2.3-5-3.7-10.5-6.5z" />
        </svg>
      </a>
    </main>
  );
}
