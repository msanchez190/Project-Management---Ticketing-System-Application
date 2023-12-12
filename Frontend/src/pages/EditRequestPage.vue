<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mr-lg q-ml-lg q-mt-md">
      <q-card class="q-ma-lg">
        <q-card-section class="text-white bg-secondary">
          <div class="text-h6 text-left">Edit Support Ticket</div>
        </q-card-section>
        <q-separator />

        <div class="q-pl-xl q-pr-xl q-pt-md q-pb-md">
          <div class="row-inline row q-mt-md">
            <div class="col-4">
              <q-select
                class="ticket-select"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                label="Select Priority"
                map-options
                color="secondary"
                v-model="PriorityList"
                :options="priorityData"
                option-value="TICKET_PRIORITY_ID"
                option-label="TICKET_PRIORITY_DESC"
              />
            </div>
            <div class="col-4">
              <q-select
                class="ticket-select"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                label="Select Status"
                map-options
                color="secondary"
                v-model="SupportTicketStatusModel"
                :options="supportTicketStatusData"
                option-value="SUPPORT_TICKET_STATUS_ID"
                option-label="SUPPORT_TICKET_STATUS_DESC"
              />
            </div>
            <template v-if="userRole === 'System Administrator' || userRole === 'IT Teacher'">
              <div class="col-4">
                <q-select
                  class="ticket-select"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  label="Support Agent"
                  map-options
                  color="secondary"
                  v-model="SupportAgentModel"
                  :options="supportAgentData"
                  option-value="SUPPORT_AGENT_USER_ID"
                  option-label="SUPPORT_AGENT"
                />
              </div>
            </template>
            <template v-if="userRole !== 'System Administrator' && userRole !== 'IT Teacher'">
              <div class="col-4">
                <q-select
                  readonly
                  disable
                  class="ticket-select"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  label="Support Agent"
                  map-options
                  color="secondary"
                  v-model="SupportAgentModel"
                  :options="supportAgentData"
                  option-value="SUPPORT_AGENT_USER_ID"
                  option-label="SUPPORT_AGENT"
                />
              </div>
            </template>
          </div>
          <div class="row-inline row q-mt-md">
            <div class="col-4">
              <q-select
                disable
                readonly
                transition-show="scale"
                transition-hide="scale"
                class=" ticket-select"
                color="secondary"
                emit-value
                map-options
                label="Category"
                v-model="categoryModel"
                :options="categoryData"
                option-value="TICKET_CATEGORY_ID"
                option-label="TICKET_CATEGORY_DESC"
              />
            </div>
            <div class="col-4">
              <q-select
                disable
                readonly
                transition-show="scale"
                transition-hide="scale"
                class="ticket-select"
                color="secondary"
                v-model="subCatList"
                :options="subCategoryData"
                option-value="TICKET_SUB_CATEGORY_ID"
                option-label="TICKET_SUB_CATEGORY_DESC"
                emit-value
                map-options
                label="Subcategory"
              />
            </div>
          </div>

          <!-- Hide entire row if any category besides hardware is selected -->
          <div v-if="categoryModel === hardwCatId.TICKET_CATEGORY_ID" class="row-inline flex-direction-down row q-mt-md row-custom">
            <div class="col-4">
              <q-input
                disable
                readonly
                v-model="assetTagModel"
                class="new-request-input"
                label="Asset Tag"
                color="secondary"
              >
              </q-input>
            </div>
            <div class="col">
              <div>
                <q-input
                disable
                readonly
                  v-model="assetMake"
                  class="new-request-input"
                  label="Asset Make"
                  color="secondary"
                >
                </q-input>
              </div>
            </div>
            <div class="col-4">
              <q-input
                disable
                readonly
                v-model="assetModel"
                class="new-request-input"
                label="Asset Model"
                color="secondary"
              >
              </q-input>
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-md row-custom">
            <div class="col-4">
              <div class="col-4">
              <q-select
                transition-show="scale"
                transition-hide="scale"
                class="ticket-select"
                color="secondary"
                v-model="roomModel"
                :options="roomsData"
                emit-value
                label="Select Room"
                disable
                readonly
              >
            </q-select>
            </div>
            </div>
            </div>
          <div class="row-inline row q-mt-md">
            <div class="col-4">
              <q-input
                disable
                readonly
                v-model="createdDateModel"
                class="new-request-input"
                label="Created Date"
                color="secondary"
              >
              </q-input>
            </div>
            <div class="col-4">
              <q-input
                disable
                readonly
                v-model="emailModel"
                class="new-request-input"
                label="Contact Email"
                color="secondary"
              >
              </q-input>
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-lg">
            <div class="col">
              <q-input
                disable readonly 
                v-model="subjectModel"
                class="new-request-subject"
                label="Subject"
                color="secondary"
              >
              </q-input>
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-lg">
            <div class="col">
              <q-item-label class="text-subtitle1 text-primary q-mb-sm"
                >Description:
              </q-item-label>
              <q-input
                disable readonly 
                v-model="textareaModel"
                clearable
                outlined
                type="textarea"
                color="secondary"
              />
            </div>
          </div>

          <div class="col q-mb-md q-mt-lg" align="right">
            <q-btn
              color="accent"
              text-color="secondary"
              no-caps
              label="Cancel"
              type="submit"
              @click="confirmCancel"
            />
            <q-btn
              @click="saveRequest(userID)"
              class="q-ml-xl"
              color="secondary"
              no-caps
              label="Update"
              type="submit"
            />
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapGetters } from 'vuex'
import { Dialog } from 'quasar'
import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      categoryData: [],
      priorityData: [],
      roomsData: [],
      supportAgentData: [],
      supportTicketStatusData: [],
      subCategoryData: [],
      hardwCatId: [],
      closedTicketStatusId: null,
      ticket: {},
    }
  },

  created() {
    const requestId = this.$route.params.requestId;
    axios.get(`${apiURL}/supportticket/${requestId}`).then((res) => {
      const ticket = res.data[0];

      this.createdDate = ticket.SUPPORT_TICKET_DATE_CREATED;
      const date = new Date(this.createdDate);
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

      // Create the formatted date string
      const formattedDate = `${month}/${day}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      this.ticketModel = ticket;
      this.createdDateModel = formattedDate;
      this.subjectModel = ticket.SUPPORT_TICKET_SUBJECT;
      this.textareaModel = ticket.SUPPORT_TICKET_NOTE;
      this.assetTagModel = ticket.SUPPORT_TICKET_ASSET_TAG;
      this.assetMake = ticket.DEVICE_MAKE;
      this.assetModel = ticket.DEVICE_MODEL;
      this.categoryModel = ticket.TICKET_CATEGORY_ID;
      this.categoryDesc = ticket.TICKET_CATEGORY_DESC;
      this.subCatList = ticket.TICKET_SUB_CATEGORY_ID;
      this.PriorityList = ticket.TICKET_PRIORITY_ID;
      this.SupportTicketStatusModel = ticket.SUPPORT_TICKET_STATUS_ID;
      this.SupportAgentModel = ticket.SUPPORT_AGENT_ID;
      this.emailModel = ticket.END_USER_EMAIL;
      this.roomModel = ticket.ROOM_NUMBER[0];

      this.getSubcategoryByCategory();
    });

    axios.get(`${apiURL}/activecategories`).then((res) => {
      this.categoryData = res.data
      this.findHardwareId()
    })
    axios.get(`${apiURL}/activepriorities`).then((res) => {
      this.priorityData = res.data
    })
    axios.get(`${apiURL}/activeticketstatuses`).then((res) => {
      // query for all the active ticket statuses
      for(let i = 0; i < res.data.length; i++) {
        const currentStatus = res.data[i];
        // find the `CLOSED` ticket status
        if (currentStatus.SUPPORT_TICKET_STATUS_DESC === 'CLOSED') {
          // get the id of the CLOSED ticket status and save that in a variable for us to use in the save api later
          this.closedTicketStatusId = currentStatus.SUPPORT_TICKET_STATUS_ID;
          break;
        }
      }

      this.supportTicketStatusData = res.data;
    });

    axios.get(`${apiURL}/supportAgents`).then((res) => {
      this.supportAgentData = res.data;
    });

    
    axios.get(`${apiURL}/room`).then((res) => {
      this.roomsData = res.data.map((room) => room.ROOM_NUMBER);
    });
  },
  setup() {
    return {
      SupportAgentModel: ref(null),
      categoryModel: ref(null),
      categoryDesc: ref(null),
      PriorityList: ref(null),
      SupportTicketStatusModel: ref(null),
      textareaModel: ref(null),
      subjectModel: ref(null),
      assetTagModel: ref(null),
      assetMake: ref(null),
      assetModel: ref(null),
      subCatList: ref(null),
      roomModel: ref(null),
      dense: ref(true),
      denseOpts: ref(true),
      model: ref(null),
      createdDateModel: ref(null),
      createdByModel: ref(null),
      emailModel: ref(null),
      ticketModel: ref(null),
    };
  },
  methods: {
    //Get ID of category Type Hardware
    findHardwareId() {
      this.hardwCatId = this.categoryData.find(o => o.TICKET_CATEGORY_DESC === 'HARDWARE');
    },
    getSubcategoryByCategory() {
      // get subcategories based on the current selected category
      axios.get(`${apiURL}/subcattype/${this.categoryModel}`).then((res) => {
        this.subCategoryData = res.data || [];
      })
    },
    async saveRequest() {
      try {
        const requestId = this.$route.params.requestId;
        const supportticket = {
          ...this.ticketModel,
          SUPPORT_TICKET_ID: parseInt(requestId),
          TICKET_PRIORITY_ID: this.PriorityList,
          SUPPORT_TICKET_STATUS_ID: this.SupportTicketStatusModel,
          SUPPORT_AGENT_ID: this.SupportAgentModel,
          ROOM_NUMBER: this.roomModel
        }

        // if its closed, set resolution date and time
        if (this.SupportTicketStatusModel === this.closedTicketStatusId) {
          const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          const firstDate = new Date(this.createdDate);
          const dateClosed = new Date();

          const diffDays = Math.round(Math.abs((firstDate - dateClosed) / oneDay));
          
          supportticket.RESOLUTION_DATE = dateClosed.toISOString();
          supportticket.SUPPORT_TICKET_RESOLUTION_TIME = diffDays;
        }

        const response = await axios.put(`${apiURL}/supportticket/${requestId}`, supportticket);
        // if the save is successful for the support ticket
        if(response.status === 200) {
          // then we will redirect to the list of requests
          this.$router.push({ path: '/requests' });
        } else {
          // if an error happens, we don't redirect the user to the list of requests and show them an error dialog
          Dialog.create({
            title: 'An error occurred',
            message: 'Please try again later.',
          });
          console.error('Failed to save request.')
        };
      } catch (error) {
        // if an error happens, we don't redirect the user to the list of requests and show them an error dialog
        Dialog.create({
          title: 'An error occurred',
          message: 'Please try again later.',
        });
        console.error('Save API request failed:', error);
      }
    },
    confirmCancel() {
      Dialog.create({
        title: "Discard Changes?",
        message: "Are you sure you want to discard changes made on this page?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          this.$router.push({ path: '/requests' });
        })
        .onCancel(() => {
          // Do nothing
        })
    }
  },
  computed: {
    ...mapGetters('auth', ['userID', 'userRole']),
  }
};
</script>
<style scoped>
.text-subtitle1 {
  font-weight: bold;
}
.text-subtitle2 {
  color: primary;
}
.category-select {
  width: 50%;
}
.ticket-select {
  width: 50%;
}
.new-request-input {
  width: 50%;
}
.new-req-uploader {
  max-width: 40%;
}
.new-req-uploader{
  max-width: 25%;
}
</style>
