<template>
  <select :id="id" :name="name" :value="storedValue" @change="updateValue" :tabindex="tabindex" class="table-editor__input form-control">
    <slot></slot>
  </select>
</template>
<script>
  var Select = Vue.component('bound-select', {
      delimiters: ['${', '}'],
      template: document.getElementById('select-template'),
      props: ['id', 'name', 'value', 'tabindex'],
      store:store,
      methods: {
        updateValue: function (ev) {
            this.$store.commit('updateField', [this.name, ev.target.value])
        }
      },
      computed: Vuex.mapState({
        storedValue: function (obj) {
          if (this.$parent.relay_team_form_fields.includes(this.name)) {
              return obj.relay_current[this.name]
          } else {
              return obj.current[this.name]
          }
        }
      })
  })
</script>
