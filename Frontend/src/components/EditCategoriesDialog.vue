<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-card" style="min-width: 350px">
      <q-card-section class="qc-header q-pa-md text-white">
        <div class="header-text">{{ title }}</div>
      </q-card-section>

      <template
        v-if="
          isAuthenticated &&
          (userRole === 'System Administrator' || userRole === 'IT Teacher')
        "
      >
        <q-card-section>
          <q-input label="Category Name" dense v-model="itemName" autofocus />
        </q-card-section>
      </template>

      <q-card-section class="q-pt-none">
        <q-toggle
          label="Status"
          v-model="isItemActive"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          left-label
        />
        <span v-if="isItemActive">ACTIVE</span>
        <span v-if="!isItemActive">INACTIVE</span>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          color="primary"
          class="actionbtns"
          label="Cancel"
          @click="closeDialog"
        />
        <q-btn
          color="primary"
          class="actionbtns"
          label="Save"
          @click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "",
      nameLabel: "",
      showDialog: true,
      itemId: null,
      itemName: "",
      isItemActive: null,
      idPropertyName: "",
      descPriortyName: "",
      headerDesc: "",
    };
  },
  props: {
    // item id
    id: Number,
    // item name
    name: String,
    // item active status
    isActive: Boolean,
    // item type
    type: String,
  },
  created() {
    // dynamically create title name based on what type it is
    if (this.type == "TICKET_SUB_CATEGORY") {
      this.headerDesc = "Edit Sub Category";
    } else {
      this.headerDesc = "Edit Main Category";
    }
    this.title = `${this.headerDesc}`;
    // set variables used for save api later
    this.itemId = this.id;
    this.itemName = this.name;
    this.isItemActive = this.isActive;
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog", false);
      this.showDialog = false;
    },
    saveChanges() {
      let idPropertyName = "";
      let descPriortyName = "";
      // create dynamic property name
      // e.g. TICKET_CATEGORY_ID or HARDW_SUB_CATEGORY_ID
      idPropertyName = `${this.type.toUpperCase()}_ID`;
      // e.g. TICKET_CATEGORY_ID or HARDW_SUB_CATEGORY_DESC
      descPriortyName = `${this.type.toUpperCase()}_DESC`;
      // notify parent to save dialog with the following values
      this.$emit("save-dialog", {
        item: {
          [idPropertyName]: this.itemId,
          [descPriortyName]: this.itemName,
          ACTIVE_STATUS_ID: this.isItemActive ? 1 : 2, // 1 is active, 2 is inactive
          ACTIVE_STATUS_DESC: this.isItemActive ? "ACTIVE" : "INACTIVE",
        },
        idPropertyName,
      });
    },
  },
  computed: {
    ...mapGetters("auth", [
      "isAuthenticated",
      "userEmail",
      "userFirstName",
      "userRole",
    ]),
  },
};
</script>

<style scoped>
.actionsbtn {
  margin: 10px;
}
.qc-header {
  border-bottom: 0.2rem solid #a62626;
  background-color: #666262;
}
.header-text {
  font-size: 1.1rem;
  font-weight: 500;
}
.actionbtns {
  margin: 10px;
}
</style>
