//rfc -> GENERA UN COMPONENTE CON EL NOMBRE DEL ARCHIVO Y EL EXPORT DEFAULT

//PROPS -> Es infomormacion que viaja de un componente PADRE a un componente HIJO
//NEXT -> Nosotros cuando creamos propiedades vamos a crear un MODELO de sus propiedades
interface DespedidaProps {
    nombre: string;
    apellido:string;

}


export default function Despedida({nombre,apellido }: DespedidaProps) {
  return (
    <div>
        <h3>Chauchis {nombre} {apellido}</h3>
    </div>
  )
}
