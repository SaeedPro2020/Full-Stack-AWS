import React from 'react'
import {
  FeedsWidget2,
} from '../../../../demoresource/partials/widgets'

const description = `I am a full-stack developer with over 3 years of experience in developing responsive and user-friendly Web applications. Moreover, I have some useful skills to design Android applications with Kotlin programming language.
I have a strong background in both front-end and back-end for Web development, with extensive experience in a variety of programming languages, frameworks, and databases. I am also comfortable working with HTML, CSS, JavaScript, TypeScript and React, as well as AWS.`


export function Overview() {
  return (
    <div className='row gy-5 g-xl-8'>
      <FeedsWidget2 className={'mb-5 mb-xxl-8'} description={description} title='About me' note={false} imgUrl='/media/avatars/blank.png' />
    </div>
  )
}
