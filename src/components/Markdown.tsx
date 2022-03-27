import ReactMarkdown from 'react-markdown'

interface Props {
  className?: string
  children?: string
}

export default function Markdown({ className, children }: Props) {
  return (
    <ReactMarkdown
      className={className}
      components={{
        a({ ...props }) {
          return (
            <a
              {...props}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-sky-400 after:content-["_↗"] after:text-sm after:font-bold'
            />
          )
        },
      }}
    >
      {children ?? ''}
    </ReactMarkdown>
  )
}
