<template>
  <l-newmodal
    ref="showbancos"
    width="1000px"
    footer
    :titulo="`${model == null ? 'Crear' : 'Editar'} banco`"
  >
    <template slot="body">
      <div>
        <crea v-model="model" @cerrar="cerrarmodal" ref="creartipodoc" />
      </div>
    </template>
    <template slot="footer">
      <div class="row justify-center">
        <div class="col-4">
          <q-btn
            class="full-width"
            dense
            rounded
            color="amber"
            label="¡Listo!"
            @click="emitguardar"
          />
        </div>
      </div>
    </template>
  </l-newmodal>
</template>

<script>
import crea from "../crear";
export default {
  name: "showbancos",
  components: {
    crea,
  },
  data() {
    return {
      model: null,
    };
  },
  methods: {
    abrirmodal(model = null) {
      if (model != null) {
        this.model = { ...model };
      } else {
        this.model = null;
      }
      this.$refs.showbancos.open();
    },
    cerrarmodal() {
      this.$refs.showbancos.close();
      this.$emit("recargar");
    },
    emitguardar() {
      this.$refs.creartipodoc.onSubmit();
    },
  },
};
</script>

<style>
</style>