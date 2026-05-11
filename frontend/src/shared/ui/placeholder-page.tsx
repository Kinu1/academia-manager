type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">O CRUD entra na próxima fatia de implementação.</p>
    </div>
  )
}
