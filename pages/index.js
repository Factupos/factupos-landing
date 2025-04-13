export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="text-center py-20 px-6 bg-gradient-to-r from-sky-500 to-blue-800 text-white">
        <h1 className="text-4xl font-bold mb-4">Facturación Electrónica para tu negocio</h1>
        <p className="text-lg mb-6">Fácil, rápida y 100% legal en Colombia</p>
        <form className="max-w-md mx-auto grid gap-4 text-gray-900 bg-white p-6 rounded shadow-md">
          <input type="text" placeholder="Nombre" className="p-3 rounded border border-gray-300" />
          <input type="email" placeholder="Correo electrónico" className="p-3 rounded border border-gray-300" />
          <input type="tel" placeholder="Teléfono" className="p-3 rounded border border-gray-300" />
          <button type="submit" className="bg-sky-600 text-white py-3 rounded hover:bg-sky-700">
            Solicitar información
          </button>
        </form>
      </section>
<section className="py-16 bg-gray-50 text-gray-800">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-12">¿Por qué usar FactuPOS?</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Cumple con la DIAN</h3>
        <p>Facturación electrónica totalmente legal y actualizada a la normativa colombiana.</p>
      </div>
      <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Fácil y rápida</h3>
        <p>Emite tus facturas en segundos desde cualquier dispositivo conectado.</p>
      </div>
      <div className="p-6 bg-white rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Soporte confiable</h3>
        <p>Te acompañamos en cada paso para que tengas todo funcionando sin errores.</p>
      </div>
    </div>
  </div>
</section>
<section className="py-16 bg-white text-center">
  <h2 className="text-2xl font-bold mb-8">Empresas que confían en nosotros</h2>
  <div className="flex justify-center gap-8 flex-wrap">
    <img src="/images/logo1.png" alt="Logo 1" className="h-12 grayscale hover:grayscale-0 transition" />
    <img src="/images/logo2.png" alt="Logo 2" className="h-12 grayscale hover:grayscale-0 transition" />
    <img src="/images/logo3.png" alt="Logo 3" className="h-12 grayscale hover:grayscale-0 transition" />
  </div>
</section>
<footer className="bg-gray-800 text-white py-8 text-center">
  <p>&copy; {new Date().getFullYear()} FactuPOS. Todos los derechos reservados.</p>
</footer>



    </main>
  );
}

