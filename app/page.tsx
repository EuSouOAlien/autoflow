"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const supabase = createClient();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  const [clientes, setClientes] = useState<
    {
      id: number;
      nome: string;
      whatsapp: string;
      cpf: string | null;
      email: string | null;
      created_at: string;
    }[]
  >([]);

  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  async function carregarClientes() {
    console.log("=== BUSCANDO CLIENTES NO SUPABASE ===");

    setCarregando(true);

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("RESULTADO DA BUSCA:", {
      data,
      error,
    });

    if (error) {
      console.error("ERRO AO BUSCAR CLIENTES:", error);
      setCarregando(false);
      return;
    }

    console.log("CLIENTES ENCONTRADOS:", data);

    setClientes(data || []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);


  async function salvarCliente() {
  if (!nome.trim() || !whatsapp.trim()) {
    alert("Preencha pelo menos o nome e o WhatsApp.");
    return;
  }

  setSalvando(true);

  console.log("=== TENTANDO SALVAR CLIENTE ===");

  const clienteParaSalvar = {
    nome: nome.trim(),
    whatsapp: whatsapp.trim(),
    cpf: cpf.trim() || null,
    email: email.trim() || null,
  };

  console.log("Dados enviados:", clienteParaSalvar);

  const { data, error } = await supabase
    .from("clientes")
    .insert(clienteParaSalvar)
    .select()
    .single();

  console.log("Resposta do Supabase:", {
    data,
    error,
  });

  if (error) {
    console.error("ERRO DO SUPABASE:", error);

    alert(
      `ERRO DO SUPABASE:\n\n${error.message}\n\nCódigo: ${error.code || "sem código"}`
    );

    setSalvando(false);
    return;
  }

  console.log("CLIENTE SALVO COM SUCESSO:", data);

  setClientes((clientesAtuais) => [data, ...clientesAtuais]);

  setNome("");
  setWhatsapp("");
  setCpf("");
  setEmail("");

  setMostrarFormulario(false);
  setSalvando(false);
}
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        {/* MENU LATERAL */}
        <aside className="w-64 bg-slate-900 text-white p-6">

          <h1 className="text-2xl font-bold mb-10">
            Auto<span className="text-blue-400">Flow</span>
          </h1>

          <nav className="space-y-3">

            <div className="bg-blue-600 rounded-lg px-4 py-3">
              📊 Dashboard
            </div>

            <div className="px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer">
              👤 Clientes
            </div>

            <div className="px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer">
              🚗 Veículos
            </div>

            <div className="px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer">
              📋 Orçamentos
            </div>

            <div className="px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer">
              📦 Produtos
            </div>

            <div className="px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer">
              💬 WhatsApp
            </div>

          </nav>

        </aside>

        {/* CONTEÚDO */}
        <section className="flex-1 p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h2>

            <p className="text-gray-500 mt-1">
              Visão geral da sua loja
            </p>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500">
                Vendas hoje
              </p>

              <h3 className="text-2xl font-bold mt-2">
                R$ 0,00
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500">
                Orçamentos
              </p>

              <h3 className="text-2xl font-bold mt-2">
                0
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500">
                Clientes
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {clientes.length}
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500">
                Conversão
              </p>

              <h3 className="text-2xl font-bold mt-2">
                0%
              </h3>
            </div>

          </div>

          {/* ÁREA PRINCIPAL */}
          <div className="grid grid-cols-2 gap-6">

            {/* ÚLTIMOS ORÇAMENTOS */}
            <div className="bg-white rounded-xl p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Últimos orçamentos
              </h3>

              <p className="text-gray-500">
                Nenhum orçamento cadastrado.
              </p>

            </div>

            {/* ATALHOS */}
            <div className="bg-white rounded-xl p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Atalhos rápidos
              </h3>

              <div className="flex gap-3">

                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  + Novo cliente
                </button>

                <button className="bg-slate-200 text-slate-800 px-4 py-3 rounded-lg">
                  + Novo orçamento
                </button>

              </div>

            </div>

          </div>

          {/* LISTA DE CLIENTES */}
          {clientes.length > 0 && (

            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">

              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Clientes cadastrados
              </h3>

              <div className="space-y-3">

                {clientes.map((cliente, index) => (

                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >

                    <p className="font-semibold text-slate-800">
                      {cliente.nome}
                    </p>

                    <p className="text-gray-500">
                      📱 {cliente.whatsapp}
                    </p>

                    {cliente.email && (
                      <p className="text-gray-500">
                        ✉️ {cliente.email}
                      </p>
                    )}

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Novo cliente
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nome completo *
                </label>

                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  WhatsApp *
                </label>

                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(44) 99999-9999"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  CPF
                </label>

                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  E-mail
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setMostrarFormulario(false)}
                className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={salvarCliente}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar cliente
              </button>

            </div>

          </div>

        </div>

      )}
  

  {/* Botão flutuante do Instagram */}
<a
  href="https://www.instagram.com/projeto_onixsedan?stkn=eW5iZ3JhMzhrM3N5"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-50"
  style={{
    background:
      "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
  }}
  aria-label="Instagram"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    className="w-7 h-7"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
  </svg>
</a>
 {/* Botão flutuante do WhatsApp */}
    <a
      href="https://wa.me/5544999126106"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-2xl transition-all duration-200 hover:scale-110"
      aria-label="Falar no WhatsApp"
    >
      ☎
    </a>

    </main>
  );
}