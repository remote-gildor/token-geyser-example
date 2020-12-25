import Vue from "vue";
import Router from "vue-router";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

Vue.use(Router);

export default new Router({
    
    mode: 'history', // configure server to handle the history mode (otherwise use the 'hash' mode)

    routes: [
        {
            path: "/",
            name: "main",
            component: Main
        },

        {
            path: "/token-geyser-example", // this is needed because of GH Pages
            name: "ghpages",
            component: Main
        },

        {
            path: "/profile",
            name: "profile",
            component: Profile
        },

        {
            path: "/admin",
            name: "admin",
            component: Admin
        }
    ]
});
