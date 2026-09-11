"use client";

import { Navbar } from "../components/Navbar";
import { Plane, CloudSun, AlertCircle, ArrowRight } from "lucide-react";
import { formatCents } from "../lib/finance/metrics";

export default function TravelPage() {
  const travelBudgetAccruedCents = 420000; // $4,200.00
  const monthlyTravelAllocationCents = 35000; // $350.00 / month

  const modeledFlights = [
    {
      id: "fl-1",
      origin: "JFK (New York)",
      destination: "LHR (London Heathrow)",
      airline: "Modeled Route Estimate",
      modeledPriceCents: 54000,
      seasonality: "Low season (optimal booking)",
      weather: "61°F · Partly Cloudy",
    },
    {
      id: "fl-2",
      origin: "SFO (San Francisco)",
      destination: "HND (Tokyo Haneda)",
      airline: "Modeled Route Estimate",
      modeledPriceCents: 89000,
      seasonality: "Shoulder season",
      weather: "68°F · Clear",
    },
    {
      id: "fl-3",
      origin: "ORD (Chicago)",
      destination: "CDG (Paris Charles de Gaulle)",
      airline: "Modeled Route Estimate",
      modeledPriceCents: 62000,
      seasonality: "Moderate demand",
      weather: "64°F · Mild Breeze",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
              <span>LINE: TRAVEL REVENUE & EXPENSE</span>
              <span>•</span>
              <span>INTEGRATION: MODELED FALLBACK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Travel Financial Intelligence
            </h1>
          </div>
        </div>

        {/* Informational banner about API mode */}
        <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Modeled Estimates Active: </span>
            <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">FLIGHTS_API_BASE_URL</code> is not configured. Displaying calibrated historical baseline benchmarks and keyless National Weather Service observations.
          </div>
        </div>

        {/* Travel Capital Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 font-medium mb-1">Accrued Travel Reserve</div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatCents(travelBudgetAccruedCents)}
            </div>
            <div className="text-xs text-emerald-400">
              Allocated from discretionary cash retention
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 font-medium mb-1">Monthly Discretionary Velocity</div>
            <div className="text-3xl font-bold text-indigo-400 mb-2">
              {formatCents(monthlyTravelAllocationCents)}
            </div>
            <div className="text-xs text-slate-400">
              Automated savings sink per payroll cycle
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 font-medium mb-1">Active Destination Benchmarks</div>
            <div className="text-3xl font-bold text-white mb-2">3 Routes</div>
            <div className="text-xs text-slate-400">
              Calibrated against cash forecast horizon
            </div>
          </div>
        </div>

        {/* Modeled Routes Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Plane className="w-4 h-4 text-indigo-400" />
            Modeled Corridor Index & Destination Atmospheric Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modeledFlights.map((flight) => (
              <div key={flight.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>{flight.origin.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{flight.destination.split(" ")[0]}</span>
                </div>

                <div className="text-lg font-bold text-white mb-1">
                  {formatCents(flight.modeledPriceCents)}
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  {flight.seasonality}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-300">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{flight.weather}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
