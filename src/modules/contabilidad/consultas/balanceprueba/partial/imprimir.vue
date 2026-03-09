<template>
  <div>
    <l-newmodal
      width="1300px"
      ref="imprimirconsulta"
      :validar_salir="false"
      :titulo="`Impresión de consulta - ${tipodocumento}`"
      footer
      btn_listo
    >
      <template slot="body">
        <div>
          <iframe :src="url.path" width="100%" height="490px"></iframe>
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
      tipodocumento: "",
    };
  },
  methods: {
    abrirmodal(model, tipo) {
      this.tipodocumento = tipo;
      this.url = model;
      this.$refs.imprimirconsulta.open();
    },
  },
};
</script>

<style>
</style>