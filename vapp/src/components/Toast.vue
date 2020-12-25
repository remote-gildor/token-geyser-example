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
      if (data._from == this.activeAccount) {
        let display = `${contractName}(${eventName}) - ${data}`;
        let subOptions;

        if (eventName === 'Staked') {
          display = "You have just staked " + data.amount + " tokens.";

          subOptions = {
            theme: "bubble",
            position: "top-center", 
            duration: 5000,
            type: "success"
          };
        }

        if (eventName === 'Unstaked') {
          display = "You have unstaked " + data.amount + " tokens.";

          subOptions = {
            theme: "bubble",
            position: "top-center", 
            duration: 5000,
            type: "error"
          };
        }

        this.$toasted.show(display, subOptions);
      }  
    };

    this.$drizzleEvents.$on('drizzle/contractEvent', payload => {
      contractEventHandler(payload);
    });
  }
}
</script>
