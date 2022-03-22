interface Props {
  title: string
  variable: string
}

export default function StatisticsCard({ title, variable }: Props) {
  return (
    <div className='shadow bg-white px-4 py-3 rounded-2xl'>
      <h1 className='font-semibold text-base'>{title}</h1>
      <p className='font-bold text-2xl'>{variable}</p>
    </div>
  )
}
