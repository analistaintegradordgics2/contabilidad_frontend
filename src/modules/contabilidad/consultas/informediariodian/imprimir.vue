<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprirmir_informe_dian"
      :validar_salir="false"
      titulo="Impresión informe dian"
    >
      <template slot="body">
        <div>
          <iframe :src="url.path" width="100%" height="600px"></iframe>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
export default {
  name: "imprimirDocumento",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprirmir_informe_dian.open();
    },
  },
};
</script>

<style></style>
