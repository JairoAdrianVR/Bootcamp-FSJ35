import Link from "next/link";

interface NavigationProps{
    totalPages: number; 
    currentPage: number;
}

export default function Navigation({currentPage,totalPages} : NavigationProps) {
    const pages: number[] = [];

    for(let i = 1; i <= totalPages; i++){
        pages.push(i);
    }

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
        <br/>
        {pages.map((numero) =>{
            return <Link key={numero} 
            href={`/?page=${numero}`}
            className={`p-2 font-bold rounded ${
                currentPage === numero ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray'
            }`}
            >{numero}</Link>
        } )}
    </div>
  )
}
