"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Car,
  Calendar,
  MessageSquare,
  Upload,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  HardDrive,
} from "lucide-react";

interface Appointment {
  id: string;
  client: string;
  phone: string;
  vehicle: string;
  service: string;
  shade: string;
  status: "En Proceso" | "Listo para Entrega" | "Pendiente" | "Entregado";
  time: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "ET-1042",
    client: "Carlos Mendoza",
    phone: "+1 (829) 555-0192",
    vehicle: "Tesla Model Y 2024",
    service: "Nano-Ceramic Completo",
    shade: "20% laterales / 70% parabrisas",
    status: "En Proceso",
    time: "09:30 AM",
  },
  {
    id: "ET-1043",
    client: "Roberto Valenzuela",
    phone: "+1 (809) 555-8371",
    vehicle: "BMW M3 Competition 2023",
    service: "PPF Full Front + Tint 5%",
    shade: "5% Limo trasero",
    status: "Listo para Entrega",
    time: "11:00 AM",
  },
  {
    id: "ET-1044",
    client: "Valeria Gómez",
    phone: "+1 (849) 555-4819",
    vehicle: "Porsche Macan GTS 2024",
    service: "Ceramic Coating 9H + Tint 35%",
    shade: "35% Completo",
    status: "Pendiente",
    time: "02:00 PM",
  },
  {
    id: "ET-1045",
    client: "Alejandro Peña",
    phone: "+1 (829) 555-9011",
    vehicle: "Ford Raptor 2023",
    service: "Nano-Ceramic IR Extreme",
    shade: "20% Factory Match",
    status: "Entregado",
    time: "08:00 AM",
  },
];

interface NocturnalLead {
  id: string;
  sender: string;
  phone: string;
  time: string;
  message: string;
  vehicle: string;
  handled: boolean;
}

const INITIAL_LEADS: NocturnalLead[] = [
  {
    id: "LEAD-89",
    sender: "Eduardo Castillo",
    phone: "+1 829-444-2211",
    time: "Ayer a las 11:42 PM",
    message: "Buenas noches, cuánto sale polarizar un Honda Civic 2022 en nano cerámica?",
    vehicle: "Honda Civic 2022",
    handled: false,
  },
  {
    id: "LEAD-90",
    sender: "Marcos Santana",
    phone: "+1 809-333-8899",
    time: "Hoy a las 02:15 AM",
    message: "Hola, tienen cupo para instalar PPF frontal en una Toyota Prado este fin de semana?",
    vehicle: "Toyota Prado 2024",
    handled: false,
  },
];

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [leads, setLeads] = useState<NocturnalLead[]>(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState<"citas" | "whatsapp" | "buckets">("citas");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "portfolio/bmw-m3-ceramic-tint.jpg",
    "portfolio/tesla-model-y-nano70.jpg",
    "portfolio/porsche-macan-ppf-complete.jpg",
  ]);

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const markLeadHandled = (id: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, handled: true } : lead))
    );
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setTimeout(() => {
      const newName = `portfolio/job-${Date.now()}-${files[0].name}`;
      setUploadedFiles((prev) => [newName, ...prev]);
      setUploading(false);
    }, 1200);
  };

  const filteredAppointments = appointments.filter(
    (app) =>
      app.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <h1 className="text-lg font-black tracking-wider text-white">EXCLUSIVE TINT</h1>
          </div>
          <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
            Admin Portal v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 rounded-xl px-3 py-1.5"
          >
            Ver Sitio Web <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
            ET
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Citas del Día</span>
              <Calendar className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-white">{appointments.length}</div>
            <p className="mt-1 text-xs text-emerald-400">2 vehículos en bahía actual</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Leads WhatsApp</span>
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-white">
              {leads.filter((l) => !l.handled).length}
            </div>
            <p className="mt-1 text-xs text-amber-400">Pendientes de respuesta matutina</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Neon Buckets (S3)</span>
              <HardDrive className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-white">{uploadedFiles.length}</div>
            <p className="mt-1 text-xs text-zinc-400">Bucket: <code className="text-zinc-200">etmedia</code></p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-lg">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Base de Datos</span>
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-white">Neon DB</div>
            <p className="mt-1 text-xs text-zinc-400">Postgres.js conectado</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("citas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "citas"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Car className="h-4 w-4" /> Control de Bahías y Citas
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "whatsapp"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Bot Nocturno WhatsApp
            {leads.filter((l) => !l.handled).length > 0 && (
              <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] text-white font-mono">
                {leads.filter((l) => !l.handled).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("buckets")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "buckets"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Upload className="h-4 w-4" /> Galería Neon Buckets
          </button>
        </div>

        {/* Tab 1: Citas y Trabajos en Curso */}
        {activeTab === "citas" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, auto o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Filter className="h-4 w-4" /> Total registrados: {filteredAppointments.length}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900/60 text-xs uppercase text-zinc-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">ID / Hora</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Vehículo</th>
                    <th className="px-6 py-4">Servicio & Tono</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-normal">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-amber-400 font-bold block">{app.id}</span>
                        <span className="text-xs text-zinc-500">{app.time}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-white">{app.client}</div>
                        <div className="text-xs text-zinc-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                          <Car className="h-3.5 w-3.5 text-zinc-400" /> {app.vehicle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{app.service}</div>
                        <div className="text-xs text-zinc-400">{app.shade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            app.status === "En Proceso"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : app.status === "Listo para Entrega"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : app.status === "Pendiente"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as Appointment["status"])
                          }
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Listo para Entrega">Listo</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp Nocturno */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="font-bold text-amber-300">
                  Bot Nocturno de WhatsApp Activo (7:00 PM - 8:30 AM)
                </p>
                <p className="text-zinc-400">
                  El webhook <code className="bg-black/50 px-1 py-0.5 rounded text-zinc-300">/api/webhook/whatsapp</code> responde automáticamente con el cuestionario de cotización a clientes nocturnos y guarda su consulta como lead prioritario.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`rounded-2xl border p-5 backdrop-blur flex flex-col justify-between transition-all ${
                    lead.handled
                      ? "border-white/5 bg-zinc-950/40 opacity-60"
                      : "border-white/15 bg-zinc-950 shadow-xl"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{lead.sender}</span>
                        <span className="text-xs text-zinc-500">({lead.phone})</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lead.time}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-xs text-zinc-300 italic">
                      &quot;{lead.message}&quot;
                    </div>

                    <div className="text-xs text-zinc-400">
                      <strong>Auto detectado:</strong> <span className="text-amber-400">{lead.vehicle}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        lead.handled ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {lead.handled ? "✓ Gestionado" : "● Respuesta pendiente"}
                    </span>

                    <div className="flex items-center gap-2">
                      {!lead.handled && (
                        <button
                          onClick={() => markLeadHandled(lead.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                        >
                          Marcar contactado
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        Abrir Chat
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Neon Buckets Gallery */}
        {activeTab === "buckets" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-amber-400" /> Almacenamiento S3 en Neon Buckets
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                  Sube fotos de trabajos terminados antes y después directamente a tu bucket <code className="text-amber-400">etmedia</code> vía pre-signed URLs configuradas en <code className="text-zinc-200">src/lib/storage.ts</code>.
                </p>
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Subiendo a Neon..." : "Subir Foto al Bucket"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-3"
                >
                  <div className="h-40 rounded-xl bg-zinc-800/80 border border-white/5 flex flex-col items-center justify-center text-zinc-500 text-xs p-4 text-center">
                    <Car className="h-8 w-8 text-zinc-600 mb-2" />
                    <span className="font-mono text-[11px] text-zinc-400 truncate max-w-full">
                      {file}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Guardado en S3</span>
                    <span className="text-emerald-400 font-semibold">OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
