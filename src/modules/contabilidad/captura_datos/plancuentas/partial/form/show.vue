<template>
  <div>
    <crea v-model="model" @cerrar="cerrarmodal" ref="crearcuenta" />
  </div>
</template>

<script>
import crea from "../crear";
export default {
  name: "showpuc",
  components: {
    crea,
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
    abrirmodal(model) {
      this.model = model;
      this.$refs.crearcuenta.abrir(this.model);
    },
    cerrarmodal() {
      this.$emit("recargar");
    },
    emitguardar() {
      this.$refs.crearcuenta.onSubmit();
    },
  },
};
</script>

<style>
</style>