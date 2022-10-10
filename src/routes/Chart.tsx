import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts'
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';

interface ChartProps {
  coinId: string
}

interface IHistorycalData {
  time_open: number
  time_close: number
  open:string
  high:string
  low: string
  close: string
  volume: string
  market_cap: number
}


function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorycalData[]>(['ohlcv', coinId], () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000
    }
  )

  const isDark = useRecoilValue(isDarkAtom)
  return <div>{isLoading ? 'Loading chart...' :
    <ApexChart
      type='line'
      series={[
        {
          name: 'Price',
          data: data?.map(price => Number(price.close)) ?? []
        }
      ]}
      options={{
        theme: {
          mode: isDark ? 'dark' : 'light'
        },
        fill: {
          type: 'gradient',
          gradient: { gradientToColors: ['blue'], stops: [0, 100] },
        },
        colors: ['red'],
        chart: {
          background: "transparent",
          height: 500,
          width: 500,
          toolbar: {
            show: false
          }
        },
        grid: {
          show: false
        },
        stroke: {
          curve: 'smooth',
          width: 5
        },
        yaxis: { show: false },
        xaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          type: 'datetime',
          categories: data?.map(price => new Date(price.time_close * 1000).toISOString()) ?? []
        },
        tooltip: {
          y: {
            formatter: (value) => `$ ${value.toFixed(3)}`
          }
        }
    }} />}</div>
}

export default Chart;