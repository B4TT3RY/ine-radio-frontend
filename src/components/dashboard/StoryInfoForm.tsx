import { Field, Form, Formik, FormikHelpers } from 'formik'
import Button from '../button/Button'
import Markdown from '../Markdown'

interface Props {
  initialValues: FormValues
  isEditPage: boolean
  onSubmit: (values: FormValues, actions: FormikHelpers<FormValues>) => void | Promise<void>
  onDelete?: () => void | Promise<void>
}

export interface FormValues {
  title: string
  subTitle: string
  charCount: number
  activation: boolean
  followDiff: number
  followDiffUnit: string
  isOnlyFollowers: boolean
  isOnlySubscribers: boolean
  maxSubmitCount: number
}

export default function StoryInfoForm({ initialValues, isEditPage, onSubmit, onDelete }: Props) {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, values }) => (
        <Form>
          <fieldset disabled={isSubmitting} className='flex flex-col gap-3'>
            <div className='flex flex-col'>
              <label htmlFor='title' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                제목
              </label>
              <Field
                id='title'
                name='title'
                className='text-base px-3 py-2 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-2xl'
                required
              />
            </div>
            <div className='flex gap-3'>
              <div className='flex flex-col flex-1'>
                <label htmlFor='title' className='text-lg select-none'>
                  부제목
                </label>
                <Field
                  as='textarea'
                  name='subTitle'
                  rows={6}
                  className='resize-none w-full text-base px-4 py-3 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-2xl'
                />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor='subTitlePreview' className='text-lg select-none'>
                  미리보기
                </label>
                <div
                  id='subTitlePreview'
                  className='h-full w-full text-base text-center px-4 py-3 shadow-sm bg-white dark:bg-slate-700 border border-gray-300 rounded-2xl overflow-hidden'
                >
                  <Markdown>{values.subTitle}</Markdown>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='charCount' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                글자 수 제한
              </label>
              <Field
                type='number'
                id='charCount'
                name='charCount'
                className='text-base px-3 py-2 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='maxSubmitCount' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                제출할 수 있는 사연 갯수
              </label>
              <Field
                type='number'
                id='maxSubmitCount'
                name='maxSubmitCount'
                className='text-base px-3 py-2 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
                required
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='flex flex-col w-full select-none'>
                <div className='flex items-center gap-2'>
                  <Field
                    type='checkbox'
                    id='isOnlyFollowers'
                    name='isOnlyFollowers'
                    className='w-5 h-5 text-violet-600 focus:ring-violet-600 focus:ring-opacity-25 border border-gray-300 rounded'
                  />
                  <label htmlFor='isOnlyFollowers' className='text-lg'>
                    팔로워 전용
                  </label>
                </div>
                {values.isOnlyFollowers && (
                  <div className='mt-1.5'>
                    <span>팔로우한지 </span>
                    <Field
                      type='number'
                      name='followDiff'
                      className='text-base px-3 py-2 w-20 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
                      min={0}
                      defaultValue={0}
                      // max={getMaxTimeWithUnit(values.followDiffUnit)}
                    />
                    <Field
                      as='select'
                      name='followDiffUnit'
                      className='text-base ml-1 px-3 py-2 w-20 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
                    >
                      <option value='minutes'>분</option>
                      <option value='hours'>시간</option>
                      <option value='days'>일</option>
                      <option value='months'>개월</option>
                      <option value='years'>년</option>
                    </Field>
                    <span className='ml-1'>이 지난 사람만 허용</span>
                  </div>
                )}
              </div>
              <div className='flex flex-col w-full'>
                <div className='flex items-center gap-2'>
                  <Field
                    type='checkbox'
                    id='isOnlySubscribers'
                    name='isOnlySubscribers'
                    className='w-5 h-5 text-violet-600 focus:ring-violet-600 focus:ring-opacity-25 border border-gray-300 rounded'
                  />
                  <label htmlFor='isOnlySubscribers' className='text-lg select-none'>
                    구독자 전용
                  </label>
                </div>
              </div>
            </div>
            <div className='flex gap-3 sm:justify-end'>
              <Button
                color='red-500'
                hoverColor='red-600'
                extraClassName='text-xl'
                onClick={onDelete}
              >
                사연 삭제
              </Button>
              <button
                type='submit'
                className='text-xl select-none text-white transition-all shadow-lg bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50 rounded-2xl b-0 px-3 py-2'
              >
                {isSubmitting ? `${isEditPage ? '수정' : '생성'}하는 중...` : isEditPage ? '수정' : '생성'}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  )
}
