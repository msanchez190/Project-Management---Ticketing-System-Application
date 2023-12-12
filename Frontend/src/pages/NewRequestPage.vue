<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mr-lg q-ml-lg q-mt-md">
      <q-card class="q-ma-lg">
        <q-card-section class="text-white bg-secondary">
          <div class="text-h6 text-left">Create New Support Ticket</div>
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
                transition-show="scale"
                transition-hide="scale"
                class=" ticket-select"
                color="secondary"
                emit-value
                map-options
                label="Select Main Category"
                v-model="categoryModel"
                :options="categoryData"
                option-value="TICKET_CATEGORY_ID"
                option-label="TICKET_CATEGORY_DESC"
                @update:model-value="getSubcategoryByCategory()" 
              />
            </div>
            <div class="col-4" v-if="subCategoryData.length > 0">
              <q-select
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
                label="Select Subcategory"
              />
            </div>
          </div>

          <!-- Hide entire row if any category besides hardware is selected -->
          <div v-if="categoryModel === hardwCatId.TICKET_CATEGORY_ID && subCatList !== null" class="row-inline flex-direction-down row q-mt-md row-custom">
            <div class="col-4">
              <q-input
                v-model="assetTagModel"
                class="new-request-input"
                label="Asset Tag"
                color="secondary"
              >
                <template v-slot:append>
                  <q-icon
                    :align="top"
                    size="xs"
                    class="q-mb-sm"
                    name="fa-regular fa-circle-question"
                    color="secondary"
                  >
                    <q-tooltip>
                      Unique identifier allocated to device
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col">
              <div>
                <q-input
                  v-model="assetMake"
                  class="new-request-input"
                  label="Asset Make"
                  color="secondary"
                >
                  <template v-slot:append>
                    <q-icon
                      :align="top"
                      size="xs"
                      class="q-mb-sm"
                      name="fa-regular fa-circle-question"
                      color="secondary"
                    >
                      <q-tooltip> i.e., DELL, Acer, Lenovo, etc. </q-tooltip>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="col-4">
              <q-input
                v-model="assetModel"
                class="new-request-input"
                label="Asset Model"
                color="secondary"
              >
                <template v-slot:append>
                  <q-icon
                    :align="top"
                    size="xs"
                    class="q-mb-sm"
                    name="fa-regular fa-circle-question"
                    color="secondary"
                  >
                    <q-tooltip> i.e., G7-700 </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-md row-custom">
            <div class="col-4">
              <div class="col-4">
              <q-select
                v-model="roomModel"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="roomsData"
                @filter="filterRoomFn"
                label="Select Room"
                transition-show="scale"
                transition-hide="scale"
                class="ticket-select"
                color="secondary"
              >
            </q-select>
            </div>
            </div>
            </div>
          <div class="row-inline flex-direction-down row q-mt-lg">
            <div class="col">
              <q-input
                v-model="subjectModel"
                class="new-request-subject"
                label="Subject"
                color="secondary"
              >
                <template v-slot:append>
                  <q-icon
                    :align="top"
                    size="xs"
                    class="q-mb-sm"
                    name="fa-regular fa-circle-question"
                    color="secondary"
                  >
                    <q-tooltip>
                      Provide a sentence describing the issue
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-lg">
            <div class="col">
              <q-item-label class="text-subtitle1 text-primary q-mb-sm"
                >Description:
                <q-icon
                  :align="top"
                  size="xs"
                  class="q-mb-sm"
                  name="fa-regular fa-circle-question"
                  color="secondary"
                >
                  <q-tooltip>
                    Provide a detailed description of the issue
                  </q-tooltip>
                </q-icon>
              </q-item-label>
              <q-input
                v-model="textareaModel"
                clearable
                outlined
                type="textarea"
                color="secondary"
              />
            </div>
          </div>
          <div class="row-inline flex-direction-down row q-mt-lg">
            <div class="col">
              <!-- Decide to use file uploader file picker depending on functionality -->
              <!--
              <q-uploader
                class="new-req-uploader"
                url=""
                label="Upload Image"
                color="secondary"
                text-color="white"
              />
              -->
              <q-file
              class="new-req-uploader"
                :dense="dense"
                v-model="model"
                filled
                bg-color="transparent"
                label="Attach image"
                clearable
                color="secondary"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" color="secondary" />
                </template>
              </q-file>
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
              @click="saveRequest()"
              class="q-ml-xl"
              color="secondary"
              no-caps
              label="Submit"
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
      roomsList: [],
      subCategoryData: [],
      hardwCatId: [],
      openTicketStatusId: null
    }
  },

  created() {
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
        // find the `OPEN` ticket status
        if (currentStatus.SUPPORT_TICKET_STATUS_DESC === 'OPEN') {
          // get the id of the open ticket status and save that in a variable for us to use in the save api later
          this.openTicketStatusId = currentStatus.SUPPORT_TICKET_STATUS_ID;
          break;
        }
      }
    });
    axios.get(`${apiURL}/room`).then((res) => {
      this.roomsData = res.data.map((room) => room.ROOM_NUMBER);
      this.roomsList = res.data.map((room) => room.ROOM_NUMBER);
    });
  },
  setup() {
    return {
      categoryModel: ref(null),
      PriorityList: ref(null),
      textareaModel: ref(null),
      subjectModel: ref(null),
      assetTagModel: ref(null),
      roomModel: ref(null),
      assetMake: ref(null),
      assetModel: ref(null),
      subCatList: ref(null),
      dense: ref(true),
      denseOpts: ref(true),
      model: ref(null),
    };
  },
  methods: {
    //Get ID of category Type Hardware
    findHardwareId() {
      this.hardwCatId = this.categoryData.find(o => o.TICKET_CATEGORY_DESC === 'HARDWARE');
    },
    getSubcategoryByCategory() {
      // reset sub category because we changed categories
      this.subCatList = null;
      // get subcategories based on the current selected category
      axios.get(`${apiURL}/subcattype/${this.categoryModel}`).then((res) => {
        this.subCategoryData = res.data || [];
      })
    },
    dateToLocalISO(date) {
        const off = date.getTimezoneOffset()
        const absoff = Math.abs(off)
        return (new Date(date.getTime() - off*60*1000).toISOString().substr(0,23) +
                (off > 0 ? '-' : '+') + 
                Math.floor(absoff / 60).toFixed(0).padStart(2,'0') + ':' + 
                (absoff % 60).toString().padStart(2,'0'))
    },
    async saveRequest() {
      try {
        const hardwareCategoryId = this.hardwCatId.TICKET_CATEGORY_ID;

        // if the category is hardware and if we have a device make, store it into this variable
        // otherwise device make will be null
        let assetMake = null;
        if (this.categoryModel == hardwareCategoryId && this.assetMake !== null) {
          assetMake = this.assetMake;
        }


        // if the category is hardware and if we have a device model, store it into this variable
        // otherwise device model will be null
        let assetModel = null;
        if (this.categoryModel == hardwareCategoryId && this.assetModel !== null) {
          assetModel = this.assetModel;
        }

        // today's date in ISO format - which is the same format we will save in the database
        const dateCreated = this.dateToLocalISO(new Date());

        // create the support ticket to be saved in the database
        const supportticket = {
          SUPPORT_TICKET_SUBJECT: this.subjectModel, // subject
          SUPPORT_TICKET_NOTE: this.textareaModel, // description
          DEVICE_MAKE: assetMake,
          DEVICE_MODEL: assetModel, 
          SUPPORT_TICKET_TIMELINE: null,
          SUPPORT_TICKET_DATE_CREATED: dateCreated,
          SUPPORT_TICKET_RESOLUTION_TIME: null,
          SUPPORT_TICKET_STATUS_ID: this.openTicketStatusId, // open ticket status
          TICKET_CATEGORY_ID: this.categoryModel, // category
          TICKET_SUB_CATEGORY_ID: this.subCatList, // sub category
          TICKET_PRIORITY_ID: this.PriorityList, // priority
          SUPPORT_AGENT_ID: null,
          RESOLUTION_DATE: null,
          END_USER_ID: this.userID,
          SUPPORT_TICKET_ASSET_TAG: this.assetTagModel, // asset tag
          ROOM_NUMBER: this.roomModel
        };

        // call the save api for support ticket
        const response = await axios.post(`${apiURL}/supportticket`, supportticket);
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
        title: "Cancel Ticket Creation",
        message: "Are you sure you want to cancel ticket creation?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          this.$router.replace("/");
        })
        .onCancel(() => {
          // Do nothing
        })
    },
    filterRoomFn (val, update, abort) {
      update(() => {
        if (val.length === 0) {
          this.roomsData = this.roomsList;
        } else {
          const searchTerm = val.toLowerCase();
          const filteredRooms = this.roomsList.filter((room) => room.toLowerCase().indexOf(searchTerm) > -1)
          this.roomsData = filteredRooms;
        }
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['userID']),
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
