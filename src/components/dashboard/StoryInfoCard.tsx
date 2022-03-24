interface Props {
  title: string
  variable?: string
}

export default function StoryInfoCard({ title, variable }: Props) {
  return (
    <div className='shadow bg-white px-4 py-3 rounded-2xl'>
      <h1 className='text-xl font-bold'>{title}</h1>
      {variable ? <p>{variable}</p> : <div className='animate-pulse h-2 w-1/3 rounded bg-slate-500'></div>}
    </div>
  )
}
