<template>
  <a-breadcrumb style="margin: 16px 0;text-align: left">
    <template v-for="b in breadcrumbs" >
      <a-breadcrumb-item v-if="!b.meta.hiddenBreadcrumb" :key="b.path">
        <span >{{b.meta.title}}</span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      breadcrumbs: []
    }
  },
  watch: {
    $route (route) {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      if (this.$store.getters.syncRoutes.length > 1) {
        const module = [
          {
            meta: {
              title: this.$store.getters.currentModuleTitle
            }
          }
        ]
        this.breadcrumbs = module.concat(
          this.$route.matched.filter(i => i.meta && i.meta.title && !i.meta.hiddenBreadcrumb)
        )
      } else {
        this.breadcrumbs = this.$route.matched.filter(i => i.meta && i.meta.title && !i.meta.hiddenBreadcrumb)
      }
    }
  },
  created () {
    this.getBreadcrumb()
  }
}

</script>
<style scoped>

</style>
