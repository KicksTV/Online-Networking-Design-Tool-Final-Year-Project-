<template>
    <input autocomplete="off" class="table-editor__input form-control" :id="id" :placeholder="placeholder" :name="name" :type="type"
           @input="updateValue" :value="storedValue" :tabindex="tabindex" />
</template>

<script>
    export default {
        props: ['obj', 'name', 'dataValue', 'type', 'url', 'id', 'placeholder', 'tabindex'],
        created: function () {
        },
        methods: {
            updateValue: function(e) {
                var self = this,
                    value = e.target.value;
                self.$store.commit('updateField', [self.name, value])
            }
        },
        computed: {
            storedValue: function () {
                return this.$store.dispatch()[this.name]
            }
        }
    }
</script>