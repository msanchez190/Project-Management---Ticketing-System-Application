<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">{{title}}</div>
            </q-card-section>

            <template v-if="isAuthenticated && userRole==='System Administrator'">
                <q-card-section class="q-pt-none">
                    <q-input label="Name" dense v-model="itemName" autofocus />
                </q-card-section>
            </template>

            <template v-if="isAuthenticated && userRole==='IT Teacher'">
                <q-card-section class="q-pt-none">
                    <q-input label="Name" dense v-model="itemName" readonly />
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
                <q-btn flat label="Cancel" @click="closeDialog" />
                <q-btn color="blue" label="Save" @click="saveChanges" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            title: '',
            nameLabel: '',
            showDialog: true,
            itemId: 0,
            itemName: '',
            isItemActive: true,
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
        // e.g. "Update Category" or "Update Priority"
        this.title = `Update ${this.type}`;
        // set variables used for save api later
        this.itemId = this.id;
        this.itemName = this.name;
        this.isItemActive = this.isActive;
    },
    methods: {
        closeDialog() {
            // hide dialog
            this.showDialog = false;
            // notify parent component to close dialog
            this.$emit("close-dialog", false);
        },
        saveChanges() {
            // create dynamic property name
            // e.g. TICKET_CATEGORY_ID or TICKET_PRIORITY_ID
            const idPropertyName = `TICKET_${this.type.toUpperCase()}_ID`;
            // e.g. TICKET_CATEGORY_ID or TICKET_PRIORITY_DESC
            const descPriortyName = `TICKET_${this.type.toUpperCase()}_DESC`;

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
      ...mapGetters('auth', ['isAuthenticated', 'userEmail', 'userFirstName', 'userRole']),
    }
};
</script>
