<template>
  <b-container class="text-center">
    <h1>Admin page</h1>
    <p>This page is visible to the smart contract owner only.</p>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="success" text-variant="white" header="Add reward tokens" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="4">
        <b-card bg-variant="danger" text-variant="white" header="Rescue tokens" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Admin"
}
</script>

<style>

</style>