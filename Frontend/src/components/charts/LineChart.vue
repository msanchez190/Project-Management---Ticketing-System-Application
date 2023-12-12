<template>

    <apexchart type="line"
        height="300"
        :options="chartOptions" 
        :series="series">
    </apexchart>

</template>

<script>
import axios from 'axios'
const apiURL = import.meta.env.VITE_API_URL;

export default {
    data() {
        return {
            series: [{
              name: 'Tickets',
              data: []
            }],
            chartOptions: {
                chart: {
                    height: 300,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Tickets Per Support Agent',
                    align: 'center'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: []
                }
            },
        }
    },
    methods: {
        updateAxis(data) {
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    categories: data
                }
            }
        }
    },

    async mounted() {
      try {
        await axios.get(`${apiURL}/ticketpersupport`)
        .then((res) => {
          const filterData = res.data.filter(sup => sup.NUMBER_OF_ASSIGNED_TICKETS >= 0)
          if (filterData.length > 0) {
            this.series[0].data = filterData.map((sup) => sup.NUMBER_OF_ASSIGNED_TICKETS)
            const supportAgent = filterData.map((sup) => sup.SUPPORT_AGENT);
            this.updateAxis(supportAgent)
          } 
        })
      } catch(err) {
        console.log(err)
      }
    },
}

</script>