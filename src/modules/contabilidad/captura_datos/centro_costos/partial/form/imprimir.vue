<template>
  <div>
    <l-newmodal
      ref="imprimircentrocosto"
      width="1300px"
      :validar_salir="false"
      titulo="Impresión de centros de costos"
      btn_listo
    >
      <template slot="body">
        <div>
          <iframe :src="url.path" width="100%" height="560px"></iframe>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
export default {
  name: "imprimircentrocosto",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimircentrocosto.open();
    },
  },
};
</script>

<style>
</style>