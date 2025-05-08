import React from 'react';
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
    <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-2xl font-semibold">Team Name: BBY-26</p>
      <section className="mt-8 max-w-2xl text-center space-y-4 bg-white p-12 rounded-xl shadow-md text-center">
        <p className="text-lg">
          We are students at the British Columbia Institute of Technology, currently in Term 2 of the Computer Systems Technology diploma program.
        </p>
        <p className="text-lg">
          We are passionate about technology and innovation, and we strive to deliver a high-quality solution that reflects our commitment to learning and excellence.
        </p>
      </section>
      <p className="mt-4 text-xl">Team Members:</p>
      <ul className="list-disc list-inside mt-2 space-y-1 text-lg">
        <li>Arseniuk, Natalia</li>
        <li>Dawood, Aleen</li>
        <li>Duval, Brady</li>
        <li>Oloresisimo, Nathan</li>
        <li>Ponton, Conner</li>
      </ul>

   
    </main>
     <Footer />
     </>
  );
}