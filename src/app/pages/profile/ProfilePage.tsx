import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../demoresource/layout/core'
import {Overview} from './components/Overview'
import {ProfileHeader} from './ProfileHeader'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilePage: React.FC = () => {
  return (
    <>
      <ProfileHeader />
      <Switch>
        <Route path='/crafted/pages/profile/overview'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Overview</PageTitle>
          <Overview />
        </Route>
        <Redirect from='/crafted/pages/profile' exact={true} to='/crafted/pages/profile/overview' />
        <Redirect to='/crafted/pages/profile/overview' />
      </Switch>
    </>
  )
}

export default ProfilePage
