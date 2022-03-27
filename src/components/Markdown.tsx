import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface Props {
  className?: string
  children?: string
}

export default function Markdown({ className, children }: Props) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      className={`dark:text-white${className ? ` ${className}` : ''}`}
      components={{
        a({ node, ...props }) {
          return (
            <a
              {...props}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-sky-400 after:content-["_↗"] after:text-sm after:font-bold'
            />
          )
        },
        ol({ node, ...props }) {
          return <ol className='text-center list-decimal list-inside' {...props} />
        },
        ul({ node, ordered, ...props }) {
          return <ul className='text-center list-disc list-inside' {...props} />
        },
      }}
    >
      {children ?? ''}
    </ReactMarkdown>
  )
}
