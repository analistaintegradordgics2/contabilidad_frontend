<template>
  <div>
    <l-modal
      full
      ref="imprimir"
      maxheight="640px"
      height="640px"
      :validar_salir="false"
    >
      <template slot="title">
        <div class="col-8 flex items-center">
          <q-icon name="print" size="20px" />
          <label class="q-ml-sm titulocard">Impresión</label>
        </div>
      </template>
      <div>
        <iframe
          :src="`${url.path}`"
          width="100%"
          height="600px"
          id="iframe"
        />
      </div>
    </l-modal>
  </div>
</template>

<script>
export default {
  name: "imprimir",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimir.open();
    },
  },
};
</script>

<style lang="scss">
</style>