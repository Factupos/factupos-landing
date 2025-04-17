import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  /* ──────────────────────────────── STATE & REFS ─────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(true);
  const [sending, setSending] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const roleRef = useRef(null);

  /* ──────────────────────────────── EFFECTS ──────────────────────────────────── */
  // Mantener el foco en el primer campo cuando el modal está abierto
  useEffect(() => {
    if (modalOpen) nameRef.current?.focus();
  }, [modalOpen]);

  // Bloquear el scroll del fondo mientras el modal está abierto y
  // garantizar que, al cerrar el formulario, se vea el inicio de la página
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    const toTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (modalOpen) {
      body.classList.add("overflow-hidden");
      toTop(); // al abrir, aseguramos la posición inicial
    } else {
      body.classList.remove("overflow-hidden");
      // pequeño retraso para garantizar que el modal haya salido del flujo
      setTimeout(toTop, 100);
    }

    return () => body.classList.remove("overflow-hidden");
  }, [modalOpen]);

  /* ──────────────────────────────── HELPERS ──────────────────────────────────── */
  const jump = (e, next) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next ? next.current?.focus() : submit();
    }
  };

  const submit = async () => {
    if (sending) return;
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const role = roleRef.current.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^\d+$/.test(phone);

    if (!name) return alert("😊 ¡Cuéntanos tu nombre para saludarte!");
    if (!emailOk) return alert("📧 Revisa tu correo, parece incompleto…");
    if (!phoneOk) return alert("📞 El teléfono solo debe tener números.");
    if (!role) return alert("🙋‍♀️ Selecciona tu perfil para ayudarte mejor.");

    setSending(true);
    try {
      const res = await fetch(
        "https://n8n-docker-render-1.onrender.com/webhook/contacto-formulario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, role }),
        }
      );
      if (!res.ok) throw new Error();

      // limpiar y cerrar modal
      [nameRef, emailRef, phoneRef].forEach((r) => (r.current.value = ""));
      roleRef.current.value = "";
      setModalOpen(false);
    } catch (err) {
      alert("🚨 Tuvimos un inconveniente enviando tus datos. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  /* ──────────────────────────────── COMPONENTS ─────────────────────────────── */
  const ModalForm = (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl border-t-8 border-orange-500"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-3xl font-extrabold mb-6 text-cyan-600 text-center">
              ¡Conversemos! 💬
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="grid gap-5"
            >
              {/* NOMBRE */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                ¿Cómo te llamas?
                <input
                  ref={nameRef}
                  placeholder="Tu nombre"
                  onKeyDown={(e) => jump(e, emailRef)}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
              {/* CORREO */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                ¿Cuál es tu correo electrónico?
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="hola@ejemplo.com"
                  onKeyDown={(e) => jump(e, phoneRef)}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
              {/* TELÉFONO */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                Déjanos tu número WhatsApp o teléfono
                <input
                  ref={phoneRef}
                  type="tel"
                  placeholder="3001234567"
                  onKeyDown={(e) => jump(e, roleRef)}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
              {/* PERFIL */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                ¿Con qué perfil te identificas?
                <select
                  ref={roleRef}
                  onKeyDown={(e) => jump(e, null)}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">-- Selecciona una opción --</option>
                  <option value="Empresario">Empresario</option>
                  <option value="Estudiante">Estudiante</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </label>
              {/* BOTÓN */}
              <button
                type="submit"
                disabled={sending}
                className="relative overflow-hidden flex items-center justify-center w-full py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-60 shadow-lg shadow-orange-500/40"
              >
                {sending && (
                  <span className="absolute left-4 flex items-center justify-center">
                    <span className="animate-ping inline-flex h-4 w-4 rounded-full bg-white/70"></span>
                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </span>
                )}
                <span className="pl-4">
                  {sending ? "Enviando…" : "¡Quiero más info!"}
                </span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ReopenBtn = !modalOpen && (
    <button
      onClick={() => setModalOpen(true)}
      className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-110 transition"
    >
      Formulario
    </button>
  );

  /* WhatsApp Floating Button */
  const WhatsAppBtn = (
    <a
      href="https://wa.me/573147330577"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-4 md:right-6 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl hover:scale-110 transition"
      aria-label="WhatsApp"
    >
      <Image
        src="/images/whatsapp-icon-optimized.svg"
        alt="WhatsApp"
        width={32}
        height={32}
      />
    </a>
  );

  /* Pricing Card Sub‑component */
  const PricingCard = ({ title, price, features, cta, openModal = false }) => (
    <div className="rounded-3xl bg-white p-10 shadow-xl hover:shadow-2xl transition border-t-4 border-cyan-500 max-w-sm mx-auto">
      <h3 className="text-2xl font-extrabold text-cyan-600 mb-4 text-center">
        {title}
      </h3>
      <p className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        {price}
      </p>
      <ul className="space-y-2 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start">
            <span className="text-green-500 mr-2">✔︎</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {cta && (
        <a
          href="#!"
          onClick={(e) => {
            if (openModal) {
              e.preventDefault();
              setModalOpen(true);
            }
          }}
          className="block text-center px-6 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90"
        >
          {cta}
        </a>
      )}
    </div>
  );

  /* ──────────────────────────────── RETURN ──────────────────────────────────── */
  return (
    <main className="font-sans text-gray-800 scroll-smooth">
      {ModalForm}
      {ReopenBtn}
      {WhatsAppBtn}

      {/* HERO */}
      <header className="relative overflow-visible bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-700 text-white pb-20">
        {/* Logo centrado para todos los dispositivos */}
        <div className="absolute top-4 sm:top-6 md:top-6 left-1/2 -translate-x-1/2 lg:left-20 lg:transform-none flex items-center space-x-3">
          <Image
            src="/images/factupos-logo.png"
            alt="FactuPOS"
            width={130}
            height={130}
            priority
            quality={95}
            className="drop-shadow-xl"
          />
          <span className="sr-only">FactuPOS</span>
        </div>

        {/* Contenido central */}
        <div
          className="max-w-6xl mx-auto px-6 pt-32 md:pt-12 text-center flex flex-col items-center"
          id="hero"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight max-w-4xl">
            El software de facturación que evoluciona contigo
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-4xl mx-auto leading-relaxed">
            Cumple con la DIAN, simplifica tus procesos y lleva tu negocio al
            siguiente nivel.
          </p>
          <a
            href="#planes"
            className="relative z-10 mt-2 inline-block bg-orange-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-orange-600 transition"
          >
            ¡Probar ahora!
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white rounded-t-3xl" />
      </header>

      {/* INDUSTRIAS */}
      <section className="-mt-20 relative z-10 bg-white pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Soluciones para cada industria
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                img: "/images/factupos-restaurante.png",
                title: "Restaurantes",
                desc: "Pedidos rápidos, cocina integrada y facturación en un clic.",
              },
              {
                img: "/images/factupos-supermercado.png",
                title: "Punto de venta masivo",
                desc: "Inventario inteligente y ventas ágiles para grandes volúmenes.",
              },
              {
                img: "/images/factupos-rifas-oficina.png",
                title: "Rifas y Sorteos",
                desc: "Control total de boletas, pagos y participantes sin errores.",
              },
              {
                img: "/images/Parqueadero.png",
                title: "Parqueaderos",
                desc: "Entradas y salidas cronometradas, tarifas automáticas y reportes en tiempo real.",
              },
              {
                img: "/images/Dian.png",
                title: "Descarga Masiva DIAN",
                desc: "Automatiza la obtención y organización de facturas electrónicas desde la DIAN.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`p-8 rounded-3xl shadow-xl hover:shadow-3xl hover:-translate-y-1 transition bg-gradient-to-br from-white to-gray-50 border-b-4 border-cyan-500 flex flex-col items-center text-center ${
                  c.title === "Descarga Masiva DIAN"
                    ? "lg:col-span-2 lg:col-start-2"
                    : ""
                }`}
              >
                <Image
                  src={c.img}
                  alt={c.title}
                  width={240}
                  height={240}
                  className="mb-6 rounded-3xl shadow-lg object-cover"
                />
                <h3 className="text-2xl font-bold mb-4 text-cyan-600">
                  {c.title}
                </h3>
                <p className="leading-relaxed text-gray-700 text-base">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES SOFTWARE */}
      <section
        id="planes"
        className="py-24 bg-gradient-to-br from-cyan-50 via-white to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Planes de Software
          </h2>
          <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <PricingCard
              title="FactuPOS Express"
              price="$350.000 pago único"
              cta="Adquirir ahora"
              openModal
              features={[
                "Facturación electrónica",
                "Implementación y acompañamiento DIAN",
                "Sin mensualidades, sin módulos extra",
                "Actualizaciones básicas incluidas",
              ]}
            />
            <PricingCard
              title="FactuPOS Total"
              price="$750.000 + $84.000/mes"
              cta="Quiero todo"
              openModal
              features={[
                "Todos los módulos activos (inventario, compras, reportes, ventas rápidas)",
                "Hasta 9 dispositivos simultáneos",
                "Facturación electrónica opcional incluida",
                "Soporte ilimitado & alojamiento en la nube",
              ]}
            />
            <PricingCard
              title="FactuPOS Rifas Pro"
              price="$1.750.000 + $354.000/mes"
              cta="Gestionar mis rifas"
              openModal
              features={[
                "Crea boletas digitales ilimitadas",
                "Página web para venta de boletas en tiempo real",
                "Mensajería automática por WhatsApp",
                "Hasta 9 dispositivos & nube segura",
              ]}
            />
            <PricingCard
              title="FactuPOS Contador"
              price="$90.000/mes por equipo"
              cta="Empieza hoy"
              openModal
              features={[
                "Suite completa de reportes contables",
                "Sin costo de implementación",
                "Soporte especializado para contadores",
                "Actualizaciones premium continuas",
              ]}
            />
          </div>
        </div>
      </section>

      {/* PACKS DOCUMENTOS ELECTRÓNICOS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Paquetes de Documentos Electrónicos
          </h2>
          <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <PricingCard
              title="Starter 450"
              price="$50.000 / mes"
              features={[
                "450 documentos incluidos",
                "Costo por doc: $111,11",
                "Renovación mensual",
              ]}
            />
            <PricingCard
              title="Pro 1000"
              price="$200.000 / 6 meses"
              features={[
                "1.000 documentos incluidos",
                "Costo por doc: $200",
                "Vigencia 6 meses",
              ]}
            />
            <PricingCard
              title="Enterprise 6000"
              price="$630.000 / año"
              features={[
                "6.000 documentos incluidos",
                "Costo por doc: $105",
                "Vigencia 12 meses",
              ]}
            />
            <PricingCard
              title="Lite 100"
              price="$25.000 / mes"
              features={[
                "100 documentos incluidos",
                "Ideal para pequeñas empresas",
                "Sin permanencia",
              ]}
            />
          </div>
          {/* Card centrado para Facturación Masiva */}
          <div className="mt-12 flex justify-center">
            <PricingCard
              title="Facturación Masiva"
              price="$78 por documento"
              features={[
                "Más de 2.000 documentos al mes",
                "Costo fijo por documento: $78",
                "Soporte prioritario incluido",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-10 text-gray-900">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4 text-left max-w-3xl mx-auto">
            {[
              [
                "¿Cumple con la DIAN?",
                "Sí, estamos 100 % autorizados y certificados para emitir documentos electrónicos.",
              ],
              [
                "¿Hay contrato de permanencia?",
                "No hay contratos ni cláusulas ocultas; cancela cuando quieras.",
              ],
              [
                "¿Puedo migrar desde otro software?",
                "Nuestro equipo de expertos se encarga de migrar tu información sin costo adicional.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="p-6 border border-gray-200 rounded-2xl cursor-pointer open:bg-orange-50"
              >
                <summary className="font-semibold text-gray-900">{q}</summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-14 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Image
              src="/logo.svg"
              alt="FactuPOS"
              width={110}
              height={110}
              className="mb-6"
            />
            <p className="leading-relaxed">
              Simplificamos tu facturación, impulsamos tu negocio.
            </p>
          </div>
          <nav>
            <h3 className="font-bold mb-3 text-white">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Soporte
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h3 className="font-bold mb-3 text-white">Contáctanos</h3>
            <p className="mb-1">factuposcolombia@gmail.com</p>
            <p className="mb-1">+57 310 410 8508</p>
            <p className="">+57 314 733 0577</p>
            <div className="mt-6 flex space-x-6">
              <a
                href="https://wa.me/573147330577"
                className="hover:text-green-400 flex items-center"
                aria-label="WhatsApp"
              >
                <Image
                  src="/images/whatsapp-icon-optimized.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-14 text-sm">
          © {new Date().getFullYear()} FactuPOS. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
