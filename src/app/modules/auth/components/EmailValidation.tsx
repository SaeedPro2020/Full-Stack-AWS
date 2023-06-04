import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {confirmSignUp} from '../redux/AuthCRUD'
import {useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

export function EmailValidation(): JSX.Element {
  const [confirmationCode, setConfirmationCode] = useState('')

  const userNameCognito = useSelector<RootState>(({auth}) => auth.userNameCognito)

  const redirectToDashboard = async () => {
    try {
      confirmSignUp(userNameCognito as string, confirmationCode)
    } catch (error) {
      console.log('error sign in', error)
      // props.onError('Possibily you already registered with this email address, use new email address')
    }
    window.location.reload()
  }

  useEffect(() => {
    localStorage.setItem('userType', 'Customer')
  }, [])

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-12'>
        <div className='text-gray-400 fw-bold fs-6'>
          Check your email inbox to insert the code here.
        </div>
      </div>

      <div className='d-flex fv-row mb-10 col-lg-15'>
        <div className='fv-row col-lg-5'>
          <label className='form-label required'>Code</label>

          <input
            name='businessName'
            className='form-control form-control-lg form-control-solid'
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder='Insert your code'
            value={confirmationCode}
          />
          <div className='text-danger mt-2'></div>
        </div>
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_code_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          onClick={redirectToDashboard}
        >
          Confirm
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_code_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  )
}
