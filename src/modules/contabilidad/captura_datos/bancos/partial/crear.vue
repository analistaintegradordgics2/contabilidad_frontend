<template>
  <div class="q-pa-md">
    <q-form ref="formbancos">
      <div class="row">
        <l-input
          col="2"
          v-model="model.codigo"
          label="Código *"
          :rules="[
            editar
              ? true
              : (val) =>
                  val != null ? val.length <= 4 || 'Máximo 4 caracteres' : true,
            $rules.required($t('validator.required')),
          ]"
          :disable="editar == true"
          @blur="validarCodigo"
          type="number"
        />
        <l-input
          col="4"
          v-model="model.nombre"
          label="Nombre *"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-input
          col="3"
          v-model="model.codigo_ach"
          label="Código ACH"
          maxlength="50"
        />
        <!-- <div class="col-2">
          <q-checkbox v-model="model.estado" :val="true" label="Estado" />
        </div> -->
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
<script>
export default {
  layout: "main",
  name: "Crear",
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      estado: [
          { id: "Activo", nombre: "Activo" },
          { id: "Inactivo", nombre: "Inactivo" }
        ],
      model: {
        id: null,
        nombre: null,
        codigo: null,
        codigo_ach: null,
        estado:null,
      },
      editar: false,
    };
  },
  methods: {
    async onSubmit() {
      const validate = await this.$refs.formbancos.validate();
      try {
        if (validate) {
          var msg = "";
          if (this.model.estado == 'Activo'){
            this.model.estado = true
          }else{
            this.model.estado = false

          }
          if (this.editar == true) {
            msg = "Banco editado correctamente.";
            this.model["um_id"] = this.$store.getters["auth/user"].id;
            await this.Patch(
              `parametrizacion/bancos/${this.model.id}`,
              this.model
            );
          } else {
            msg = "Banco creado correctamente.";
            this.model["uc_id"] = this.$store.getters["auth/user"].id;
            this.model["um_id"] = null;
            await this.Post("parametrizacion/bancos", this.model);
          }
          this.LFinish(msg, () => {
            this.$emit("cerrar");
          });
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    validarCodigo() {
      this.Get("parametrizacion/bancos/listar").then((resp) => {
        let result = resp.filter(
          (filter) => filter.codigo === parseInt(this.model.codigo)
        );
        if (result.length > 0) {
          this.LInfo("warning", "El código ingresado ya existe.");
          this.model.codigo = null;
        }
      });
    },
    onReset() {
      this.model = {
        id: null,
        nombre: null,
        codigo: null,
        codigo_ach: null,
        estado: null,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value != null) {
        this.editar = true;
        this.model = this.value;
        if (this.model.estado == true){
          this.model.estado = 'Activo'
        }else{
          this.model.estado = 'Inactivo'

        }
      }
    });
  },
};
</script>
<style scoped>
</style>
