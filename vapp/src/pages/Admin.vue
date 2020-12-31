<template>
  <b-container class="text-center">
    <h1>Admin page</h1>
    <p>This page is visible to the smart contract owner only.</p>

    <b-alert show variant="danger" v-if="!isActiveUserAdmin">
      <b-icon icon="exclamation-triangle-fill"></b-icon> &#9;
      You are <strong>not</strong> the owner of this smart contract!
      <b-icon icon="exclamation-triangle-fill"></b-icon> &#9;
    </b-alert>

    <b-row class="mt-1" v-if="isActiveUserAdmin">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="success" text-variant="white" header="Add reward tokens" class="text-center">
          <b-card-text>
            Add the reward amount and determine the length of farming.
          </b-card-text>

          <b-form @submit.prevent="onAddRewardTokensSubmit">
            <b-form-group id="input-group-rt-lock">

              <b-input-group append="seconds" class="mt-1 mb-2">
                <b-form-input 
                  id="rt-lock-length-field" 
                  v-model="rtLength" 
                  type="text" 
                  required 
                  trim
                >
                </b-form-input>
              </b-input-group>

              <b-input-group append="RT" class="mt-1 mb-2">
                <b-form-input 
                  id="rt-lock-value-field" 
                  v-model="rtValue" 
                  type="text" 
                  required 
                  value=0
                  trim
                >
                </b-form-input>
              </b-input-group>

              <b-form-text text-variant="white">
                Your balance is <strong>{{ getRewardTokenBalance }} RT</strong> tokens.
              </b-form-text>

              <b-button class="m-2" type="submit" variant="light" :disabled="isAllowanceBigEnough">Approve</b-button>
              <b-button class="m-2" type="submit" variant="light" :disabled="!isAllowanceBigEnough">Submit</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import rwData from "../contracts/RewardToken.json";

export default {
  name: "Admin",
  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("allowance", ["getRewardAllowance"]),
    ...mapGetters("contracts", ["getContractData"]),
    ...mapGetters("drizzle", ["drizzleInstance"]),
    ...mapGetters("profile", ["getRewardTokenBalance"]),

    isActiveUserAdmin() {
      let owner = this.getContractData({
        contract: "TokenGeyser",
        method: "owner"
      });

      if (owner === "loading") return "0";

      if (owner === this.activeAccount) {
        return true;
      } else {
        return false;
      }
    },
    
    isAllowanceBigEnough() {
      if (this.getRewardAllowance == 0) {
        return false;
      } else if (this.rtValue > this.getRewardAllowance) {
        return false;
      }

      return true;
    }
  },
  created() {
    this.$store.dispatch("profile/fetchRewardTokenBalance");
    this.$store.dispatch("allowance/fetchRewardAllowance");

    this.$store.dispatch("drizzle/REGISTER_CONTRACT", {
      contractName: "TokenGeyser",
      method: "owner",
      methodArgs: []
    });
  },
  data() {
    return {
      rtValue: 0,
      rtLength: 0
    }
  },
  methods: {
      ...mapActions("profile", ["fetchRewardTokenBalance"]),
      ...mapActions("allowance", ["fetchRewardAllowance"]),

      async onAddRewardTokensSubmit() {
        let component = this;
        let geyserContract = this.drizzleInstance.contracts.TokenGeyser;
        let web3 = this.drizzleInstance.web3;

        let rwTokensWei = web3.utils.toWei(this.rtValue, 'ether');

        if (!this.isAllowanceBigEnough) {
          // get reward token address
          let rewardToken = await geyserContract.methods.getDistributionToken().call();

          // fetch Reward Token contract
          let rwContract = new web3.eth.Contract(rwData.abi, rewardToken);

          // set token spending approval
          await rwContract.methods.approve(geyserContract.address, rwTokensWei).send({
            from: this.activeAccount
          }, function(error, hash){
            if (error) {
              // create an error toast
              component.$toasted.show('The transaction has been rejected. Please try again.', {
                type: 'error',
                duration: 9000,
                theme: "bubble",
                position: "top-center"
              });
            }
            if (hash) {
              // subscribe to the approval event
              rwContract.once("Approval", {
                filter: { owner: component.activeAccount }
              }, function(error, event){ 
                if (error) {
                  // create an error toast
                  component.$toasted.show('The Approval transaction has failed. Please try again, perhaps with a higher gas limit.', {
                    type: 'error',
                    duration: 9000,
                    theme: "bubble",
                    position: "top-center"
                  });
                }

                if (event) {
                  component.$toasted.show('The Approval transaction has succeeded! Now you can submit the reward tokens.', {
                    type: 'success',
                    duration: 9000,
                    theme: "bubble",
                    position: "top-center"
                  });

                  component.fetchRewardAllowance(); // refresh the rw allowance count
                }
              });

              
            }
          });
        } else {
          this.drizzleInstance.contracts["TokenGeyser"].methods["lockTokens"].cacheSend(rwTokensWei, this.rtLength);
        }
      }
  }
}
</script>

<style>

</style>