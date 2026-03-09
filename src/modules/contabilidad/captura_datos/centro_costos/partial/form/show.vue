<template>
  <div>
    <!-- <l-modal full ref="showtipodocumento" maxheight="380px" height="380px">
      <template slot="title">
        <div class="row full-width items-center">
          <div class="col-8 flex items-center">
            <q-icon name="edit" size="20px" />
            <label class="q-ml-sm titulocard">Editar centro de costo</label>
          </div>
          <div class="col-4 text-right">
            <q-btn
                class="q-mr-sm"
                dense
                round
                color="green"
                icon="save"
                @click="emitguardar"
            >
                <q-tooltip> Guardar </q-tooltip>
            </q-btn>
          </div>
      </div>
      </template> -->
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
      this.$refs.creartipodoc.abrir(model);
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