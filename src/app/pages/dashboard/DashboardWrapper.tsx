/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../demoresource/layout/core'
import {
  FeedsWidget2,
} from '../../../demoresource/partials/widgets'

const description = `In this project, Amazon Web Services (AWS) is used to build and deploy the backend components. Amazon Amplify is used to create the infrastructure for the project, which includes a Rest API to handle server-side logic, Cognito for user authentication and authorization, and DaynamoDB for database management.
The front-end of the project is built using a combination of Sass, Bootstrap, JSX, React, and TypeScript. Sass and Bootstrap are used to create a consistent, responsive design for the website, while JSX is used to structure the content. React and TypeScript are used to create the dynamic components of the website, allowing users to interact with the data and perform actions.Redux is a state management tool that is used to manage the application's state and data flow.
Overall, this full-stack web project utilizes a wide range of technologies to create a fast, scalable, and user-friendly web application. With the power of AWS behind it, the project is capable of handling large amounts of traffic and data, while still delivering a smooth and seamless user experience.`

const DashboardPage: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
    <FeedsWidget2 className={'mb-5 mb-xxl-8'} description={description} title='Full Stack' note={true} imgUrl='/media/avatars/aws2.jpg' />
    </div>
  </>
)

export function DashboardWrapper() {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}
