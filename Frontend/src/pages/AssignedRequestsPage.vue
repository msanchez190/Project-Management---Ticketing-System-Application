<template>
    <div class="q-pa-md q-gutter-sm" style="margin-left: 15px; margin-right: 15px;">
        <q-card class="requests-card">
            <q-card-section class="text-white" style="background-color: #af0000;">
                <div class="text-h6 text-left"> Manage Assigned Requests </div>
            </q-card-section>
            <q-separator />

            <div class="q-pa-md" style="margin: 0 auto;">
                <q-table 
                    title="Requests"
                    color="secondary"
                    :align="left"
                    :loading="loading"
                    :rows="supporttickets"
                    :columns="supportticketsColumns"
                    style="width: 95%; margin: auto"
                    @row-click="editRow"
                    v-model:pagination="pagination"
                >
                    <template v-slot:top>
                        <q-select
                            v-model="filterByModel"
                            :options="filterByOptions"
                            option-value="SUPPORT_TICKET_STATUS_ID" 
                            option-label="SUPPORT_TICKET_STATUS_DESC"
                            label="Filter By Status"
                            style="min-width: 120px; margin-right:10px;"
                            @update:model-value="getSupportTickets"
                        />
                        <q-input
                            v-if="userRole ==='System Administrator' || userRole ==='IT Teacher'"
                            v-model="searchTerm"
                            label="Search"
                            @update:model-value="getSupportTickets"
                        >
                            <template v-slot:prepend>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                     <template #body-cell-status="props">
                        <q-td :props="props">
                            <q-chip :color="props.row.SUPPORT_TICKET_STATUS_DESC === 'CLOSED' ? 'green' : (props.row.SUPPORT_TICKET_STATUS_DESC === 'OPEN' ? 'grey' :  'blue')" text-color="white"
                                dense class="text-weight-bolder" square>{{ props.row.SUPPORT_TICKET_STATUS_DESC }}</q-chip>
                        </q-td>
                    </template>
                     <template #body-cell-priority="props">
                        <q-td :props="props">
                            <q-chip :color="props.row.prioritystatus === 'Critical' ? 'red' : (props.row.prioritystatus === 'High' ? 'black' :  (props.row.prioritystatus === 'Medium' ? 'blue' : 'green'))" text-color="white"
                                dense class="text-weight-bolder" square>{{ props.row.prioritystatus }}</q-chip>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </q-card>
    </div>
</template>
  
<script>
import { ref } from 'vue'
import axios from "axios";
import { mapGetters } from 'vuex';
const apiURL = import.meta.env.VITE_API_URL

export default {
    data() {
        return {
            supporttickets: [],
            priorities: {},
            supportAgents: {},
            filterByOptions: [],
            endUsers: [],
            endUsersOptions: [],
            allStatus: { SUPPORT_TICKET_STATUS_ID: null, SUPPORT_TICKET_STATUS_DESC: 'ALL' },
            allUser: { END_USER_ID: null, END_USER_FULL_NAME: 'All Users' },
            searchTerm: ''
        }
    },
    async created() {
        await this.getPriorities();
        await this.getSupportAgents();

        axios.get(`${apiURL}/activeticketstatuses`).then((res) => {
            this.filterByOptions = [this.allStatus, ...res.data];
            this.filterByModel = this.filterByOptions[0]; 
            
            this.setTicketColumns();
            this.getSupportTickets();
        });

        axios.get(`${apiURL}/endusers`).then((res) => {
            const users = res.data.map((user) => {
                return {
                    END_USER_FULL_NAME: `${user.END_USER_FIRST_NAME} ${user.END_USER_LAST_NAME}`,
                    ...user
                }
            });

            this.endUsers = users;
            this.userModel = this.allUser;
            // first option is "All Users"
            // only show 9 users in case the list of users is too long
            this.endUsersOptions = [this.allUser, ...this.endUsers.slice(0, 9)];

        });
    },
    methods: {
        async getPriorities() {
            // call active priorities api to get the list of all apis
            const activePriorities = await axios.get(`${apiURL}/activepriorities`)
            // map the id and priority description
            activePriorities.data.forEach((priority) => {
                this.priorities[priority.TICKET_PRIORITY_ID] = priority.TICKET_PRIORITY_DESC;
            });
        },
        async getSupportAgents() {
            // call support agent api to get the list of technicians
            const supportAgents = await axios.get(`${apiURL}/supportAgents`)
            // map the supportAgent id to their email email
            supportAgents.data.forEach((supportAgent) => {
                this.supportAgents[supportAgent.SUPPORT_AGENT_USER_ID] = supportAgent.END_USER_EMAIL;
            });
        },
        getSupportTickets() {
            this.loading = true;
            this.supporttickets = [];
            axios.post(`${apiURL}/assignedsupporttickets`, {
                userId: this.userID,
                userRole: this.userRole,
                status: this.filterByModel.SUPPORT_TICKET_STATUS_ID,
                createdByUserId: this.userModel?.END_USER_ID || null,
                searchTerm: this.searchTerm,
            }).then((res) => {
                if (res.data) {
                    this.setSupportTickets(res.data);
                } else {
                    console.log(res.error);
                }
                this.loading = false;
            });
        },
        setSupportTickets(supporttickets) {
            if (supporttickets) {
                this.supporttickets = supporttickets.map((supportticket) => {
                    // add a new property called priority status to supportticket
                    // set it to the status from priorities based on the current ticket priority id
                    const email = this.supportAgents[supportticket.SUPPORT_AGENT_ID] || 'Unassigned';
                    return {
                        prioritystatus: this.priorities[supportticket.TICKET_PRIORITY_ID],
                        SUPPORT_AGENT_EMAIL: email,
                        ...supportticket
                    }
                });
            }
        },
        setTicketColumns() {
            const supportticketsColumns = [
                { name: 'subject', label: 'Subject', field: 'SUPPORT_TICKET_SUBJECT', align: 'left', sortable: true  },
                { name: "status", align: "center", label: "Status", field: "SUPPORT_TICKET_STATUS_DESC", sortable: true },
                { name: "creationDate", align: "left", label: "Creation Date", field: "SUPPORT_TICKET_DATE_CREATED", sortable: true, format: (val) => {
                    const date = new Date(val);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const year = date.getFullYear();
                    let hours = date.getHours();
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    let ampm = 'AM';

                    // Convert to 12-hour format and determine AM/PM
                    if (hours >= 12) {
                        ampm = 'PM';
                        if (hours > 12) {
                        hours -= 12;
                        }
                    }

                    // convert 00:00 am to 12:00
                    if (hours == 0) {
                        hours = 12;
                    }

                    // Create the formatted date string
                    const formattedDate = `${month}/${day}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

                    return formattedDate;
                } 
            }];

            if (this.userRole !== 'Staff') {
                supportticketsColumns.push({ name: "email", align: "center", label: "Ticket Creator Email", field: "END_USER_EMAIL", sortable: true });
            }

            supportticketsColumns.push({ name: "priority", align: "center", label: "Priority", field: "TICKET_PRIORITY_ID", sortable: true });
            supportticketsColumns.push({ name: "supportAgent", align: "center", label: "Support Agent Email", field: "SUPPORT_AGENT_EMAIL", sortable: true });

            this.supportticketsColumns = supportticketsColumns;
        },
        filterFn (val, update, abort) {
            update(() => {
                if (val.length === 0) {
                    this.endUsersOptions = [this.allUser, ...this.endUsers.slice(0, 9)];
                } else {
                    const searchTerm = val.toLowerCase()
                    const results = this.endUsers.filter(user => user.END_USER_FULL_NAME.toLowerCase().indexOf(searchTerm) > -1);
                    this.endUsersOptions = [this.allUser, ...results.slice(0, 9)];
                }
            });
        },
        editRow(evt, row) {
            this.$router.push(`/request/${row.SUPPORT_TICKET_ID}`);
        }
    },
    setup() {
        return {
            tab: ref('requests'),
            setActive: ref('Active'),
            loading: ref(true),
            supportticketsColumns: ref([]),
            selected: ref([]),
            redModel: ref(true),
            filterByModel: ref(null),
            userModel: ref(null),
            pagination: ref({
                sortBy: 'creationDate',
                descending: true,
                page: 1,
            })
        };
    },
    computed: {
      ...mapGetters('auth', ['userID','userRole']),

    }
}
</script>

<style>
/** override default primary color */
.q-toggle__inner--truthy {
    color: #1976d2 !important;
}
</style>