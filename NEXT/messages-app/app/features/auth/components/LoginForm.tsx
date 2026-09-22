import Input from "../../components/Input";


export default function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-lg border border-neutral-800 p-6">
        <form >
            {/* Input correo */}
            <section>
                <label className="text-md font-bold text-white">Correo Electronico</label>
               <input type="email"
                    placeholder="correo@hosting.com"
                    className="w-full max-w-md rounded-lg border border-neutral-800 p-2"
                />
            </section>

              {/* Input password */}
            <section>
                <label className="text-md font-bold text-white">Contraseña</label>
               <input type="password"
                    placeholder="Password"
                    className="w-full max-w-md rounded-lg border border-neutral-800 p-2"
                />
            </section>

            {/* Boton submit */}
            <section>
                <button 
                    type="submit"
                    className="w-full max-w-md rounded-lg bg-indigo-600 border border-neutral-800 p-2 mt-2"
                >Acceder</button>
            </section>
        </form>

    </div>
  )
}
