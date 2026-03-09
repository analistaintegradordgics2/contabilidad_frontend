<template>
  <div>
    <l-modal
      full
      ref="imprimirdocumento"
      maxheight="640px"
      height="640px"
      :validar_salir="false"
    >
      <template slot="title">
        <div class="col-8 flex items-center">
          <q-icon name="print" size="20px" />
          <label class="q-ml-sm titulocard">Impresión de documentos</label>
        </div>
      </template>
      <div>
        <iframe :src="url.path" width="100%" height="600px"></iframe>
      </div>
    </l-modal>
  </div>
</template>

<script>
export default {
  name: "imprimirdocumento",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimirdocumento.open();
    },
  },
};
</script>

<style>
</style>