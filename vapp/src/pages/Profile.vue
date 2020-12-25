<template>
  <b-container class="text-center">
    <h1>Profile</h1>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">

        <b-card class="mb-2">

          <Gravatar class="img-fluid" :email="activeAccount" default-img="robohash" :size=200 />

          <b-card-text class="mt-2">
            <p>{{ activeAccount }}</p>
            <p><strong>Your ETH balance:</strong> {{ Number(getEthBalance).toFixed(4) }} ETH</p>
            <p><strong>Your ST balance:</strong> {{ Number(getStakingTokenBalance).toFixed(2) }} ST</p>
          </b-card-text>

        </b-card>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Gravatar from "vue-gravatar";

export default {
  name: "Profile",
  components: {
        Gravatar
    },
    computed: {
        ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
        ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
        ...mapGetters("profile", ["getStakingTokenBalance"]),
        userAccount() {
            return this.activeAccount
        },
        getEthBalance() {
            return this.drizzleInstance.web3.utils.fromWei(this.activeBalance, "ether");
        }
    },
    created() {
        this.$store.dispatch("profile/fetchStakingTokenBalance");
    },
    methods: {
        ...mapActions("profile", ["fetchStakingTokenBalance"])
    }
}
</script>

<style>

</style>