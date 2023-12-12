<template>
  <div
    class="q-pa-md q-gutter-sm"
    style="margin-left: 15px; margin-right: 15px"
  >
    <div class="row">
      <div class="col-flex">
        <q-btn
          class="q-mt-md"
          @click="$router.push('/settings')"
          label="Back"
          icon="arrow_back_ios"
          color="secondary"
          outline=""
        ></q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-card class="requests-card q-ma-lg">
          <q-card-section class="text-white bg-secondary">
            <div class="text-h6 text-left">Software Subcategory Types</div>
          </q-card-section>
          <q-separator />
          <div class="q-pa-lg">
            <!-- Categries Table -->
            <q-table
              class="cat-sticky-virtscroll-table"
              title="Softwarre Subcategories"
              :key="tableKey"
              color="secondary"
              :align="left"
              :loading="loading"
              :rows="subcategorydata"
              :columns="catColumns"
              virtual-scroll
              :virtual-scroll-sticky-size-start="48"
              :pagination="pagination"
              :rows-per-page-options="[0]"
              :hide-pagination="hidePagination"
              :visible-columns="visibleCategoryColumns"
            >
              <template v-slot:top-right>
                <q-btn
                  v-if="userRole==='IT Teacher' || userRole==='System Administrator'"
                  size="1rem"
                  flat
                  color="secondary"
                  class="q-mt-sm"
                  no-caps
                  icon-right="add"
                  label="Add New Software Subcategory"
                  @click="addCategoryDialog()"
                />
              </template>
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.row.ACTIVE_STATUS_ID === 1 ? 'green' : 'red'"
                    text-color="white"
                    dense
                    class="text-weight-bolder"
                    square
                  >
                    {{ props.row.ACTIVE_STATUS_DESC }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    round
                    flat
                    color="secondary"
                    size="12px"
                    @click="editRow('Hardware Category', props)"
                    icon="fa-regular fa-pen-to-square"
                  >
                  </q-btn>
                </q-td>
              </template>
              <template v-slot:body-cell-delactions="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    round
                    flat
                    @click="deleteRow('Hardware Category', props)"
                    icon="fa-regular fa-trash-can"
                    size="12px"
                    color="secondary"
                  ></q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Add new subcategory card-->
  <template>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="addCatCard">
        <q-card style="width: 300px" class="adddialogcard">
          <q-card-section class="qc-header text-white">
            <div class="header-text">Add New Hardware Category:</div>
          </q-card-section>
          <q-card-section>
            <q-input
              clearable
              color="secondary"
              v-model="newCatDescrData.TICKET_SUB_CATEGORY_DESC"
              label="Enter New Hardware Category Description:"
              stack-label
              :dense="dense"
              autofocus
              type="text"
              :rules="[(val) => !!val || 'Field is required']"
            >
            </q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="actionbtns"
              flat
              label="Cancel"
              color="secondary"
              @click="closeCategoryDialog()"
              color-secondary
            />
            <q-btn
              class="actionbtns"
              label="Submit"
              color="secondary"
              @click="addNewCategory()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>

  <!-- Edit Settings Dialog -->
  <template v-if="editedItem.showDialog">
    <EditCategoriesDialog
      :id="editedItem.itemId"
      :name="editedItem.itemName"
      :isActive="editedItem.isItemActive"
      :type="editedItem.itemType"
      @close-dialog="handleCloseDialog"
      @save-dialog="handleSaveDialog"
    />
  </template>

  <!-- Delete Settings Dialog -->
  <template v-if="deleteItem.showDialog">
    <DeleteSettingsDialog
      :id="deleteItem.itemId"
      :name="deleteItem.itemName"
      :type="deleteItem.itemType"
      @close-dialog="handleCloseDeleteDialog"
      @delete-dialog="handleDeleteDialog"
    />
  </template>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { mapGetters } from "vuex";
import EditCategoriesDialog from "../components/EditCategoriesDialog.vue";
import DeleteSettingsDialog from "../components/DeleteSettingsDialog.vue";
const apiURL = import.meta.env.VITE_API_URL;

export default {
  components: {
    DeleteSettingsDialog,
    EditCategoriesDialog,
  },
  data() {
    return {
      subcategorydata: [], // holds the data for the sub categories
      softwareCategoryTypeID: "",
      mainCategoryData: [], // holds the data for the main categories
      updateCatData: {
        TICKET_SUB_CATEGORY_ID: "",
        TICKET_SUB_CATEGORY_DESC: "",
        TICKET_CATEGORY_ID: "",
        ACTIVE_STATUS_ID: "",
      },
      newCatDescrData: {
        TICKET_SUB_CATEGORY_DESC: "",
        ACTIVE_STATUS_ID: "1",
        TICKET_CATEGORY_ID: "",
      },
      catEmptyInput: false, // holds the value for the empty category input
      deleteItem: {
        itemType: "", // keeps track of it we're editing a category or priority
        showDialog: false, // keeps track of if the edit dialog should pop open
        itemId: "", // keeps track of the id of the item (category or priority)
        itemName: "", // keeps track of the desc of the item (category or priority)
      },
      editedItem: {
        itemType: "", // keeps track of it we're editing a category or priority
        showDialog: false, // keeps track of if the edit dialog should pop open
        itemId: "", // keeps track of the id of the item (category or priority)
        itemName: "", // keeps track of the desc of the item (category or priority)
        isItemActive: true, // // keeps track of the active status of the item (category or priority)
      },
      visibleCategoryColumns: [
        "ticket_sub_category",
        "status",
        "actions",
        "delactions",
      ], // Set visible columns of category table
    };
  },

  created() {
    this.getsubcategories();
    this.getCategories();
    this.hideColums(); // handles the visibility of the delete columns based on user role
  },
  methods: {
    getsubcategories() {
      axios.get(`${apiURL}/categories`).then((res) => {
        this.mainCategoryData = res.data;
        this.softwareCategoryTypeID = this.mainCategoryData.find(
          (o) => o.TICKET_CATEGORY_DESC.toUpperCase() === "SOFTWARE"
        );
        axios
          .get(
            `${apiURL}/subcattype/${this.softwareCategoryTypeID.TICKET_CATEGORY_ID}`
          )
          .then((res) => {
            this.subcategorydata = res.data;
            this.loading = false;
          });
      });
    },

    /**
     * @param type item type (expected values are "Category" or "Property")
     * @param props properties related to the edited row (e.g. id, desc, status)
     */
    editRow(type, props) {
      let itemId;
      let itemDesc;
      // get priority id/desc
      itemId = props.row.TICKET_SUB_CATEGORY_ID;
      itemDesc = props.row.TICKET_SUB_CATEGORY_DESC;
      // update component data variables
      this.editedItem.itemId = itemId;
      this.editedItem.itemName = itemDesc;
      this.editedItem.isItemActive = props.row.ACTIVE_STATUS_ID === 1;
      this.editedItem.itemType = "TICKET_SUB_CATEGORY";
      // show dialog
      this.editedItem.showDialog = true;
    },

    async handleSaveDialog(response) {
      // destruct to access id property name and item from the response after you clicked save on the dialog
      const { item } = response;
      this.updateCatData.TICKET_SUB_CATEGORY_ID = item.TICKET_SUB_CATEGORY_ID;
      this.updateCatData.TICKET_SUB_CATEGORY_DESC =
        item.TICKET_SUB_CATEGORY_DESC;
      this.updateCatData.ACTIVE_STATUS_ID = item.ACTIVE_STATUS_ID; // update the category active status
      await this.updateCategoryAsync();
      // close dialog
      this.editedItem.showDialog = false;
    },

    // Add new category
    async addNewCategory() {
      if (this.newCatDescrData.TICKET_SUB_CATEGORY_DESC == "") {
        return;
      }
      await this.addNewCategoryPromise(); // Call function to add new category
      this.addCatCard = false; // Close add category dialog
      this.tableKey += 1; // Increment table key to re-render q-table
      this.getsubcategories(); // Call GET API for categories
      this.newCatDescrData.TICKET_SUB_CATEGORY_DESC = ""; // Clear new category description
    },

    // Function to add new category
    // Wait for data to be fetched before re rendering the table
    addNewCategoryPromise() {
      return new Promise((resolve, reject) => {
        this.newCatDescrData.TICKET_CATEGORY_ID =
          this.softwareCategoryTypeID.TICKET_CATEGORY_ID;
        axios.post(`${apiURL}/subcategory`, this.newCatDescrData).then(() => {
          this.addCatCard = false;
          this.tableKey += 1;
          this.getsubcategories();
          resolve();
        });
      });
    },
    handleCloseDialog() {
      this.editedItem.showDialog = false;
    },
    updateCategoryAsync() {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `${apiURL}/subcategory/${this.updateCatData.TICKET_SUB_CATEGORY_ID}`,
            this.updateCatData
          )
          .then(() => {
            this.tableKey += 1;
            this.getsubcategories();
            resolve();
          });
      });
    },

    addCategoryDialog() {
      this.catEmptyInput = false;
      this.addCatCard = true;
    },

    closeCategoryDialog() {
      this.newCatDescrData.TICKET_SUB_CATEGORY_DESC = ""; // Clear new category description
      this.addCatCard = false;
    },

    handleCloseDeleteDialog() {
      // close delete dialog
      this.deleteItem.showDialog = false;
    },

    async handleDeleteDialog() {
      //Async function to delete category to wait for data to return before re-rendering the table
      await this.deleteCategoryAsync();
      this.tableKey += 1;
      this.getsubcategories();
      // close delete dialog
      this.deleteItem.showDialog = false;
    },

    // Async function to delete category to wait for data to return before re-rendering the table
    deleteCategoryAsync() {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${apiURL}/subcategory/${this.deleteItem.itemId}`)
          .then(() => {
            this.tableKey += 1; //re-render table
            this.getsubcategories();
            resolve();
          });
      });
    },

    // Function for delete dialog
    deleteRow(type, props) {
      let itemId;
      let itemDesc;
      // get item values from props based on what type it is
      itemId = props.row.TICKET_SUB_CATEGORY_ID;
      itemDesc = props.row.TICKET_SUB_CATEGORY_DESC;
      // update component data variables
      this.deleteItem.itemId = itemId;
      this.deleteItem.itemName = itemDesc;
      this.deleteItem.itemType = type;
      // show dialog
      this.deleteItem.showDialog = true;
    },

    // Hide delete column is user role is not 'IT Teacher'
    hideColums() {
      if (this.userRole != "System Administrator") {
        this.visibleCategoryColumns = [
          "ticket_sub_category",
          "status",
          "actions",
        ];
      }
      if(this.userRole === "Technician") {
        this.visibleCategoryColumns = [
          "ticket_sub_category",
          "status",
        ];
      } 
    },

    getCategories() {
      axios.get(`${apiURL}/categories`).then((res) => {
        this.mainCategoryData = res.data;
      });
    },
  },

  setup() {
    const catColumns = [
      {
        name: "ticket_sub_category",
        label: "Hardware Category",
        field: "TICKET_SUB_CATEGORY_DESC",
        align: "left",
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        field: "ACTIVE_STATUS_DESC",
        sortable: true,
      },
      {
        name: "actions",
        label: "Edit",
        field: "",
        align: "left",
      },
      {
        name: "delactions",
        label: "Delete",
        field: "",
        align: "left",
      },
    ];

    const statuses = ["Active", "Inactive"];
    return {
      setActive: ref("Active"),
      loading: ref(true),
      catColumns,
      selected: ref([]),
      redModel: ref(true),
      addCatCard: ref(false),
      pagination: { rowsPerPage: 0 },
      hidePagination: ref(true),
    };
  },
  computed: {
    ...mapGetters("auth", ["userID", "userRole"]),
  },
};
</script>
<style scoped>
.actionbtns {
  margin: 10px;
}
.header-text {
  font-size: 1.1rem;
  font-weight: 500;
}
.qc-header {
  background-color: #666262;
  border-bottom: 0.2rem solid #a62626;
}
.cat-input-validation {
  color: red;
  font-size: 0.8rem;
  margin-top: 10px;
  font-style: italic;
}
</style>
<style lang="sass">
.cat-sticky-virtscroll-table
  /* height or max-height is important */
  max-height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #ebebeb

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
