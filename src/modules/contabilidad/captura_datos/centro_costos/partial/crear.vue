<template>
  <l-newmodal
    width="1000px"
    ref="refcrearcentrocosto"
    persistent
    :titulo="`${editar == false ? 'Nuevo ' : 'Editar'} Centro de Costo`"
    footer
  > 
    <template slot="body">
      <div class="q-pa-md">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          ref="Formcc"
          class="q-gutter-md"
        >
          <div class="row">
            <l-input
              col="md-3 text-black"
              v-model="model.codigo"
              label="Código *"
              :rules="[$rules.required($t('validator.required'))]"
              @blur="validarCodigo"
              :disable="editar == true"
            />
            <l-input
              col="md-6 text-black"
              v-model="model.nombre"
              label="Nombre *"
              :rules="[$rules.required($t('validator.required'))]"
            />
            <l-select
              col="3 text-black"
              v-model="model.estado"
              value="id"
              option-label="nombre"
              :options="estado"
              label="Estado *"
              :rules="[$rules.required($t('validator.required'))]"
            />
          </div>
        </q-form>
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
            @click="onSubmit"
          />
        </div>
      </div>
    </template>
  </l-newmodal>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  layout: "main",
  name: "Crear",
  components: {},
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      estado: [
        { id: "Activo", nombre: "Activo" },
        { id: "Inactivo", nombre: "Inactivo" },
      ],
      model: {
        id: null,
        codigo: null,
        nombre: null,
        estado: null,
        tipo: "C",
      },
      centroscostos: [],
      editar: false,
      validacion: true,
      temp_codigo: null,
    };
  },
  computed: {
    ...mapState("contabilidad", ["mostar_ocultar"]),
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    ...mapMutations("contabilidad", ["SET_MOSTRAR_OCULTAR"]),
    abrir(model){
      this.model = model;
      setTimeout(() => {      
        this.$refs.refcrearcentrocosto.open();
      }, 500);
    },
    validarCodigo() {
      if (this.temp_codigo != this.model.codigo) {
        const filtar = this.centroscostos.filter(
          (f) => f.codigo == this.model.codigo.trim() && f.tipo == "C"
        );
        if (filtar.length > 0) {
          this.validacion = false;
          this.LInfo("warning", "El código ingresado ya existe en el sistema");
        } else {
          this.validacion = true;
        }
      }
    },
    async onSubmit() {
      if (this.validacion == true) {
        try {
          const validate = await this.$refs.Formcc.validate();
          if (validate) {
            var msg = "";
            if (this.editar == true) {
              msg = "Centro de costo editado correctamente.";
              this.model["um_id"] = this.$store.getters["auth/user"].id;
            } else {
              msg = "Centro de costo creado correctamente.";
              this.model["uc_id"] = this.$store.getters["auth/user"].id;
              this.model["um_id"] = null;
            }
            this.model.codigo = this.model.codigo.trim();
            await this.Post("contabilidad/centrocostos", this.model);
            this.$refs.Formcc.reset();
            this.LFinish(
              msg,
              () => {
                if (this.editar == true) {
                  this.$emit("cerrar");
                  this.$refs.refcrearcentrocosto.close();
                }else{
                  this.$emit("recargar");
                  this.onReset()
                  this.$refs.refcrearcentrocosto.close();
                }
              },
              false
            );
          }
        } catch ({ message }) {
          console.error(message);
        }
      } else {
        this.LInfo("warning", "El código ingresado ya existe en el sistema");
      }
    },
    abrir(model){
      this.model = model;
      this.editar = true;
      this.validacion = true;
      setTimeout(() => {      
        this.$refs.refcrearcentrocosto.open();
      }, 500);
    },
    onReset() {
      this.model = {
        id: null,
        codigo: null,
        nombre: null,
        estado: null,
        tipo: "C",
      };
      this.validacion = false;
    },
    async getCentrosCostos() {
      try {
        const data = await this.Get("contabilidad/centrocostos/all", {
          tipo: "C",
        });
        this.centroscostos = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    abrirmodal(){
      this.getCentrosCostos();
      setTimeout(() => {      
        this.$refs.refcrearcentrocosto.open();
      }, 500);
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      if (this.value != null) {
        this.editar = true;
        this.model = this.value;
        this.temp_codigo = this.value;
      }
    });
  },
  created() {
  },
};
</script>
<style scoped>
</style>
