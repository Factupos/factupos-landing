import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [showForm, setShowForm] = useState(true);
  const [sending, setSending] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    if (showForm) nameRef.current?.focus();
  }, [showForm]);

  const handleKey = (e, next) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next ? next.current?.focus() : send();
    }
  };

  const send = async () => {
    if (sending) return;

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const role = roleRef.current.value;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\d+$/;

    if (!name || !emailRe.test(email) || !phoneRe.test(phone) || !role) {
      alert("Completa correctamente todos los campos");
      return;
    }

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
      nameRef.current.value = "";
      emailRef.current.value = "";
      phoneRef.current.value = "";
      roleRef.current.value = "";
      setShowForm(false);
    } catch {
      alert("Error al enviar datos");
    } finally {
      setSending(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {showForm && (
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
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700">
              Solicita información
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="grid gap-4"
            >
              <input
                ref={nameRef}
                placeholder="Nombre"
                onKeyDown={(e) => handleKey(e, emailRef)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Correo"
                onKeyDown={(e) => handleKey(e, phoneRef)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                ref={phoneRef}
                type="tel"
                placeholder="Teléfono"
                onKeyDown={(e) => handleKey(e, roleRef)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <select
                ref={roleRef}
                onKeyDown={(e) => handleKey(e, null)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Perfil</option>
                <option value="Empresario">Empresario</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Cliente">Cliente</option>
              </select>
              <button
                type="submit"
                disabled={sending}
                className="relative flex justify-center items-center w-full py-3 bg-gradient-to-r from-sky-500 to-blue-700 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {sending && (
                  <span className="absolute -left-10 flex items-center">
                    <span className="animate-ping inline-flex h-6 w-6 rounded-full bg-white/70 mr-1"></span>
                    <span className="inline-flex h-3 w-3 rounded-full bg-white"></span>
                  </span>
                )}
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const reopenBtn = (
    <button
      onClick={() => setShowForm(true)}
      className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-sky-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-110 transition"
    >
      Solicitar información
    </button>
  );

  const PricingCard = ({ title, price, features, cta }) => (
    <div className="rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition">
      <h3 className="text-2xl font-extrabold text-blue-700 mb-4">{title}</h3>
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
        className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90"
      >
        {cta}
      </a>
    </div>
  );

  return (
    <main className="font-sans text-gray-800">
      {modal}
      {!showForm && reopenBtn}

      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-32 text-center">
          <Image
            src="/logo.svg"
            alt="FactuPOS"
            width={120}
            height={120}
            className="mx-auto mb-6"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl">
            El software de facturación que evoluciona contigo
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto">
            Cumple con la DIAN, simplifica tus procesos y lleva tu negocio al
            siguiente nivel.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-white rounded-t-3xl"></div>
      </header>

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
                <Image
                  src={c.img}
                  alt={c.title}
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h3 className="text-2xl font-bold mb-2 text-blue-700">
                  {c.title}
                </h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">
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
                className="p-4 border border-gray-200 rounded-lg cursor-pointer open:bg-blue-50"
              >
                <summary className="font-semibold">{q}</summary>
                <p className="mt-2 text-gray-700">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
            <p>+57 313 675 9329</p>
            <div className="mt-4 flex space-x-4">
              <a href="https://wa.me/573136759329" className="hover:text-green-400">
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
