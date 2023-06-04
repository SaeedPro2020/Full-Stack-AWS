/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Pages</span>
        </div>
      </div>


          <AsideMenuItem to='/crafted/pages/profile/overview' title='Profile' hasBullet={true} />


      <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Projects'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        {/* <AsideMenuItem to='/crafted/widgets/mixed' title='Web' hasBullet={true} /> */}
        <AsideMenuItem to='/crafted/widgets/feeds' title='report' hasBullet={true} />
        {/* <AsideMenuItem to='/crafted/widgets/tables' title='Android' hasBullet={true} /> */}
      </AsideMenuItemWithSub>

    </>
  )
}
