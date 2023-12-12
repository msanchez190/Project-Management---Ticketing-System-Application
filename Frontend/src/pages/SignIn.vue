<template>
    <q-layout view="hHh lpR fFf" class="">
        <q-header class="q-py-xs shadow-2" height-hint="58" style="background-color: #666262;">
            <q-toolbar>

                <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs" to="/">
                    <img src="https://i.imgur.com/efL132D.png" style="margin-left: 8px; margin-top: 10px; height: 70px;">
                </q-btn>

                <q-space />
                
                <div>
                    <h5 style="font-weight: bold;"> IT Helpdesk</h5>
                </div>

                <q-space />

                <div>
                    <h5 style="color: #666262;"> IT Helpdesk</h5>
                </div>

            </q-toolbar>
        </q-header>
    
        <div class="signin-container">
            <div class="signin-form">
                <q-form @submit="performLogin">
                    <div class="form-header">
                        <q-icon name="person" size="2em" class="q-mr-sm" />
                        Login
                    </div>
                    <div class="form-group">
                        <q-input v-model="email" label="Email" 
                        type="email"
                        :rules="[val => !!val || 'Field is required']">
                        </q-input>
                    </div>
                    <div class="form-group">
                        <q-input v-model="password" label="Password" 
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
                    <div class="button-group">
                        <q-btn
                            type="submit"
                            label="Login"
                            color="blue"
                            style="width: 40%;"
                        ></q-btn>
                    </div>
                </q-form>
            </div>
        </div>

        <q-footer style="background-color: #666262; height: 200px;">
            <q-toolbar>

                <div class="q-ml-xl q-mt-xl">
                    <a  href="https://www.clevelandisd.org/" class="text-h6 custom-link">
                        Cleveland ISD
                    </a>
                    <div class="q-mt-sm">
                        316 East Dallas
                    </div>
                    <div class="q-mt-sm">
                        Cleveland, TX 77327 
                    </div>
                    <div class="q-mt-sm">
                        (281) 592-8717
                    </div>
                </div>

                <q-space />

                <div>
                    <div class="text-h6" style="font-style: italic;">
                        Links and Resources
                    </div>
                    <div class="q-mt-sm">
                        <a href="https://www.clevelandisd.org/privacy-policy" class="custom-link-2">
                            Privacy Policy
                        </a>
                        <a href="https://www.clevelandisd.org/accessibility-statement" class="custom-link-2">
                            Accessibility
                        </a>
                    </div>
                    <div class="q-mt-sm">
                        <a href="https://www.clevelandisd.org/site-map" class="custom-link-2">
                            Site Map
                        </a>
                    </div>

                </div>

                <q-space />
                    
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script>
import { ref } from 'vue'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            email: '',
            password: '',
        }
    },

    methods: {
        ...mapActions('auth', ['login']),

        async performLogin() {
            try{
                const tryLogin = await this.login({ email: this.email, password: this.password })
                
                if(tryLogin) {
                    if(tryLogin.isAuthenticated) {
                        this.$router.push('/dashboard')
                        this.$q.notify({color: 'positive', message:'Login Success' })
                    } else {
                        this.$q.notify({ color: 'negative', message: 'Login Failed'})
                        this.email = '';
                        this.password = ''
                    }
                } else {
                    this.$q.notify({ color: 'negative', message: 'Login Failed'})
                    this.email = '';
                    this.password = ''
                }
                               
            } catch (error) {
                console.error(error)
            }
        },
    },

    setup () {
        return {
            isPwd: ref(true),
        }
    }

}
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.signin-form {
  width:350px;
  padding: 20px;
  background-color: #fff;
}

.form-header{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: large;
    font-weight: bold;
    padding: 10px;
    color: #666262;
}

.form-group {
  margin-bottom: 30px;
}

.custom-link{
    color: white;
    text-decoration: none;
    font-style: italic;
}

.custom-link:hover {
    text-decoration: underline;
}

.custom-link-2 {
    color: white;
    text-decoration: none;
}

.custom-link-2:nth-child(1) {
    margin-right: 60px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

</style>