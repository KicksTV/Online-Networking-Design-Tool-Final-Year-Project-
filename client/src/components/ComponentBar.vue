<template>
    <div id="components-container" class="">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul id="navbar-component-links" class="navbar-nav mr-auto">
                <li class="nav-item active"><a class="nav-link">Components</a></li>
                <li class="nav-item active"><a class="nav-link">Connections</a></li>
            </ul>
        </nav>
        <div id="rightSidePanel"></div>
        <nav id="componentsNav" class="navbar navbar-expand-lg shadow">
            <li style="display: inline-block;">
                <img @click="createNewComponent(this)" alt="Access_Point icon" src="@/assets/img/pc.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/laptop.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/smartphone.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/printer.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/server.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/switch.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/router.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/cloud.svg" class="componentImg" draggable="false">
            </li>
            <li style="display: inline-block;">
                <img alt="Access_Point icon" src="@/assets/img/wireless-access-point.svg" class="componentImg" draggable="false">
            </li>

        </nav>
    </div>
</template>

<script>
    export default {
        name: "ComponentBar",
        props: {

        },
        methods: {
            createNewComponent: (component) => {
                console.log(component)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>