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
  useEffect(() => {
    if (modalOpen) nameRef.current?.focus();
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
            className="relative w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl border-t-8 border-cyan-500"
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
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              {/* PERFIL */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                ¿Con qué perfil te identificas?
                <select
                  ref={roleRef}
                  onKeyDown={(e) => jump(e, null)}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
      className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-110 transition"
    >
      Formulario
    </button>
  );

  /* WhatsApp Floating Button */
  const WhatsAppBtn = (
    <a
      href="https://wa.me/573136759329"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl hover:scale-110 transition"
      aria-label="WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-9 h-9"
      >
        <path d="M16 .063c-8.837 0-16 7.163-16 16 0 2.837.722 5.623 2.094 8.063L.063 32l8.063-2.094C10.377 30.277 13.163 31 16 31c8.837 0 16-7.163 16-16S24.837.063 16 .063zm0 2.938c7.146 0 12.999 5.853 12.999 12.999 0 7.146-5.853 12.999-12.999 12.999-2.746 0-5.404-.828-7.68-2.395l-.549-.364-4.791 1.244 1.277-4.666-.357-.573C3.618 20.718 2.938 18.428 2.938 16 2.938 8.854 8.854 3 16 3zm7.068 17.24c-.297-.148-1.759-.867-2.031-.965-.273-.099-.472-.148-.67.148-.199.297-.767.965-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.763-1.653-2.06-.173-.297-.019-.458.13-.606.134-.134.297-.347.446-.52.148-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.669-1.612-.916-2.214-.242-.58-.487-.502-.669-.513l-.57-.01c-.198 0-.52.074-.793.372-.273.297-1.041 1.017-1.041 2.48 0 1.462 1.065 2.875 1.213 3.074.148.198 2.1 3.205 5.072 4.492.708.305 1.262.487 1.693.623.712.227 1.36.195 1.872.118.571-.085 1.759-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
      </svg>
    </a>
  );

  /* Pricing Card Sub‑component */
  const PricingCard = ({ title, price, features, cta }) => (
    <div className="rounded-3xl bg-white p-10 shadow-xl hover:shadow-2xl transition border-t-4 border-cyan-500">
      <h3 className="text-2xl font-extrabold text-cyan-600 mb-4 text-center">
        {title}
      </h3>
      <p className="text-4xl font-black text-gray-900 mb-6 text-center">
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
      <a
        href="#!"
        className="block text-center px-6 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90"
      >
        {cta}
      </a>
    </div>
  );

  /* ──────────────────────────────── RETURN ──────────────────────────────────── */
  return (
    <main className="font-sans text-gray-800 scroll-smooth">
      {ModalForm}
      {ReopenBtn}
      {WhatsAppBtn}

      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-36 text-center flex flex-col items-center">
          <Image
      src="/images/factupos-logo.png"
      alt="FactuPOS"
      width={140}
      height={140}
      priority
      quality={95}
      className="mx-auto mb-8 drop-shadow-xl"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight max-w-4xl">
            El software de facturación que evoluciona contigo
          </h1>
          <p className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto leading-relaxed">
            Cumple con la DIAN, simplifica tus procesos y lleva tu negocio al siguiente
            nivel.
          </p>
          <a
            href="#planes"
            className="mt-10 inline-block bg-white text-cyan-600 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            ¡Probar ahora!
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-white rounded-t-3xl" />
      </header>

      {/* INDUSTRIAS */}
      <section className="-mt-24 relative z-10 bg-white pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Soluciones para cada industria
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                img: "/images/factupos-restaurante.png",
                title: "Restaurantes",
                desc: "Pedidos rápidos, cocina conectada y facturación en un clic.",
              },
              {
                img: "/images/factupos-supermercado.png",
                title: "Retail",
                desc: "Gestión de inventario inteligente y ventas omnicanal.",
              },
              {
                img: "/images/factupos-rifas-oficina.png",
                title: "Rifas y Sorteos",
                desc: "Control total de boletas, pagos y participantes.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="p-10 rounded-3xl shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-white to-gray-50 border-b-4 border-cyan-500"
              >
                <Image
                  src={c.img}
                  alt={c.title}
                  width={90}
                  height={90}
                  className="mb-6"
                />
                <h3 className="text-2xl font-bold mb-3 text-cyan-600">
                  {c.title}
                </h3>
                <p className="leading-relaxed text-gray-700">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="py-24 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Planes sin letra pequeña
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            <PricingCard
              title="Básico"
              price="$59.000/mes"
              cta="Comenzar"
              features={[
                "50 facturas mensuales",
                "Soporte chat",
                "Actualizaciones automáticas",
              ]}
            />
            <PricingCard
              title="Pro"
              price="$99.000/mes"
              cta="Probar gratis"
              features={[
                "Ilimitado",
                "Catálogo de productos",
                "Soporte 24/7",
              ]}
            />
            <PricingCard
              title="Empresarial"
              price="A la medida"
              cta="Contactar"
              features={[
                "Usuarios ilimitados",
                "Integraciones API",
                "Gerente de cuenta",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-10 text-gray-900">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4 text-left max-w-3xl mx-auto">
            {[
              [
                "¿Cumple con la DIAN?",
                "Sí, estamos 100 % autorizados y certificados.",
              ],
              [
                "¿Hay contrato de permanencia?",
                "No hay contratos ni cláusulas ocultas; cancela cuando quieras.",
              ],
              [
                "¿Puedo migrar desde otro software?",
                "Contamos con equipo de migración gratuito.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="p-6 border border-gray-200 rounded-2xl cursor-pointer open:bg-cyan-50"
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
              alt="logo"
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
            <p>soporte@factupos.co</p>
            <p>+57 313 675 9329</p>
            <div className="mt-6 flex space-x-6">
              <a
                href="https://wa.me/573136759329"
                className="hover:text-green-400 flex items-center"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path d="M16 .063c-8.837 0-16 7.163-16 16 0 2.837.722 5.623 2.094 8.063L.063 32l8.063-2.094C10.377 30.277 13.163 31 16 31c8.837 0 16-7.163 16-16S24.837.063 16 .063zm0 2.938c7.146 0 12.999 5.853 12.999 12.999 0 7.146-5.853 12.999-12.999 12.999-2.746 0-5.404-.828-7.68-2.395l-.549-.364-4.791 1.244 1.277-4.666-.357-.573C3.618 20.718 2.938 18.428 2.938 16 2.938 8.854 8.854 3 16 3zm7.068 17.24c-.297-.148-1.759-.867-2.031-.965-.273-.099-.472-.148-.67.148-.199.297-.767.965-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.763-1.653-2.06-.173-.297-.019-.458.13-.606.134-.134.297-.347.446-.52.148-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.669-1.612-.916-2.214-.242-.58-.487-.502-.669-.513l-.57-.01c-.198 0-.52.074-.793.372-.273.297-1.041 1.017-1.041 2.48 0 1.462 1.065 2.875 1.213 3.074.148.198 2.1 3.205 5.072 4.492.708.305 1.262.487 1.693.623.712.227 1.36.195 1.872.118.571-.085 1.759-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="https://github.com/Factupos"
                className="hover:text-white flex items-center"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.603-3.369-1.343-3.369-1.343-.455-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.087 2.91.832.092-.647.349-1.087.636-1.337-2.22-.252-4.555-1.11-4.555-4.945 0-1.092.39-1.987 1.03-2.687-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.56 9.56 0 0112 6.845c.853.004 1.71.115 2.514.337 1.908-1.295 2.748-1.026 2.748-1.026.546 1.377.202 2.394.1 2.647.64.7 1.028 1.595 1.028 2.687 0 3.845-2.338 4.69-4.566 4.938.359.31.678.92.678 1.854 0 1.338-.012 2.417-.012 2.747 0 .269.18.58.688.48A10.014 10.014 0 0022 12c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
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
