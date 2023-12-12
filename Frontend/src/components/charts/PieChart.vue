<template>

    <div class="pie-chart-container">
        <apexchart type="pie" 
        height="300"
        :options="options" 
        :series="series">
        </apexchart>
    </div>

</template>

<script>
import axios from 'src/boot/axios';

export default {
    props: {
        options: Object,
        series: Array,
    },

    data() {
        return {
            chartOptions: {
                chart: {
                    width: 300,
                    type: 'pie',
                },
                labels: [],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        parentHeightOffset: 0,
                    },
                    legend: {
                        position: 'right'
                    }
                }],
                title: {
                    text: ''
                },
            },
        }
    },

}

</script>

<style>
.pie-chart-container {
    width: 100%;
}

</style>