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

        if (eventName === 'ValueSet') {
          display = "You have set the value to " + data.val + "!";
        }

        const subOptions = {
          theme: "bubble",
          position: "top-center", 
          duration: 5000,
          type: "success"
        };

        this.$toasted.show(display, subOptions);
      }  
    };

    this.$drizzleEvents.$on('drizzle/contractEvent', payload => {
      contractEventHandler(payload);
    });
  }
}
</script>
