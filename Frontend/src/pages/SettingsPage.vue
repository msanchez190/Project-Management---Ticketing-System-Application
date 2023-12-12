
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card class="my-card q-ma-lg">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">Index</div>
        </q-card-section>
        <q-separator />

        <div class="section-text">Manage</div>
        <q-separator inset="item" />
        <div class="row q-ml-sm">
          <q-card
            class="settings-card text-black cursor-pointer relative-position bg-white shadow-5"
            @click="$router.push('/maincategories')"
          >
            <q-card-section>
              <div class="menu-text text-weight-bold">
                <q-icon class="q-mb-xs" name="list" size="1.5rem" /> Main Ticket
                Categories
              </div>

              <div class="text-subheading text-center">
                View and Edit Main Category Data
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="settings-card text-black cursor-pointer relative-position bg-white shadow-5"
            @click="$router.push('/hardwarecategories')"
          >
            <q-card-section>
              <div class="menu-text text-weight-bold">
                <q-icon class="q-mb-xs" name="devices" size="1.5rem" /> Hardware
                Subcategories
              </div>
              <div class="text-subheading text-center">
                View and Edit Hardware Subcategory Data
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="settings-card text-black cursor-pointer relative-position bg-white shadow-5"
            @click="$router.push('/softwarecategories')"
          >
            <q-card-section>
              <div class="menu-text text-weight-bold">
                <q-icon class="q-mb-xs" name="apps" size="1.5rem" /> Software
                Subcategories
              </div>
              <div class="text-subheading text-center">
                View and Edit Software Subcategory Data
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="userRole!='Technician'" class="section-text">Users and Roles</div>

        <!--
            User management section
        -->
        <q-separator inset="item" />
        <div v-if="userRole!='Technician'" class="row q-ml-sm">
          <q-card
            class="settings-card text-black cursor-pointer relative-position bg-white shadow-5"
            @click="$router.push('/users')"
          >
            <q-card-section>
              <div class="menu-text text-weight-bold">
                <q-icon class="q-mb-xs" name="group" size="1.5rem" /> Manage
                Users
              </div>
              <div class="text-subheading text-center">View and Edit Users</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
      ...mapGetters('auth', ['userRole']),
    }
}
</script>

<style scoped>
.text-h7 {
  margin: 15px;
  font-weight: bold;
  margin-top: 30px;
}

.q-separator--horizontal-item-inset {
  margin-left: 0;
  margin-right: 0;
}

.settings-card {
  margin: 20px;
  width: 300px;
  border-style: solid;
  border-color: #a62626;
  border-width: 1px;
}

.text-subheading {
  margin-top: 10px;
}

.q-icon {
  margin-right: 8px;
}
.text-subtitle1 {
  font-size: 1.5rem;
}

.menu-text {
  font-size: 0.9rem;
  color: #444444;
}
.section-text {
  margin: 15px;
  margin-top: 20px;
  font-weight: bold;
  font-size: 1rem;
}
</style>
