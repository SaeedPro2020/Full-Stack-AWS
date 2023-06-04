import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img src={toAbsoluteUrl('/media/logos/react2.svg')} alt='Start logo' />
      <span>Loading ...</span>
    </div>
  )
}
