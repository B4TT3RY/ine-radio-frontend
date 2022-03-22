interface Props {
  title: string
  variable: string
}

export default function StoryInfoCard({ title, variable }: Props) {
  return (
    <div className='shadow bg-white px-4 py-3 rounded-2xl'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <p>{variable}</p>
    </div>
  )
}
