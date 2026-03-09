<template>
  <div>
    <l-modal full ref="imprimirconsulta" maxheight="640px" height="640px" :validar_salir="false">
      <template slot="title">
        <q-icon name="print" size="24px"/>
        <label class="q-ml-sm titulocard">Impresión de consulta - {{tipodocumento}}</label>
      </template>
      <div>
        <iframe :src="url.path" width="100%" height="600px"></iframe>
      </div>
      <!-- <template slot="footer">
        <q-btn
          unelevated
          color="red"
          icon="highlight_off"
          label="Cancelar "
          @click="$refs.imprimirconsulta.close()"
          style="padding-right: 7px"
        />
      </template> -->
    </l-modal>
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