<template>
  
    <q-page v-if="isAuthenticated" padding> 
      <div v-if="userRole === 'Staff'">
        <div class="row q-mt-md text-h5 q-ml-md">
          Welcome {{ userFirstName }},
        </div>
        <div class="row q-mb-lg text-subtitle2 q-ml-md" style="color: #626262;">
          All systems are running smoothly!
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-md-4">
          <q-card style="height: 130px;" class="bg-grey-3">
            <q-card-section class="q-ml-xl">
                <div v-if="userRole != 'Staff'" class="text-h3 text-bold q-mt-md">{{ totalTicketCount }}</div>
                <div v-else class="text-h3 text-bold q-mt-md">{{ userTicketCount }}</div>
                <div class="text-subtitle3 text-bold" style="color: #626262;">Total Number Of Tickets</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-4">
          <q-card style="height: 130px;" class="bg-grey-3">
            <q-card-section class="q-ml-xl">
                <div v-if="userRole != 'Staff'" class="text-h3 text-bold q-mt-md">{{ totalOpenTickets }}</div>
                <div v-else class="text-h3 text-bold q-mt-md">{{ userOpenTickets }}</div>
                <div class="text-subtitle3 text-bold" style="color: #626262;">Open Tickets</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-4">
          <q-card style="height: 130px;" class="bg-grey-3">
            <q-card-section class="q-ml-xl">
                <div v-if="userRole != 'Staff'" class="text-h3 text-bold q-mt-md">{{ totalClosedTickets }}</div>
                <div v-else class="text-h3 text-bold q-mt-md">{{ userClosedTickets }}</div>
                <div class="text-subtitle3 text-bold" style="color: #626262;">Completed Tickets</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <div v-if="userRole !== 'Staff'" class="row q-col-gutter-md" style="margin-top: 10px;">
        <div class="col-md-6 col-xs-12">
          <q-card class="bg-grey-3">
            <barChart> </barChart>
          </q-card>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-card class="fit bg-grey-3">
            <div>
              <q-inner-loading 
                :showing="isPieLoading" 
                size="100px" 
                color="primary" 
                label="Please Wait...">
              </q-inner-loading>
              <pieChart
                v-if="!isPieLoading"
                :series="pieSeries"
                :options="chartOptions"
              >
              </pieChart>
              <!-- <div v-else class="q-pa-md">
                <div class="q-mb-md text-center">
                  <q-flex justify="center">
                    <q-space />
                    <q-icon name="warning" size="2em" color="warning" class="q-mr-md" />
                    <p class="text-h6">User Has No Data to Be Shown.</p>
                    <q-space />
                  </q-flex>
                </div>
              </div> -->
            </div>
          </q-card>
        </div>
      </div>
  
      <div class="row" style="margin-top: 20px;">
        <div class="col-md-12">
          <q-card class="bg-grey-3">
            <lineChart
              v-if="userRole != 'Staff'"
            >
            </lineChart>
          </q-card>
        </div>
      </div>

      <div v-if="userRole === 'Staff'" class="row" style="margin-top: 10px;">
        <div class="col-md-12">
          <q-card>
            <q-table title="Most Recent Tickets" color="secondary" :align="left" :loading="loading"
              :rows="recentTickets" :columns="ticketColums" style="width: 95%; margin: auto;" hide-pagination>
              <template #body-cell-Status="props">
                <q-td :props="props">
                    <q-chip :color="props.row.SUPPORT_TICKET_STATUS_DESC === 'CLOSED' ? 'green' : (props.row.SUPPORT_TICKET_STATUS_DESC === 'OPEN' ? 'grey' :  'blue')" text-color="white"
                        dense class="text-weight-bolder" square>{{ props.row.SUPPORT_TICKET_STATUS_DESC }}</q-chip>
                </q-td>
              </template>
              <template #body-cell-Priority="props">
                <q-td :props="props">
                    <q-chip :color="props.row.TICKET_PRIORITY_DESC === 'Critical' ? 'red' : (props.row.TICKET_PRIORITY_DESC === 'High' ? 'black' :  (props.row.TICKET_PRIORITY_DESC === 'Medium' ? 'blue' : 'green'))" text-color="white"
                        dense class="text-weight-bolder" square>{{ props.row.TICKET_PRIORITY_DESC }}</q-chip>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
        <div class="row q-mt-sm">
          <div class="col-md-12">
            <q-btn flat label="Show All" to="/requests"></q-btn>
          </div> 
        </div>
      </div>
  
    </q-page>
  
  </template>
  
  <script>
  import { defineAsyncComponent, ref } from 'vue';
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  const apiURL = import.meta.env.VITE_API_URL;
  
  const barChart = defineAsyncComponent(() =>
    import('components/charts/BarChart.vue')
  )
  
  const pieChart = defineAsyncComponent(() =>
    import('components/charts/PieChart.vue')
  )
  
  const lineChart = defineAsyncComponent(() => 
    import('components/charts/LineChart.vue')
  )
  
  export default {
  
    components: {
      barChart,
      pieChart,
      lineChart,
    },
  
    data() {
      return {
        pieSeries: [],
        chartOptions: {
          labels: [],
          title: {
            text: ''
          },
        },
        
        recentTickets: [],
        isPieLoading: true,
        isVisible: true,
        totalTicketCount: '',
        userTicketCount: '',
        totalOpenTickets: '',
        userOpenTickets: '',
        totalClosedTickets: '',
        userClosedTickets: '',
        ticketColums: [
          {name: 'Date Created', label: 'Date Created', field: 'DATE_CREATED', align: 'left'},
          {name: 'Ticket Subject', required: true, label: 'Ticket Subject', field: 'SUPPORT_TICKET_SUBJECT', align: 'left'}, 
          {name: 'Status', label: 'Status', field: 'SUPPORT_TICKET_STATUS_DESC', align: 'left'},
          {name: 'Priority', label: 'Priority', field: 'TICKET_PRIORITY_DESC', align: 'left'},
        ],
      }
    },
  
    created() {
      axios.get(`${apiURL}/supporttickets`).then((res) => {
        const allTickets = res.data;
  
        const userTickets = allTickets.filter(ticket => ticket.END_USER_ID === this.userID);
        const openTickets = allTickets.filter(ticket => ticket.SUPPORT_TICKET_STATUS_ID === 1 || ticket.SUPPORT_TICKET_STATUS_ID === 2);
        const openTicketsByUser = allTickets.filter(ticket => ticket.SUPPORT_TICKET_STATUS_ID === 1 
          && ticket.END_USER_ID === this.userID);
        const closedTickets = allTickets.filter(ticket => ticket.SUPPORT_TICKET_STATUS_ID === 3);
        const closedTicketsByUser = allTickets.filter(ticket => ticket.SUPPORT_TICKET_STATUS_ID === 3 
          && ticket.END_USER_ID === this.userID);
  
        this.totalTicketCount = allTickets.length;
        this.userTicketCount = userTickets.length;
        this.totalOpenTickets = openTickets.length;
        this.userOpenTickets = openTicketsByUser.length;
        this.totalClosedTickets = closedTickets.length;
        this.userClosedTickets = closedTicketsByUser.length;
      });

      
  
    },
  
    methods: {
      async getTicketCountByCat() {
        this.isPieLoading = true
        try {
          const res = await axios.get(`${apiURL}/ticketbycat`)
  
          const filterData = res.data.filter(sub => sub.NUMBER_OF_TICKETS_BY_CAT >= 0)
          if (filterData.length > 0) {
            this.pieSeries = filterData.map((sub) => sub.NUMBER_OF_TICKETS_BY_CAT)
            this.chartOptions.labels = filterData.map((sub) => sub.TICKET_CATEGORY_DESC)
            this.chartOptions.title.text = 'Tickets By Categories'
          } 
        } catch(err) {
          console.log(err)
        } finally {
          this.isPieLoading = false;
        }
      },
      async getTicketCountByCatByUSER() {
        try {
          const userID = this.userID;
  
          const res = await axios.get(`${apiURL}/ticketbycat/${userID}`)
  
          const filterData = res.data.filter(sub => sub.NUMBER_OF_TICKETS_BY_CAT >= 0)
          if (filterData.length > 0) {
            this.userPieSeries = filterData.map((sub) => sub.NUMBER_OF_TICKETS_BY_CAT)
            this.userChartOptions.labels = filterData.map((sub) => sub.TICKET_CATEGORY_DESC)
            this.userChartOptions.title.text = 'Tickets By Categories'
            this.pieLoading = false
            console.log(this.userPieSeries.data)
            console.log(this.userChartOptions.labels)
  
            setTimeout(() => {
              this.visible = false;
            }, 4000);
          } else {
            this.visible = true;
          }
        } catch(err) {
          console.log(err)
        }
      },
      async getRecentTicketsPerUser() {
        this.loading = true;
        try {
          const userID = this.userID;

          const res = await axios.get(`${apiURL}/recentticketsperuser/${userID}`)
          this.recentTickets = res.data
        } catch(err) {
          console.log(err);
        } finally {
          this.loading = false;
        }
      }
  
    },
  
    mounted() {
      this.getTicketCountByCat();
      this.getTicketCountByCatByUSER();
      this.getRecentTicketsPerUser();
    },
  
    computed: {
      ...mapGetters('auth', ['userID', 'userRole', 'isAuthenticated', 'userFirstName']),
      showPieChart() {
        if (this.userRole !== 'Staff') {
          return this.pieSeries.length > 0;
        } else {
          return this.userPieSeries.some(value => value !== 0);
        }
      },
    },

    setup () {
      return {
        loading: ref(true),
      }
    }
  
  }
  </script>
  
  <style scoped>
  
  .text-container {
    margin-left: 30px;
  }
  
  </style>
  