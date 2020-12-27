<template>
  <b-container class="text-center">
    <h1>Token Geyser</h1>

    <p>Get sprinkled with tokens.</p>

    <b-row>
      <b-col md="4" offset-md="4">
        <b-card bg-variant="info" text-variant="white" header="Staked" class="text-center">
          <b-card-text>
            <p>
              <strong>ST tokens in Geyser:</strong> {{Number(getLockedStakingTokens).toFixed(2)}}
            </p>

            <p>
              <strong>Your staking tokens:</strong> 0
            </p>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="info" text-variant="white" header="Rewards" class="text-center">
          <b-card-text>
            <p>
              <strong>RT tokens in Geyser:</strong> {{Number(getLockedRewardTokens).toFixed(2)}}
            </p>

            <p>
              <strong>Your RT tokens:</strong> 0
            </p>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="success" text-variant="white" header="Deposit ST tokens" class="text-center">

          <b-form @submit.prevent="onDepositStakingTokensSubmit">
            <b-form-group id="input-group-st-lock">

              <b-input-group append="ST" class="mt-1 mb-2">
                <b-form-input 
                  id="st-lock-value-field" 
                  v-model="stValue" 
                  type="text" 
                  required 
                  value=0
                  trim
                >
                </b-form-input>
              </b-input-group>

              <b-form-text text-variant="white">
                Your balance is <strong>{{ getStakingTokenBalance }} ST</strong> tokens.
              </b-form-text>

              <b-button class="m-2" type="submit" variant="light" :disabled="isStakingAllowanceBigEnough">Approve</b-button>
              <b-button class="m-2" type="submit" variant="light" :disabled="!isStakingAllowanceBigEnough">Submit</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="danger" text-variant="white" header="Withdraw (ST & RT)" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import stData from "../contracts/StakingToken.json";

export default {
  name: "Main",
  computed: {
    ...mapGetters("accounts", ["activeAccount"]),
    ...mapGetters("allowance", ["getStakingAllowance"]),
    ...mapGetters("contracts", ["getContractData"]),
    ...mapGetters("drizzle", ["drizzleInstance"]),
    ...mapGetters("geyser", ["getLockedRewardTokens", "getLockedStakingTokens"]),
    ...mapGetters("profile", ["getStakingTokenBalance"]),

    isStakingAllowanceBigEnough() {
      if (this.getStakingAllowance == 0) {
        return false;
      } else if (this.stValue > this.getStakingAllowance) {
        return false;
      }

      return true;
    }
  },
  created() {
    this.$store.dispatch("geyser/fetchLockedRewardTokens");
    this.$store.dispatch("geyser/fetchLockedStakingTokens");
    this.$store.dispatch("profile/fetchStakingTokenBalance");
    this.$store.dispatch("allowance/fetchStakingAllowance");
  },
  data() {
    return {
      stValue: 0
    }
  },
  methods: {
    ...mapActions("geyser", ["fetchLockedRewardTokens"]),
    ...mapActions("geyser", ["fetchLockedStakingTokens"]),
    ...mapActions("profile", ["fetchStakingTokenBalance"]),
    ...mapActions("allowance", ["fetchStakingAllowance"]),

    async onDepositStakingTokensSubmit() {
        let component = this;
        let geyserContract = this.drizzleInstance.contracts.TokenGeyser;
        let web3 = this.drizzleInstance.web3;

        let stTokensWei = web3.utils.toWei(this.stValue, 'ether');

        if (!this.isStakingAllowanceBigEnough) {
          // get staking token address
          let stakingToken = await geyserContract.methods.getStakingToken().call();

          // fetch Staking Token contract
          let stContract = new web3.eth.Contract(stData.abi, stakingToken);

          // set token spending approval
          await stContract.methods.approve(geyserContract.address, stTokensWei).send({
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
              stContract.once("Approval", {
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
                  component.$toasted.show('The Approval transaction has succeeded! Now you can submit the staking tokens.', {
                    type: 'success',
                    duration: 9000,
                    theme: "bubble",
                    position: "top-center"
                  });

                  component.fetchStakingAllowance(); // refresh the st allowance count
                }
              });

              
            }
          });
        } else {
          this.drizzleInstance.contracts["TokenGeyser"].methods["stake"].cacheSend(
            stTokensWei, 
            this.drizzleInstance.web3.utils.hexToBytes("0x0000000000000000000000000000000000000000") // empty calldata
          );
        }
      }
  }
}
</script>

<style>

</style>