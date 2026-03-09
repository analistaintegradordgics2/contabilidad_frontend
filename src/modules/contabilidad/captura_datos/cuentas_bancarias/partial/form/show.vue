<template>
  <div>
    <l-newmodal
      width="1000px"
      ref="showcuentabancaria"
      footer
      :titulo="model == null ? 'Nueva cuenta bancaria' : 'Editar cuenta bancaria' "
    >
      <template slot="body">
        <div>
          <crea v-model="model" @cerrar="cerrarmodal" ref="creartipodoc" />
        </div>
      </template>

      <template slot="footer">
        <div class="row justify-center">
          <div class="col-4 text-right">
            <q-btn
              class="full-width"
              dense
              rounded
              unelevated
              color="amber"
              label="Guardar"
              @click="emitguardar"
            ></q-btn>
          </div>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
import crea from "../crear";
export default {
  name: "showcuentabancaria",
  components: {
    crea
  },
  data() {
    return {
      model: null
    };
  },
  methods: {
    abrirmodal(model) {
      this.model = model;
      this.$refs.showcuentabancaria.open();
    },
    cerrarmodal() {
      this.$refs.showcuentabancaria.close();
      this.$emit("recargar");
    },
    emitguardar() {
      this.$refs.creartipodoc.onSubmit();
    }
  }
};
</script>

<style>
</style>