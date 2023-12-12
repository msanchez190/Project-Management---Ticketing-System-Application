<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="qc-header q-pa-md text-white">
        <div class="header-text">{{ title }}</div>
      </q-card-section>
      <q-card-section>
        <div class="text-body2 q-mt-md">
          <q-icon
            class="q-mr-md"
            name="warning"
            color="warning"
            size="3rem"
          />Delete {{ type.toLowerCase() }}: <strong> {{ itemName }} </strong>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
        text-color="secondary"
        class="actionbtns"
        flat label="Cancel"

        @click="closeDialog" />
        <q-btn
          class="actionbtns"
          color="secondary"
          label="Delete"
          @click="deleteRecord"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      nameLabel: "",
      showDialog: true,
      itemId: null,
      itemName: "",

    };
  },
  props: {
    // item id
    id: Number,
    // item name
    name: String,
    // item type
    type: String,
  },
  created() {
    // dynamically create title name based on what type it is
    // e.g. "Update Category" or "Update Priority"



      this.title = `Confirm ${this.type} Deletion`;

    // set variables used for save api later
    this.itemId = this.id;
    this.itemName = this.name;

    console.log(this.itemId);
    console.log(this.itemName);
    console.log(this.type);
  },
  methods: {
    closeDialog() {
      // hide dialog
      this.showDialog = false;
      // notify parent component to close dialog
      this.$emit("close-dialog", false);
    },
    deleteRecord() {
      // create dynamic property name
      // e.g. TICKET_CATEGORY_ID or TICKET_PRIORITY_ID
      const idPropertyName = `${this.type.toUpperCase()}_ID`;
      // notify parent to delete dialog with the following values
      this.$emit("delete-dialog", {
        item: {
          [idPropertyName]: this.itemId,
        },
        idPropertyName,
      });
    },
  },
};
</script>
<style scoped>
.actionbtns {
  margin: 10px;
}
.qc-header  {
  background-color: #a62626;
}
.header-text {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
