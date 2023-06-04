/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../assets/ts/_utils'
import {studentDataModel} from '../../../../app/pages/report/redux/models/StudentModel'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  data: studentDataModel[]
  dateOfReport: string
  subjectOfReport: string
}

const MixedWidget11: React.FC<Props> = ({
  className,
  chartColor,
  chartHeight,
  data,
  dateOfReport,
  subjectOfReport,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  const progressArray: number[] = data.map((item) => item.Progress)
  const userIdArray: string[] = data.map((item) => item.UserId.toString())
  const maxProgressWeekAgo: number[] = data.map((item) => item.MaxProgressWeekAgo)

  const lengthOfItems = data.length
  if (lengthOfItems < 16) {
    for (let i = 1; i <= 16 - lengthOfItems; i++) {
      progressArray.push(0)
      maxProgressWeekAgo.push(0)
      userIdArray.push('')
    }
  }

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(
      chartRef.current,
      chartOptions(chartColor, chartHeight, userIdArray, progressArray, maxProgressWeekAgo)
    )
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, data])

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0 d-flex justify-content-between flex-column overflow-hidden'>
        {/* begin::Hidden */}
        <div className='d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3'>
          <div className='me-2'>
            <span className='fw-bolder text-gray-800 d-block fs-3'>{subjectOfReport}</span>

            <span className='text-gray-400 fw-bold'>{dateOfReport}</span>
          </div>

          <div className={`fw-bolder fs-3 text-${chartColor}`}>Progress</div>
        </div>
        {/* end::Hidden */}

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-10-chart'></div>
        {/* end::Chart */}
      </div>
    </div>
  )
}

const chartOptions = (
  chartColor: string,
  chartHeight: string,
  userIdArray: string[],
  progressArray: number[],
  data3: number[]
): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-red-500')
  const borderColor = getCSSVariableValue('--bs-red-200')
  const secondaryColor = getCSSVariableValue('--bs-red-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)

  return {
    series: [
      {
        name: 'Today',
        data: progressArray,
      },
      {
        name: 'Previous week',
        data: data3,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: userIdArray,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + ' Process value'
        },
      },
      x: {
        show: true,
        format: '',
        formatter: function (val) {
          return ' UserId'
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export {MixedWidget11}
