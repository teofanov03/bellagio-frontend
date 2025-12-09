import React from 'react';

// Pretpostavka: Imate sliku enterijera u public/images/restaurant-interior.jpg
const HeroSection = () => {
  return (
    <section 
      className="relative h-screen bg-gray-900 flex items-center justify-center text-center"
      style={{ 
       backgroundImage: `url('/restaurant-interior.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        repeat: 'no-repeat',
      }}
    >
      {/* Tamni Overlay za bolji kontrast teksta (Luksuzni izgled) */}
      <div className="absolute inset-0 bg-black opacity-70"></div> 

      {/* Sadržaj Sekcije */}
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif text-yellow-100 mb-6 tracking-wider leading-tight">
          Experience Italian Elegance
        </h1>
        
        <p className="text-xl text-gray-300 mb-10 font-light">
          Where tradition meets modern sophistication in every dish and every detail.
        </p>

        <div className="flex justify-center space-x-6">
          {/* Glavni CTA: Rezervacija */}
          <a 
            href="#reservation" 
            className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-emerald-700 transition duration-300 transform hover:scale-105 uppercase tracking-wider"
          >
            Book a Table
          </a>
          
          {/* Sekundarni CTA: Meni */}
          <a 
            href="#menu" 
            className="bg-transparent border-2 border-yellow-100 text-yellow-100 font-semibold py-3 px-8 rounded-lg hover:bg-yellow-100 hover:text-gray-900 transition duration-300 uppercase tracking-wider"
          >
            View Menu
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;