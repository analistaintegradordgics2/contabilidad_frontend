<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprimircuentasbancarias"
      titulo="Impresión de cuentas bancarias"
      footer
      btn_listo
      :validar_salir="false"
    >
      <template slot="body">
        <div>
          <iframe :src="url.path" width="100%" height="480px"></iframe>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
export default {
  name: "imprimircuentasbancarias",
  components: {},
  data() {
    return {
      url: {}
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimircuentasbancarias.open();
    }
  }
};
</script>

<style>
</style>