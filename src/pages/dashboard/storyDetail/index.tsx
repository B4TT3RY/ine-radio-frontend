import Head from 'next/head'
import Error from 'next/error'
import { Role } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import useAuth from '../../../hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import { classNames } from '../../../utils'

interface FormValues {
  storyId: string
}

export default function DashboardDetailViewIndex() {
  const [auth, authError] = useAuth()

  const initialValues: FormValues = {
    storyId: '',
  }

  if (auth && auth?.role != Role.ADMIN) {
    return <Error statusCode={401} />
  }

  return (
    <>
      <Head>
        <title>부검 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard/storyDetail' title='부검'>
        <div className='flex flex-col gap-3'>
          <Formik initialValues={initialValues} onSubmit={(values, actions) => {
            actions.setSubmitting(true)
            window.open(`/dashboard/storyDetail/view?id=${values.storyId}`, '', 'status=0,title=0,height=777,width=500,scrollbars=1')
            actions.setSubmitting(false)
          }}>
            {({ isSubmitting, values }) => (
              <Form>
                <fieldset disabled={isSubmitting}>
                  <div className='flex flex-col'>
                    <label htmlFor='storyId' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                      사연 아이디
                    </label>
                    <div className='flex gap-3'>
                      <Field
                        type='text'
                        id='storyId'
                        name='storyId'
                        className={classNames(
                          'w-full text-base px-3 py-2 transition-all shadow-sm rounded-2xl',
                          'focus:ring-purple-500 focus:border-purple-500 border border-gray-300',
                          'disabled:text-gray-400 disabled:bg-gray-300 disabled:border-gray-400 disabled:focus:ring-purple-500 disabled:focus:border-purple-500'
                        )}
                        required
                      />
                      <button
                        type='submit'
                        className={classNames(
                          'text-xl select-none text-white transition-all shadow-lg rounded-2xl b-0 px-3 py-2 whitespace-nowrap',
                          'bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50',
                          'disabled:bg-gray-400 disabled:shadow-gray-400/50 disabled:hover:bg-gray-400 disabled:hover:shadow-gray-400/50'
                        )}
                        disabled={values.storyId.length <= 0}
                      >
                        {isSubmitting ? `부검하는 중...` : '부검'}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </Form>
            )}
          </Formik>
        </div>
      </DashboardFrame>
    </>
  )
}
