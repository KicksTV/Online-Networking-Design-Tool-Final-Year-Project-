<template>
    <input autocomplete="off" class="table-editor__input form-control" :id="id" :placeholder="placeholder" :name="name" :type="_type"
           @input="$emit('update-value', $event)" :value="storedValue" :tabindex="tabindex" />
</template>

<script>
    // import { mapGetters } from 'vuex'
    export default {
        props: ['current', 'getters', 'name', 'dataValue', '_type', 'url', 'id', 'placeholder', 'tabindex', 'isEditing'],
        created: function () {
        },
        methods: {
            
        },
        computed: {
            // ...mapState({
            //     checkoutStatus: state => state.cart.checkoutStatus
            // }),
            // ...mapGetters(this.module, {
            //     current: 'getCurrent'
            // }),
            storedValue: function () {
                // var current = this.$store.dispatch(this.obj)
                // if (current)
                //     return this.name in current ? current[this.name] : null
                // else 
                //     return null
                
                var name = this.name.split('_')[1]
                return this.isEditing ? this.current[name] : ''
            }
        }
    }
</script>