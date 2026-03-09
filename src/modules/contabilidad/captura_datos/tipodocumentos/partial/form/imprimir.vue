<template>
  <div>
    <l-newmodal
      ref="imprimirtipodocumento"
      width="1300px"
      :validar_salir="false"
      titulo="IMPRESIÓN TIPOS DE DOCUMENTOS"
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
  name: "imprimirtipodocumento",
  components: {},
  data() {
    return {
      url: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.url = model;
      this.$refs.imprimirtipodocumento.open();
    },
  },
};
</script>

<style>
</style>