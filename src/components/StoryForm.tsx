import { ChangeEvent, FormEvent, useState } from 'react'
import Badge from './Badge'

interface Props {
  storyId: string
  characterCount: number
  onlyFollowers: boolean
  onlySubscribers: boolean
}

export default function StoryForm({ storyId, characterCount, onlyFollowers, onlySubscribers }: Props) {
  const [story, setStory] = useState('')
  const [submitButton, setSubmitButton] = useState<HTMLInputElement | null>(null)

  const textAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setStory(event.target.value)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    const canSend = confirm('사연을 보내면 수정하거나 삭제할 수 없어요.\n사연을 보내시겠어요?')
    if (!canSend) {
      event.preventDefault()
      return false
    }
    return true
  }

  return (
    <>
      <form action='/?index' method='post' onSubmit={submit} className='w-full '>
        <fieldset
          disabled={false}
          className='w-full gap-2 flex flex-wrap items-center justify-between'
        >
          <input type='hidden' name='storyId' value={storyId} />
          <textarea
            name='content'
            placeholder='사연을 작성해주세요'
            rows={3}
            autoFocus={true}
            onChange={textAreaChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submitButton?.click()
              }
            }}
            className='resize-none w-full text-base p-3 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-2xl dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400'
          />
          <div className='flex items-center gap-2'>
            <Badge type='anonymous' />
            {onlyFollowers && <Badge type='onlyFollowers' />}
            {onlySubscribers && <Badge type='onlySubscribers' />}
          </div>
          <div className='flex items-center gap-2'>
            <span className={`${story.length > characterCount ? 'text-rose-600' : 'text-black dark:text-white'}`}>
              {story.length}/{characterCount}자
            </span>
            <input
              type='submit'
              ref={(button) => setSubmitButton(button)}
              // value={transition.state === 'submitting' ? '사연 보내는 중...' : '사연 보내기'}
              value={'사연 보내기'}
              disabled={story.length === 0 || story.length > characterCount}
              className='text-lg text-white rounded-2xl b-0 p-3 transition-all shadow-lg bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-gray-200/50 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 dark:disabled:shadow-gray-700/50'
            />
          </div>
        </fieldset>
      </form>
    </>
  )
}
