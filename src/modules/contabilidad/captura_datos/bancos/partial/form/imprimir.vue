<template>
  <l-newmodal
    ref="imprimirbancos"
    width="1300px"
    :validar_salir="false"
    footer
    btn_listo
    titulo="Impresión"
  >
    <template slot="body">
      <div>
        <iframe :src="url.path" width="100%" height="600px"></iframe>
      </div>
    </template>
  </l-newmodal>
</template>

<script>
export default {
  name: "imprimirbancos",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimirbancos.open();
    },
  },
};
</script>

<style>
</style>