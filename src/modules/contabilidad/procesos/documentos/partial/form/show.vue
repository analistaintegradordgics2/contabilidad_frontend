<template>
  <div>
    <l-modal full ref="showtipodocumento" maxheight="380px" height="380px">
      <template slot="title">
        <label style="font-size: 16px">Editar tipo de documento</label>
      </template>
      <div>
          <crea v-model="model" @cerrar="cerrarmodal"/>
      </div>
      <!-- <template slot="footer">
        <q-btn
          unelevated
          color="red"
          icon="highlight_off"
          label="Cancelar "
          @click="$refs.showtipodocumento.close()"
          style="padding-right: 7px"
        />
      </template> -->
    </l-modal>
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
        model: {}
    };
  },
  methods: {
    abrirmodal(model) {
      this.model = model;
      setTimeout(() => {      
        this.$refs.showtipodocumento.open();
      }, 1000);
    },
    cerrarmodal() {
      this.$refs.showtipodocumento.close();
      this.$emit("recargar");
    }
  },
};
</script>

<style>
</style>