<template>
  <div class="">

  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    data () {
      return {}
    },
    methods: {},
    created () {
      const query = this.$route.query
      const page = this.$route.query.page
      delete query.page
      console.log(query, page)
      this.$router.push({ path: page, query })
    }
  }
</script>

<style scoped lang="scss">
</style>
