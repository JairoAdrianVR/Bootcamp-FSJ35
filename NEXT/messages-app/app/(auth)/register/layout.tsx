
interface iLayoutProps {
children: React.ReactNode
}

export default function layout({
    children
}: iLayoutProps ) {
  return (
    <div  className="flex justify-center items-center mt-4">
        {children}
    </div>
  )
}
