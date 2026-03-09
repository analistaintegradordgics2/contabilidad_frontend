<template>
  <div>
    <!-- <l-modal full ref="showtipodocumento" maxheight="380px" height="380px"> -->
      <div>
          <crea v-model="model" @cerrar="cerrarmodal" ref="creartipodoc"/>
      </div>
    <!-- </l-modal> -->
  </div>
</template>

<script>
import crea from "../crear";
export default {
  name: "showtipodocumento",
  components: {
    crea,
  },
  data() {
    return {
        model: null
    };
  },
  methods: {
    abrirmodal(model) {
      this.model = model;
      setTimeout(() => {       
        this.$refs.creartipodoc.abrir(this.model);
      },500);
    },
    cerrarmodal() {
      // this.$refs.showtipodocumento.close();
      this.$emit("recargar");
    },
    emitguardar() {
      this.$refs.creartipodoc.onSubmit();
    }
  },
};
</script>

<style>
</style>