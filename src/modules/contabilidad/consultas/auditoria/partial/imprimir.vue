<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprimirconsulta"
      :validar_salir="false"
      :titulo="`Impresión de auditoria - ${tipo}`"
      footer
      btn_listo
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
  name: "imprimirconsulta",
  components: {},
  data() {
    return {
      url: {},
      tipo: "",
    };
  },
  methods: {
    abrirmodal(model, tipo) {
      this.tipo = tipo;
      this.url = model;
      this.$refs.imprimirconsulta.open();
    },
  },
};
</script>

<style>
</style>