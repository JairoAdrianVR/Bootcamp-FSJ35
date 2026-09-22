
interface InputProps{ 
    type: string;
    placeholder: string;
}

export default function Input({type, placeholder}: InputProps) {
  return (
    <div>
          <input type={type}
                    placeholder={placeholder}
                    className="w-full max-w-md rounded-lg border border-neutral-800 p-2"
                />
    </div>
  )
}
