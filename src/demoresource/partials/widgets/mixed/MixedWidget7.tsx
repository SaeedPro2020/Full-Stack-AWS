/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../assets/ts/_utils'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  dateOf: string
}

const MixedWidget7: React.FC<Props> = ({className, chartColor, chartHeight, dateOf}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef])

  return (
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Class progress</span>
          {/* <span className='text-muted fw-bold fs-7'>Average of progress for class members in one day</span> */}
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body d-flex flex-column'>
        <div className='flex-grow-1'>
          <div ref={chartRef} className='mixed-widget-4-chart'></div>
        </div>

        <div className='pt-5'>
          <p className='text-center fs-6 pb-5 '>
            <span className='badge badge-light-danger fs-8'>Notes:</span>&nbsp; This is an
            average of progress for
            <br />
            class members in {dateOf}
          </p>

        </div>
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string): ApexOptions => {
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)
  const labelColor = getCSSVariableValue('--bs-gray-700')

  return {
    series: [74],
    chart: {
      fontFamily: 'inherit',
      height: chartHeight,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
        },
        dataLabels: {
          name: {
            show: false,
            fontWeight: '700',
          },
          value: {
            color: labelColor,
            fontSize: '30px',
            fontWeight: '700',
            offsetY: 12,
            show: true,
            formatter: function (val) {
              return val + '%'
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: '100%',
        },
      },
    },
    colors: [baseColor],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  }
}

export {MixedWidget7}
