"use client";

import React from "react";

const plans = [
  {
    name: "Gratis",
    price: "$0",
    description: "Primer libro gratis",
    features: ["Sube y genera un libro PDF"],
  },
  {
    name: "Suscripción",
    price: "$15/mes",
    description: "Libros ilimitados",
    features: [
      "Sube y genera libros ilimitados",
      "Acceso a diseños premium",
      "Soporte prioritario",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Planes y Precios</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex-1 border border-gray-300 rounded-lg p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">{plan.price}</p>
            <p className="mb-4">{plan.description}</p>
            <ul className="mb-6 list-disc list-inside space-y-1 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button className="mt-auto bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Elegir
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
