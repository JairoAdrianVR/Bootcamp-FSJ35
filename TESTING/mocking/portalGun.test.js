import { describe, expect, it, vi } from "vitest";
import { abrirPortal } from "./portalGun";

describe('Testeando el abrirPortal', () => {
    //Diferentes test(casos) a evaluar

    it('disparar portal hacia otra dimension con energia',() => {
        //1er paso -> Preparar
        const dimension = 'E-145';
        const energia = 25;
        const disparador = vi.fn().mockReturnValue(true);

        //2do paso -> Actuar
        const resultado = abrirPortal(dimension,energia,disparador);

        //3er paso -> Afirmar
        expect(resultado).toBe(`Portal abierto a la dimension: ${dimension}`)

    })
 
} )


