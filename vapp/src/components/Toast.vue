<template>
  <section></section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters("drizzle", ["drizzleInstance"]),
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
  },
  mounted() {
    const contractEventHandler = ({ contractName, eventName, data }) => {
      let web3 = this.drizzleInstance.web3;
      let display = `${contractName}(${eventName}) - ${data}`;
      let subOptions;

      if (data.user == this.activeAccount) { // if event has the user field

        if (eventName === 'Staked') {
          let amount = web3.utils.fromWei(data.amount, "ether");
          display = "You have just staked " + amount + " tokens.";

          subOptions = {
            theme: "bubble",
            position: "top-center", 
            duration: 5000,
            type: "success"
          };

          this.$store.dispatch("profile/fetchStakingTokenBalance");
          this.$store.dispatch("geyser/fetchLockedStakingTokens");
          this.$store.dispatch("geyser/fetchCurrentUserStakingBalance");
          this.$store.dispatch("allowance/fetchStakingAllowance");
        }

        if (eventName === 'Unstaked') {
          let amount = web3.utils.fromWei(data.amount, "ether");
          display = "You have unstaked " + amount + " tokens.";

          subOptions = {
            theme: "bubble",
            position: "top-center", 
            duration: 5000,
            type: "error"
          };

          this.$store.dispatch("profile/fetchStakingTokenBalance");
          this.$store.dispatch("geyser/fetchLockedStakingTokens");
        }

      }  

      if (eventName === 'TokensLocked') {
        let amount = web3.utils.fromWei(data.amount, "ether");
        display = "You have added " + amount + " reward tokens in the geyser.";

        subOptions = {
          theme: "bubble",
          position: "top-center", 
          duration: 5000,
          type: "success"
        };

        this.$store.dispatch("geyser/fetchLockedRewardTokens");
        this.$store.dispatch("profile/fetchRewardTokenBalance");
        this.$store.dispatch("allowance/fetchRewardAllowance");
      }

      this.$toasted.show(display, subOptions);
    };

    this.$drizzleEvents.$on('drizzle/contractEvent', payload => {
      contractEventHandler(payload);
    });
  }
}
</script>
