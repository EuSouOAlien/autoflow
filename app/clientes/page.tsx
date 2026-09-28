"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Cliente = {
  id: number;
  nome: string;
  whatsapp: string;
  cpf: string | null;
  email: string | null;
  created_at: string;
};

export default function Clientes() {
  const supabase = createClient();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

const [nome, setNome] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [cpf, setCpf] = useState("");
const [email, setEmail] = useState("");

const [salvando, setSalvando] = useState(false);

  async function carregarClientes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar clientes:", error);
      setCarregando(false);
      return;
    }

    setClientes(data || []);
    setCarregando(false);
  }
async function salvarCliente() {
  if (!nome.trim() || !whatsapp.trim()) {
    alert("Preencha pelo menos o nome e o WhatsApp.");
    return;
  }

  setSalvando(true);

  const novoCliente = {
    nome: nome.trim(),
    whatsapp: whatsapp.trim(),
    cpf: cpf.trim() || null,
    email: email.trim() || null,
  };

  console.log("SALVANDO NOVO CLIENTE:", novoCliente);

  const { data, error } = await supabase
    .from("clientes")
    .insert(novoCliente)
    .select()
    .single();

  console.log("RESPOSTA DO SUPABASE:", {
    data,
    error,
  });

  if (error) {
    console.error("ERRO AO SALVAR CLIENTE:", error);

    alert(`Erro ao salvar cliente:\n\n${error.message}`);

    setSalvando(false);
    return;
  }

  console.log("CLIENTE SALVO:", data);

  setNome("");
  setWhatsapp("");
  setCpf("");
  setEmail("");

  setMostrarFormulario(false);

  setSalvando(false);

  await carregarClientes();
}
  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Clientes
            </h1>

            <p className="text-gray-500 mt-1">
              Gerencie os clientes da sua loja
            </p>
          </div>

          <button
  onClick={() => setMostrarFormulario(true)}
  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
>
  + Novo cliente
</button>

        </div>
        {mostrarFormulario && (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-slate-800 mb-6">
      Novo cliente
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nome completo *
        </label>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do cliente"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          WhatsApp *
        </label>

        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="44999999999"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          CPF
        </label>

        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          E-mail
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

    </div>

    <div className="flex justify-end gap-3 mt-6">

      <button
        type="button"
        onClick={() => setMostrarFormulario(false)}
        className="px-5 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        Cancelar
      </button>

      <button
  type="button"
  onClick={salvarCliente}
  disabled={salvando}
  className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
>
  {salvando ? "Salvando..." : "Salvar cliente"}
</button>

    </div>
  </div>
)}

        <div className="bg-white rounded-xl shadow-sm p-6">

          {carregando ? (

            <p className="text-gray-500">
              Carregando clientes...
            </p>

          ) : clientes.length === 0 ? (

            <p className="text-gray-500">
              Nenhum cliente cadastrado.
            </p>

          ) : (

            <div className="space-y-3">

              {clientes.map((cliente) => (

                <div
                  key={cliente.id}
                  className="border border-gray-200 rounded-lg p-4"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="font-semibold text-lg text-slate-800">
                        {cliente.nome}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        📱 {cliente.whatsapp}
                      </p>

                      {cliente.email && (
                        <p className="text-gray-500">
                          ✉️ {cliente.email}
                        </p>
                      )}

                    </div>

                    <div className="text-sm text-gray-400">
                      ID #{cliente.id}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}