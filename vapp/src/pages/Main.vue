<template>
  <b-container class="text-center">
    <h1>Token Geyser</h1>

    <p>Get sprinkled with tokens.</p>

    <b-row>
      <b-col md="4" offset-md="4">
        <b-card bg-variant="info" text-variant="white" header="Info" class="text-center">
          <b-card-text>
            <p>
              <strong>Your deposited tokens:</strong> 0
            </p>

            <p>
              <strong>TOTAL deposited tokens:</strong> 0
            </p>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="success" text-variant="white" header="Deposit" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="danger" text-variant="white" header="Withdraw" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Main",
  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("contracts", ["getContractData"]),
    ...mapGetters("drizzle", ["drizzleInstance"]),
  },
  created() {

  },
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>