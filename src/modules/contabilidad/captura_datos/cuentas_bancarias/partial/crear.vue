<template>
  <div >
    <q-form @submit="onSubmit" @reset="onReset" ref="formbancos" class="q-pa-md">
      <div class="row">
        <l-input
          col="md-4 text-black"
          v-model="model.nombre"
          label="Nombre *"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-input
          col="md-4 text-black"
          v-model="model.nrocuenta"
          label="Número de cuenta"
          type="number"
        />
        <l-select
          col="4 text-black"
          v-model="model.banco"
          value="id"
          option-label="nombre"
          :options="bancos"
          label="Banco *"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-select-rest
          col="4"
          label="Cuenta *"
          v-model="model.mayor"
          url="contabilidad/mayor/selectnew"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-select
          col="4 text-black"
          v-model="model.tipo_cuentas"
          value="id"
          option-label="nombre"
          :options="tipo_cuenta"
          label="Tipo de cuenta *"
        />
        <l-select
          col="4 text-black"
          v-model="model.activo"
          value="id"
          option-label="nombre"
          :options="select_activo"
          label="Estado *"
          :rules="[$rules.required($t('validator.required'))]"
        />
      </div>
    </q-form>
  </div>
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
      default: null
    }
  },
  data() {
    return {
      model: {
        id: null,
        nrocheque: null,
        nrocuenta: null,
        banco: null,
        mayor: null,
        nombre: null,
        tipo_cuentas: null
      },
      bancos: [],
      tipo_cuenta: [],
      editar: false,
      select_activo : [
        {
          id: true,
          nombre: 'Activo' 
        },
        {
          id: false,
          nombre: 'Inactivo' 
        },
      ]
    };
  },
  computed: {},
  methods: {
    async onSubmit() {
      try {
        const validate = await this.$refs.formbancos.validate();
        if (validate) {
          var msg = "";
          if (this.editar == true) {
            msg = "Cuenta bancaria editado correctamente.";
            this.model["um_id"] = this.$store.getters["auth/user"].id;
            await this.Patch(
              `contabilidad/ctabanco/${this.model.id}`,
              this.model
            ).then(() => {
              this.$refs.formbancos.reset();
              this.LFinish(
                msg,
                () => {
                  this.$emit("cerrar");
                },
                false
              );
            });
          } else {
            msg = "Cuenta bancaria creado correctamente.";
            this.model["uc_id"] = this.$store.getters["auth/user"].id;
            this.model["um_id"] = null;
            await this.Post("contabilidad/ctabanco", this.model).then(() => {
              this.$refs.formbancos.reset();
              this.LFinish(msg, () => {}, false);
            });
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getBancos() {
      await this.Get("parametrizacion/bancos").then(resp => {
        this.bancos = resp;
      });
    },
    async getTipo_cuenta() {
      await this.Get("parametrizacion/tipo_cuenta").then(resp => {
        this.tipo_cuenta = resp;
      });
    },
    onReset() {
      this.model = {
        id: null,
        nrocheque: null,
        nrocuenta: null,
        banco: null,
        mayor: null,
        nombre: null,
        tipo_cuentas: null
      };
    }
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      if (this.value != null) {
        this.editar = true;
        this.model = this.value;
      }
    });
  },
  created() {
    this.getBancos();
    this.getTipo_cuenta();
  }
};
</script>
<style scoped>
</style>
