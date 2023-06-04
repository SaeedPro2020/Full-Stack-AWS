import React, {FC, useEffect, useState} from 'react'
import {MixedWidget11} from '../../../../demoresource/partials/widgets'
import {Dropdown1} from '../../../../demoresource/partials/content/dropdown/Dropdown1'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {studentDataModel} from '../redux/models/StudentModel'
import {KTSVG} from '../../../../demoresource/helpers/components/KTSVG'
import {GetStudents} from '../redux/actions/StudentsDataAction'
import {Dispatch} from 'redux'
import {StudentDispatchTypes} from '../redux/actions/asyncActions'

const report: FC = () => {
  const [dateParm, setDateParm] = useState('')
  const [subjectParm, setSubjectParm] = useState('')
  const [startIndex, setStartIndex] = useState(0)
  const dispatch = useDispatch()

  const [firstCallResult, setFirstCallResult] = useState<studentDataModel[]>([])

  const JsonData = useSelector((state: RootState) => state.studentsReducer)

  // console.log("RESULT FILTERED ITEMS 1: ", firstCallResult)
  // console.log("RESULT FILTERED ITEMS 2: ", secondCallResult)

  const numberOfItems = firstCallResult?.length

  const handleClickNext = () => {
    if (startIndex < numberOfItems - 32) {
      setStartIndex((prevIndex) => prevIndex + 32)
    } else {
      //Mean if we didn't react the last batch of items (last page)
      if (JsonData.LastEvaluatedKey !== null) {
        //Reset index for button and then get next batch of items
        setStartIndex(0)
        //Perform an action(Redux) to get next series of items
        console.log('LAST EVALUATED KEY IN FEEDS: ', JsonData.LastEvaluatedKey)
        dispatch(
          GetStudents(
            dateParm,
            subjectParm,
            JsonData.LastEvaluatedKey
          ) as Dispatch<StudentDispatchTypes>
        )
      }
    }
  }

  const handleClickPrevious = () => {
    if (startIndex > 32) {
      setStartIndex((prevIndex) => prevIndex - 32)
    }
  }

  useEffect(() => {
    setFirstCallResult(JsonData.firstCallData)
  }, [JsonData])

  const renderMixedWidgets = () => {
    const slicedData = firstCallResult.slice(startIndex, startIndex + 32)

    return slicedData
      .reduce<Array<Array<studentDataModel>>>((result, data, index) => {
        const widgetIndex = Math.floor(index / 16)
        if (!result[widgetIndex]) {
          result[widgetIndex] = []
        }
        result[widgetIndex].push(data)
        return result
      }, [])
      .map((widgetData, index) => (
        <MixedWidget11
          key={index}
          className='card-xl-stretch mb-xl-8'
          chartColor='info'
          chartHeight='200px'
          data={widgetData}
          dateOfReport={dateParm}
          subjectOfReport={subjectParm}
        />
      ))
  }

  return (
    <>
      <div className='row g-5 g-xl-8 mb-5 d-flex flex-row-reverse'>
        <button
          type='button'
          className='btn btn-primary'
          style={{width: '100px', height: '40px'}}
          data-kt-menu-trigger='click'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='top-end'
        >
          Filter
        </button>
        <Dropdown1 onDateParm={setDateParm} onSubjectSelected={setSubjectParm} />

        {firstCallResult?.length === 0 && (
          <p className='text-gray-600 fw-bold pt-3 mb-0'>
            Please click the Filter button and select the date and subject you want to see for the
            report.
          </p>
        )}
      </div>

      {JsonData.loading === true ? (
        <h3
          className='indicator-progress d-flex flex-wrap justify-content-center pb-lg-0'
          style={{display: 'block'}}
        >
          ...Loading
        </h3>
      ) : (
        <div>
          {/* begin::Row */}
          <div className='row g-5 g-xl-8 mb-5 d-flex flex-row-reverse'>
            {firstCallResult?.length !== 0 && (
              <>
                <button
                  type='button'
                  className='btn'
                  style={{width: '100px', height: '40px'}}
                  data-kt-menu-placement='bottom-end'
                  data-kt-menu-flip='top-end'
                  onClick={handleClickNext}
                >
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr024.svg'
                    className='svg-icon-1 svg-icon-primary'
                  />
                </button>
                <button
                  type='button'
                  className='btn'
                  style={{width: '100px', height: '40px'}}
                  data-kt-menu-placement='bottom-end'
                  data-kt-menu-flip='top-end'
                  onClick={handleClickPrevious}
                >
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr021.svg'
                    className='svg-icon-1 svg-icon-primary'
                  />
                </button>
              </>
            )}
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row g-5 g-xl-8'>{renderMixedWidgets()}</div>
          {/* end::Row */}
        </div>
      )}
    </>
  )
}

export {report}
