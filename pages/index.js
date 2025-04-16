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
      alert(
        "🚨 Tuvimos un inconveniente enviando tus datos. Intenta nuevamente."
      );
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-primary-600 text-center">
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
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </label>
              {/* PERFIL */}
              <label className="flex flex-col text-sm font-medium text-gray-700 gap-1">
                ¿Con qué perfil te identificas?
                <select
                  ref={roleRef}
                  onKeyDown={(e) => jump(e, null)}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="relative overflow-hidden flex items-center justify-center w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60"
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

  const ReopenBtn =
    !modalOpen && (
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-110 transition"
      >
        Formulario
      </button>
    );

  const WhatsappButton = (
    <a
      href="https://wa.me/573136759329"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros en WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-2xl hover:scale-110 transition"
    >
      {/* Ícono WhatsApp */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
      >
        <path d="M16 0C7.16 0 0 7.16 0 16c0 2.82.74 5.44 2.04 7.75L0 32l8.46-2.22C10.66 30.97 13.26 32 16 32c8.84 0 16-7.16 16-16S24.84 0 16 0zm0 29.12c-2.46 0-4.77-.64-6.8-1.75l-.48-.28-5.02 1.32 1.34-4.88-.31-.5C3.65 21.23 3.07 18.67 3.07 16 3.07 8.98 8.98 3.07 16 3.07S28.93 8.98 28.93 16 23.02 28.93 16 28.93zm8.4-11.63c-.43-.22-2.53-1.25-2.92-1.4-.39-.14-.67-.22-.96.22-.29.43-1.1 1.4-1.34 1.68-.24.29-.49.32-.92.11-.43-.22-1.82-.67-3.46-2.14-1.28-1.14-2.14-2.53-2.39-2.96-.25-.43-.03-.66.19-.88.19-.19.43-.49.64-.74.22-.25.29-.43.43-.71.14-.29.07-.54-.04-.75-.11-.22-.96-2.3-1.32-3.16-.35-.85-.71-.74-.96-.76-.25-.02-.54-.02-.82-.02-.29 0-.75.11-1.14.54-.39.43-1.49 1.46-1.49 3.56s1.53 4.13 1.75 4.42c.22.29 3.01 4.6 7.3 6.46 1.02.44 1.81.7 2.42.9 1.02.33 1.95.28 2.68.17.82-.12 2.53-1.03 2.89-2.03.36-1 .36-1.86.25-2.03-.11-.17-.39-.28-.82-.49z" />
      </svg>
    </a>
  );

  /* ──────────────────────────────── SUB‑COMPONENTES ─────────────────────────── */
  const PricingCard = ({ title, price, features, cta }) => (
    <div className="rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-2xl font-extrabold text-primary-600 mb-4">{title}</h3>
      <p className="text-4xl font-black text-gray-900 mb-4">{price}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start">
            <span className="text-green-500 mr-2">✔︎</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#!"
        className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg font-semibold hover:opacity-90"
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
      {WhatsappButton}

      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-5xl md:max-w-6xl mx-auto px-6 pt-36 pb-40 text-center">
          <Image
            src="/logo.svg"
            alt="FactuPOS"
            width={130}
            height={130}
            className="mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight drop-shadow-xl">
            <span className="block">El software de facturación</span>
            <span className="block">que evoluciona contigo</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            Cumple con la DIAN, simplifica tus procesos y lleva tu negocio al
            siguiente nivel.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-white rounded-t-3xl" />
      </header>

      {/* INDUSTRIAS */}
      <section className="-mt-24 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
            Soluciones para cada industria
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "/images/restaurant.svg",
                title: "Restaurantes",
                desc: "Pedidos rápidos, cocina conectada y facturación en un clic.",
              },
              {
                img: "/images/retail.svg",
                title: "Retail",
                desc: "Gestión de inventario inteligente y ventas omnicanal.",
              },
              {
                img: "/images/servicios.svg",
                title: "Servicios",
                desc: "Agenda tus citas, factura y cobra desde cualquier lugar.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-white to-gray-50"
              >
                <Image src={c.img} alt={c.title} width={80} height={80} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-primary-600">{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
            Planes sin letra pequeña
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-900">
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
                className="p-4 border border-gray-200 rounded-lg cursor-pointer open:bg-primary-50"
              >
                <summary className="font-semibold">{q}</summary>
                <p className="mt-2 text-gray-700">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="mb-4"
            />
            <p>Simplificamos tu facturación, impulsamos tu negocio.</p>
          </div>
          <nav>
            <h3 className="font-bold mb-2">Empresa</h3>
            <ul className="space-y-1">
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
            <h3 className="font-bold mb-2">Contáctanos</h3>
            <p>soporte@factupos.co</p>
            <p>+57 313 675 9329</p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://wa.me/573136759329"
                className="hover:text-emerald-400"
              >
                WhatsApp
              </a>
              <a href="https://github.com/Factupos" className="hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-10 text-sm">
          © {new Date().getFullYear()} FactuPOS. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}

/* ──────────────────────────────── TAILWIND EXTENDED COLORS ───────────────────
Añade estas extensiones en tu tailwind.config.js para mantener coherencia cromática
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff6eb",
          100: "#ffe9cc",
          200: "#ffd9a3",
          300: "#ffc97a",
          400: "#ffb84d",
          500: "#ff9c1a", // tono principal naranja‑amarillo del logotipo
          600: "#ff8c00",
          700: "#e57d00",
        },
      },
    },
  },
};
────────────────────────────────────────────────────────────────────────────*/
