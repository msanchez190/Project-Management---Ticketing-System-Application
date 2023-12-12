<template>
    <div class="q-pa-md q-gutter-sm" style="margin-left: 15px; margin-right: 15px;">
        <q-card class="requests-card">
            <q-card-section class="text-white" style="background-color: #af0000;">
                <div class="text-h6 text-left"> Manage Users </div>
            </q-card-section>
            <q-separator />

            <q-btn
                @click="$router.push('/settings')" outline icon="arrow_back_ios" text-color="secondary" label="Back" 
                style="margin-top: 30px ; margin-left: 20px; margin-bottom: 15px;"
            />

            <div style="margin-left: 2%;">
                <div class="q-pa-md" style="margin: 0 auto;">
                    <!-- Users Table -->

                    <q-table title="Users" v-if="userRole==='System Administrator' || userRole==='IT Teacher'" :key="tableKey" color="secondary" :align="left" :loading="loading "
                        :rows="userData" :columns="userColumns" style="width: 98%;"> <!-- Puts table with user data -->
                        <template v-slot:top-right>
                            <q-btn
                            v-if="userRole==='IT Teacher' || userRole==='System Administrator'"
                            size="1rem"
                            flat
                            color="secondary"
                            class="q-mt-sm q-mr-md"
                            no-caps
                            icon="person_add"
                            label="Create New User"
                            @click="createNewUser()"
                            />
                        </template>
                        <template #body-cell-status="props">
                                    <q-td :props="props">
                                        <q-chip :color="props.row.ACTIVE_STATUS_ID === 1 ? 'green' : 'red'"
                                            text-color="white" dense class="text-weight-bolder" square>{{
                                                props.row.ACTIVE_STATUS_DESC }}</q-chip>
                                    </q-td>
                                </template>
                                <template v-if="userRole==='System Administrator' || userRole==='IT Teacher'" v-slot:body-cell-actions="props">
                                    <q-td :props="props">
                                        <q-btn dense round flat @click=editUserDialog(props) icon="fa-regular fa-pen-to-square"
                                            style="color: #ad0000;"></q-btn>
                                    </q-td>
                                </template>
                                <template v-if="userRole==='System Administrator' || userRole==='IT Teacher'" v-slot:body-cell-changePass="props" > <!-- On click will bring out dialog box change password-->
                                    <q-td :props="props">
                                        <q-btn dense round flat @click=changePasswordDialog(props) icon="fa-solid fa-lock"
                                            style="color: #ad0000;"></q-btn>
                                    </q-td>
                                </template>
                    </q-table>

                    <!-- Only valid users are able to select this role-->
                </div>
                <template> <!-- Edit user dialog box, except password-->
                    <q-dialog v-model="this.editItemDial" persistent>
                        <q-card style="min-width: 350px;">
                        <q-card-section class="row items-center" style="background-color: #af0000">
                            <div class="text-h6" style="color: white;">Edit User</div>
                        </q-card-section>

                        <q-card-section> <!-- Show user information that can be edited-->
                        <q-avatar color="white" text-color="white">
                            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                        </q-avatar>
                        <q-input label="First Name: " dense v-model="editedItem.END_USER_FIRST_NAME"></q-input>
                        <q-input label="Last Name: " dense v-model="editedItem.END_USER_LAST_NAME"></q-input>
                        <q-input label="Email" dense v-model="editedItem.END_USER_EMAIL"></q-input>

                        <q-select v-model="this.editedItem.USER_ROLE_NAME" label="Role"
                        :options="user_roles" option-value="USER_ROLE_ID" 
                        option-label="USER_ROLE_NAME"
                        :rules="[val => !!val || 'Field is required']">
                        </q-select>

                        <q-select v-model="editedItem.END_USER_PERIOD" label="Class Period"
                        :options="period_options" option-value="value" 
                        option-label="label"
                        :rules="[val => !!val || 'Field is required']">
                        </q-select>
                        </q-card-section>

                        
                        <q-card-section> <!-- Toggle active and inactive Status of User-->
                            <q-toggle label="Status"
                                v-model="editedItem.ACTIVE_STATUS_DESC"
                                checked-icon="check"
                                color="green"
                                unchecked-icon="clear"
                                left-label
                                false-value="INACTIVE"
                                true-value="ACTIVE"
                            />
                            {{ editedItem.ACTIVE_STATUS_DESC }}
                        </q-card-section>

                        <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <!-- On confirmation will execute deletion-->
                        <q-btn flat label="Confirm" color="primary" @click="editUser()" v-close-popup />
                        </q-card-actions>
                    </q-card>
                    </q-dialog>
                </template>

                <template> <!-- Change Password Dialog-->
                    <q-dialog v-model="changePassDial" persistent>
                        <q-card style="min-width: 450px;">
                        <q-card-section class="row items-center" style="background-color: #af0000">
                            <div class="text-h6" style="color: white">Change Password</div>
                        </q-card-section>
                        <q-card-section>
                        <q-avatar icon="warning" color="white" text-color="warning" size="" />
                        <span class="text-body2 q-mt-lg">Change password for user
                            {{this. editedItem.END_USER_FIRST_NAME + " " +  this.editedItem.END_USER_LAST_NAME}} ?</span>
                        </q-card-section>
                        <div >
                            <q-input class="q-pa-sm" v-model="editedItem.password" label="Password" 
                            :type="isPwd ? 'password' : 'text'" 
                            :rules="[val => !!val || 'Field is required']">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" 
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd">
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="q-pa-sm">
                            <q-input class="text-body2 q-mt-lg" v-model="editedItem.confirmPassword" label="Confirm Password" 
                                :type="isPwd ? 'password' : 'text'" 
                                :rules="[val => !!val || 'Field is required']">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" 
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd">
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>

                        <q-card-actions>
                        <q-btn align="center" flat label="Cancel" color="primary" v-close-popup />
                        <!-- On confirmation will execute deletion-->
                        <q-btn flat label="Confirm" color="primary" @click="changePassword(this.END_USER_ID)" />
                        </q-card-actions>
                    </q-card>
                    </q-dialog>
                </template>
            </div>
        </q-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { ref } from 'vue';

const apiURL = import.meta.env.VITE_API_URL

export default {
    setup(){
        return{
            editItemDial:ref(false),
            changePassDial:ref(false),
            isPwd: ref(true),
            loading: ref(true),
        }
    },
    beforeMount() {
        this.getUsers()
    },
    data () {
        return {
            tableKey : 0, //will be used to re-render table
            editedItem:{
                END_USER_ID: "",
                END_USER_FIRST_NAME: "",
                END_USER_LAST_NAME: "",
                END_USER_EMAIL:"",
                USER_ROLE_ID:"",
                USER_ROLE_NAME:"",
                ACTIVE_STATUS_DESC:"",
                ACTIVE_STATUS_ID: "",
                END_USER_PERIOD: "",
                password:"",
                confirmPassword :"",
                
            },
            userData: [], //Will hold all users data to put into tables
            user_roles: [], //Will hold available user_roles
            pre_changeUser_Period: "",
            pre_changeUser_Role:"",
            pre_changeUser_Status:"",
            period_options: [//Manual, but will hold user periods
                {label: '1', value: 1},
                {label: '2', value: 2},
                {label: '3', value: 3},
                {label: '4', value: 4},
                {label: '5', value: 5},
                {label: '6', value: 6},
                {label: '7', value: 7},
                {label: '8', value: 8}
            ],

            userColumns : [ //Table template
            {name: 'First Name', required: true, label: 'First Name', field: 'END_USER_FIRST_NAME', align: 'left'}, 
            {name: 'Last Name', label: 'Last Name', field: 'END_USER_LAST_NAME', align: 'left'},
            {name: 'Email', label: 'Email', field: 'END_USER_EMAIL', align: 'left'},
            {name: 'User Role', label: 'Role', field: 'USER_ROLE_NAME', align: 'left'},
            {name: "status", align: "center", label: "Status", field: "ACTIVE_STATUS_DESC", sortable: true},
            {name: 'actions', label: 'Edit', field: '', align: 'left' },
            {name: 'changePass', label: 'Change Password', field: '', align: 'center' },            
            ],

        }
    },
    methods: {
        getUsers(){
            axios.get(`${apiURL}/endusers`).then((res) => { //Loads data when creating the page
            this.userData = res.data;
            this.rerenderTable;
            this.loading = false;
        })},
        getRoles(){
            axios.get(`${apiURL}/roles`).then((res) => {
            this.user_roles = res.data
            })
        },
        createNewUser() {
            this.$router.push('/createUser');
        },
        rerenderTable(){//rerenders page
            this.tableKey +=1;
            //document.location.reload(true);
            console.log("rendered table");
        },
        editUserDialog(item){ //Puts values into appropriate fields in dialog box
            this.editItemDial = true;
            console.log("access here");

            //Puts all current values into dialogue box
            this.editedItem.END_USER_ID = item.row.END_USER_ID;
            this.editedItem.END_USER_FIRST_NAME = item.row.END_USER_FIRST_NAME;
            this.editedItem.END_USER_LAST_NAME = item.row.END_USER_LAST_NAME;
            this.editedItem.END_USER_EMAIL = item.row.END_USER_EMAIL;
            this.editedItem.USER_ROLE_ID = item.row.USER_ROLE_ID;
            this.editedItem.USER_ROLE_NAME = item.row.USER_ROLE_NAME;
            this.editedItem.ACTIVE_STATUS_DESC = item.row.ACTIVE_STATUS_DESC;
            this.editedItem.ACTIVE_STATUS_ID = item.row.ACTIVE_STATUS_ID;
            this.editedItem.END_USER_PERIOD = item.row.END_USER_PERIOD;

            this.pre_changeUser_Role = item.row.USER_ROLE_NAME; //Will be user for a comparison
            this.pre_changeUser_Status = item.row.ACTIVE_STATUS_DESC; //Will be user for a comparison
            this.pre_changeUser_Period = item.row.END_USER_PERIOD;//Used for comparison
            
            this.getRoles();
        },
        editUser() { //Once customer presses confirm on dialog box, pushed changes to DB
            if(this.editedItem.ACTIVE_STATUS_DESC == "ACTIVE"){//Ony two values, placed into code
                this.editedItem.ACTIVE_STATUS_ID = 1;
            }
            else if(this.editedItem.ACTIVE_STATUS_DESC == "INACTIVE"){
                this.editedItem.ACTIVE_STATUS_ID = 2;
            }  
 
            if(this.editedItem.END_USER_PERIOD != this.pre_changeUser_Period){//Updates changes correctly
                this.editedItem.END_USER_PERIOD = this.editedItem.END_USER_PERIOD.value;
               
            }

            if(this.editedItem.USER_ROLE_NAME != this.pre_changeUser_Role){ //Check to see if there are changes
                    this.editedItem.USER_ROLE_ID = this.editedItem.USER_ROLE_NAME.USER_ROLE_ID; //Updates changes to correctly
                    this.editedItem.USER_ROLE_NAME = this.editedItem.USER_ROLE_NAME.USER_ROLE_NAME;                        
                    }

            const isEmailValid = this.validateEmail(this.editedItem.END_USER_EMAIL);//validate email
            if(isEmailValid === true){
                    const updatedUser = {
                    END_USER_ID: this.editedItem.END_USER_ID, 
                    END_USER_FIRST_NAME: this.editedItem.END_USER_FIRST_NAME,
                    END_USER_LAST_NAME: this.editedItem.END_USER_LAST_NAME,
                    END_USER_EMAIL: this.editedItem.END_USER_EMAIL,
                    USER_ROLE_ID: this.editedItem.USER_ROLE_ID,
                    USER_ROLE_NAME: this.editedItem.USER_ROLE_NAME,
                    ACTIVE_STATUS_DESC: this.editedItem.ACTIVE_STATUS_DESC,
                    ACTIVE_STATUS_ID: this.editedItem.ACTIVE_STATUS_ID,
                    END_USER_PERIOD: this.editedItem.END_USER_PERIOD,
                    }

                    console.log(updatedUser);
                    axios.put(`${apiURL}/enduser/${updatedUser.END_USER_ID}`, updatedUser).then((res) => { //deletes from database
                    
                        if (res.status === 200) {
                            this.$q.notify({ color: 'positive', message: 'User updated successfully.' });
                            window.location.reload();
                            this.$router.push('/users');
                        } 
                        else {
                            this.$q.notify({ color: 'negative', message: 'Error while updating.' });
                            }
                    });

                }
                else{
                    this.$q.notify({ color: 'negative', message: 'Email is not valid. Please try again.' });
                    this.editedItem.END_USER_EMAIL = '';
                }            

                this.rerenderTable();
        },
        changePasswordDialog(item){
            this.changePassDial = true;
            this.editedItem.password = ""; //blanks passwords each time dialog box comes up
            this.editedItem.confirmPassword = "";
            this.editedItem.END_USER_ID = item.row.END_USER_ID;
            this.editedItem.END_USER_FIRST_NAME = item.row.END_USER_FIRST_NAME;
            this.editedItem.END_USER_LAST_NAME = item.row.END_USER_LAST_NAME;
        },
        changePassword(){//After confirm button is pressed, updates password
            const isPasswordValid = this.validatePassword(this.editedItem.password); //validates password
            console.log(isPasswordValid)
            
            if (isPasswordValid === false) { //is invalid, will return to dialog box and blank out both input boxes
                    this.editedItem.password = "";
                    this.editedItem.confirmPassword = "";
                    return;
            }


            if (this.editedItem.password === this.editedItem.confirmPassword) {//if valid will skip over above and run the put request
                    const updatePass = {
                        END_USER_PASSWORD: this.editedItem.password,
                        END_USER_ID: this.editedItem.END_USER_ID,
                    };

                    axios.put(`${apiURL}/updatePassword/${this.editedItem.END_USER_ID}`, updatePass).then((res) => {
                    
                    if (res.status === 200) {
                        this.$q.notify({ color: 'positive', message: 'Password updated successfully.' });
                        this.$router.push('/users');
                        this.changePassDial = false;
                    } 
                    else {
                        this.$q.notify({ color: 'negative', message: 'Error while updating password.' });
                        }
                    });    
                    
                } 
            else {
                    this.$q.notify({ color: 'negative', message: 'Passwords do not match' });
                    this.editedItem.password = '';
                    this.editedItem.confirmPassword = '';
                }
            },
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidEmail = emailRegex.test(email);

            if (!isValidEmail) {
                this.$q.notify({ color: 'negative', message: 'Invalid email format' });
            }

            return isValidEmail;
        },
        validatePassword(password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
            const isValidPassword = passwordRegex.test(password)
            if (!isValidPassword) {
                this.$q.notify({ color: 'negative', message: 'Invalid password format' });
            }

            return isValidPassword
        }, 
    },
    computed: {
      ...mapGetters('auth', ['userRole']),

    },
}
</script>

<style scoped>

</style>

<style lang="sass">
</style>