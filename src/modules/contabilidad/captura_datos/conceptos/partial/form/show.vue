<template>
  <div>
    <crea v-model="model" @cerrar="cerrarmodal" ref="crearconcep" />
  </div>
</template>

<script>
import crea from "../crear";
export default {
  name: "showconcepto",
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
      setTimeout(() => {
        this.$refs.crearconcep.abrir(model);
      }, 500);
    },
    cerrarmodal() {
      this.$emit("recargar");
    },
    emitguardar() {
      this.$refs.crearconcep.onSubmit();
    },
  },
};
</script>

<style>
</style>