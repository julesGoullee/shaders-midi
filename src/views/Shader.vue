<template>
  <v-container
    v-if="selectedVisualization"
    class="shader-view"
  >
    <v-flex
      class="shader-container"
      xs12
    >
      <ShaderRender />
    </v-flex>

    <ShaderControl />
    <ShaderParams />
    <ShaderInfo />
  </v-container>
</template>

<style scoped>
  .shader-view{
  }
  .shader-container {
    height: 60vh;
    z-index: 0;
    position: relative;
    max-height: 520px;
  }
</style>

<script>

  import assert from 'assert';

  import ShaderControl from '@/components/ShaderControl.vue'
  import ShaderRender from '@/components/ShaderRender.vue'
  import ShaderParams from '@/components/ShaderParams.vue';
  import ShaderInfo from '@/components/ShaderInfo.vue';
  import { mapState, mapActions, mapGetters } from 'vuex';

  export default {
    name: 'ShaderView',
    components: {
      ShaderParams,
      ShaderRender,
      ShaderControl,
      ShaderInfo,
    },
    computed: {
      ...mapGetters([
        'selectedVisualization',
      ]),
      ...mapState([
        'route',
      ]),
    },
    mounted() {

      assert(this.route.params && this.route.params.id, 'invalid_route');

      const shaderId = this.route.params.id;

      this.loadVisualisations();
      this.setVisualisation(shaderId);

    },
    methods: {
      ...mapActions([
        'loadVisualisations',
        'setVisualisation',
      ]),
    }
  }
</script>
