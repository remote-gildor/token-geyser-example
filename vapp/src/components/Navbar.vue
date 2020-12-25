<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-3">

    <router-link to="/">
      <b-navbar-brand href="/">TokenGeyser</b-navbar-brand>
    </router-link>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <router-link to="/profile"><b-nav-item href="/profile">Profile</b-nav-item></router-link>
        <router-link to="/admin"><b-nav-item href="/admin">Admin</b-nav-item></router-link>
      </b-navbar-nav>
    </b-collapse>
    
  </b-navbar>
</template>

<script>
export default {
 name: "Navbar"
}
</script>

<style>

</style>