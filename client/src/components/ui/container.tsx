export default function Container({children}: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="w-full max-w-7xl mx-auto">
            {children}
        </div>
    )
}