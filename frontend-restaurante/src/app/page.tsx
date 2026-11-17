import type { Metadata } from "next";
import { HomeView } from "@/features/menu/components/HomeView";


export const metadata: Metadata = {
  title: "Restaurante — Inicio",
  description: "Bienvenido a nuestro restaurante. Consulta el menú y haz tu pedido.",
};

export default function Home() {
  return <HomeView />;
}
