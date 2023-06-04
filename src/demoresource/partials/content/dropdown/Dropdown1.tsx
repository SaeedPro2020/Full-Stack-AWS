/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {GetStudents} from '../../../../app/pages/report/redux/actions/StudentsDataAction'
import {Dispatch} from 'redux'
import {useDispatch} from 'react-redux'
import {StudentDispatchTypes} from '../../../../app/pages/report/redux/actions/asyncActions'

interface Props {
  onDateParm: (confirm: string) => void
  onSubjectSelected: (confirm: string) => void
}

export const Dropdown1: React.FC<Props> = ({onDateParm, onSubjectSelected}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedOption, setSelectedOption] = useState('1')

  const startDate = new Date('2015-03-31')

  const dispatch = useDispatch()

  const handleDateChange = (date: Date | null, event: React.FocusEvent<HTMLInputElement>) => {
    setSelectedDate(date)
    event.stopPropagation()
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.options[event.target.selectedIndex].text
    setSelectedOption(selectedValue)
  }

  const formatDate = (date: Date | null) => {
    if (date) {
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      const formattedDate = adjustedDate.toISOString().split('T')[0]
      return formattedDate
    }
    return ''
  }

  const handleClick = () => {
    const dateSelected = formatDate(selectedDate)
    onDateParm(dateSelected)
    onSubjectSelected(selectedOption)
    dispatch(GetStudents(dateSelected, selectedOption, undefined) as Dispatch<StudentDispatchTypes>)
  }

  const handleMenuHide = (event: React.FocusEvent<HTMLInputElement>) => {
    event.stopPropagation()
  }

  const handleReset = () => {
    setSelectedDate(null)
  }

  return (
    <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
      <div className='px-7 py-5'>
        <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
      </div>

      <div className='separator border-gray-200'></div>

      <div className='px-7 py-5'>
        <div className='mb-10'>
          <label className='form-label fw-bold'>Date:</label>
          <div>
            <div
              className='form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'1'}
              onFocus={handleMenuHide}
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat='yyyy-MM-dd'
                maxDate={startDate}
              />
            </div>
          </div>
        </div>

        <div className='mb-10'>
          <label className='form-label fw-bold'>Subjects:</label>
          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={selectedOption}
              onChange={handleOptionChange}
            >
              <option value='1'></option>
              <option value='2'>Begrijpend Lezen</option>
              <option value='3'>Rekenen</option>
              <option value='4'>Begrijpend Lezen</option>
              <option value='5'>Spelling</option>
            </select>
          </div>
        </div>

        <div className='d-flex justify-content-end'>
          <button
            type='reset'
            className='btn btn-sm btn-white btn-active-light-primary me-2'
            data-kt-menu-dismiss='true'
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type='submit'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
            onClick={handleClick}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
