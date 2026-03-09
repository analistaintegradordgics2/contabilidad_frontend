<template>
  <div>
    <l-newmodal
      ref="imprimirdocumento"
      width="1300px"
      :validar_salir="false"
      titulo="Impresión de documentos"
      footer
      btn_listo
    >
      <template slot="body">
        <div>
          <iframe
            :src="`${url.path}`"
            width="100%"
            height="480px"
            id="iframe"
          />
        </div>
      </template>
    </l-newmodal>
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
      setTimeout(() => {
        let element = document.querySelector("#iframe");
        element.contentWindow.toolbar.visible = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss">
#toolbarContainer {
  display: none !important; /* hide PDF viewer toolbar */
}
#mainContainer {
  top: 0 !important; /* move doc up into empty bar space */
}
</style>