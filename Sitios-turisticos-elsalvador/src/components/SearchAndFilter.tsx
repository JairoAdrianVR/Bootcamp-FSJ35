'use client';

import React, { useState, useMemo } from 'react';
import { LugarTuristico } from '@/types/place';
import PlaceCard from './PlaceCard';
import { SearchIcon, FilterIcon } from './Icons';

interface SearchAndFilterProps {
  lugares: LugarTuristico[];
}

export default function SearchAndFilter({ lugares }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [selectedDepartamento, setSelectedDepartamento] = useState('todos');

  // Extraer categorías únicas
  const categorias = useMemo(() => {
    const cats = new Set(lugares.map((l) => l.categoria));
    return ['todas', ...Array.from(cats)];
  }, [lugares]);

  // Extraer departamentos únicos
  const departamentos = useMemo(() => {
    const depts = new Set(lugares.map((l) => l.departamento));
    return ['todos', ...Array.from(depts)];
  }, [lugares]);

  // Filtrado reactivo en cliente
  const filteredLugares = useMemo(() => {
    return lugares.filter((lugar) => {
      const matchesSearch =
        lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lugar.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lugar.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lugar.actividades.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategoria =
        selectedCategoria === 'todas' || lugar.categoria === selectedCategoria;

      const matchesDepartamento =
        selectedDepartamento === 'todos' || lugar.departamento === selectedDepartamento;

      return matchesSearch && matchesCategoria && matchesDepartamento;
    });
  }, [lugares, searchTerm, selectedCategoria, selectedDepartamento]);

  return (
    <div className="space-y-6">
      {/* Controles de Búsqueda y Filtros */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Input de Búsqueda */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por volcán, playa, pueblo, actividad..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Filtro por Categoría */}
          <div className="md:col-span-3">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            >
              <option value="todas">Todas las categorías</option>
              {categorias
                .filter((c) => c !== 'todas')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Filtro por Departamento */}
          <div className="md:col-span-3">
            <select
              value={selectedDepartamento}
              onChange={(e) => setSelectedDepartamento(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            >
              <option value="todos">Todos los departamentos</option>
              {departamentos
                .filter((d) => d !== 'todos')
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Resumen de resultados activos */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredLugares.length}</strong> de {lugares.length} destinos encontrados
          </span>
          {(searchTerm || selectedCategoria !== 'todas' || selectedDepartamento !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoria('todas');
                setSelectedDepartamento('todos');
              }}
              className="text-sky-600 hover:text-sky-700 font-medium"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de Destinos Filtrados */}
      {filteredLugares.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLugares.map((lugar) => (
            <PlaceCard key={lugar.slug} lugar={lugar} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <FilterIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No se encontraron destinos
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Intenta cambiar los términos de búsqueda o restablecer los filtros para ver todos los lugares turísticos de El Salvador.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoria('todas');
              setSelectedDepartamento('todos');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition"
          >
            Ver todos los destinos
          </button>
        </div>
      )}
    </div>
  );
}
