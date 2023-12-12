<template>

    <apexchart 
    type="bar" 
    height="300" 
    :options="chartOptions" 
    :series="series">
    </apexchart>


</template>

<script>
import axios from 'axios';
const apiURL = import.meta.env.VITE_API_URL;

export default {
    data() {
        return {
            series: [{
                name: 'Closed Tickets',
                data: []
            }],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'bar',
                    toolbar: {
                        show: true,
                        offsetX: 0,
                        offsetY: 0,
                        tools: {
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true
                        }
                    }
                },
                colors: '#3CB043',
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },
            
                xaxis: {
                    categories: [],
                    position: 'bottom',
                    axisBorder: {
                        show: false
                    },
                    tickPlacement: "on",
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: true,
                    }
            
                },
                title: {
                    text: 'Tickets Closed For the Past Year',
                    align: 'center',
                    style: {
                        color: '#444'
                    }
                }
            },
            shortToNumberMonthNames : {
                'Jan' : '01',
                'Feb' : '02',
                'Mar' : '03',
                'Apr' : '04',
                'May' : '05',
                'Jun' : '06',
                'Jul' : '07',
                'Aug' : '08',
                'Sep' : '09',
                'Oct' : '10',
                'Nov' : '11',
                'Dec' : '12',
            },
        }
    },

    mounted() {
        this.fetchAndPopulateBarchart();
    },

    methods: {
        updateAxis(data) {
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    categories: data
                }
            }
        },

        createMonthsAndYear() {
            const currentDate = new Date();
            const lastMonth = new Date(currentDate);
            lastMonth.setMonth(lastMonth.getMonth());
            const monthsAndYear = [];
            for(let i = 0; i < 12; i++) {
                const date = new Date(lastMonth);
                date.setMonth(date.getMonth() -i);
                const shortMonth = date.toLocaleString('default', {month: 'short'});
                const year = date.getFullYear();
                monthsAndYear.push(`${shortMonth} ${year}`)
            }
            return monthsAndYear;
        },

        fetchAndPopulateBarchart() {
            axios.get(`${apiURL}/ticketsclosedcountmonthly`)
            .then(res => {
                const apiData = res.data;
                const monthsData = this.createMonthsAndYear();
                this.updateAxis(monthsData);

                this.series[0].data = monthsData.map((monthAndYear) => {
                    const [shortMonth, year] = monthAndYear.split(' ');
                    const numberMonthYear = `${this.shortToNumberMonthNames[shortMonth]}-${year}`
                    const matchingData = apiData.find((item) => item.MONTHYEAR === numberMonthYear);
                    return matchingData ? matchingData.CLOSED_TICKETS_COUNT : 0;
                })
                console.log(this.chartOptions.xaxis.categories)
                console.log(this.series[0].data)
            })
            .catch(error => {
                console.error('Error fetching data: ', error)
            })
        },

        formatMonthYear(monthYear) {
            const [month, year] = monthYear.split('-');
            const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short' });
            return `${monthName}${year}`;
        }

    },
}

</script>