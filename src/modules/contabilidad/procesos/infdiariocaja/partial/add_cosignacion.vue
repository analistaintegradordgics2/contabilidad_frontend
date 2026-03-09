<template>
  <l-modal ref="modaladd" widthdynamic="800px" :validar_salir="false">
    <template slot="title">
      <div class="row full-width">
        <div class="col-8 flex items-center">
          <q-icon
            :name="model.id == null ? 'post_add' : 'mdi-file-document-edit'"
            size="24px"
          />
          <span class="q-ml-sm titulocard"
            >{{ model.id == null ? "Agregar" : "Editar" }} consignación</span
          >
        </div>
        <div class="col-4 q-pr-md text-right" @click="onSubmit()">
          <q-btn round dense color="green-6" icon="save">
            <q-tooltip>Guardar</q-tooltip>
          </q-btn>
        </div>
      </div>
    </template>
    <q-form ref="fromcosignacion">
      <div class="row">
        <l-input
          col="6"
          v-model="model.numero"
          label="Número *"
          icon="credit_card"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-select
          col="6"
          v-model="model.ctaban"
          value="id"
          option-label="nombre"
          :options="list_bancos_mayor"
          label="Banco *"
          icon="account_balance"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-money
          col="6"
          v-model="model.efectivo"
          prefijo="$ "
          sufijo=""
          label="Efectivo *"
          :rules="[(val) => val > 0]"
          icon="monetization_on"
          :precision="centavos_contabilidad == true ? 2 : 0"
        />
        <l-money
          col="6"
          v-model="model.total"
          prefijo="$ "
          sufijo=""
          label="Total *"
          icon="monetization_on"
          :precision="centavos_contabilidad == true ? 2 : 0"
          :disable="true"
        />
      </div>
    </q-form>
  </l-modal>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "addconsignaciones",
  props: {
    caja_id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      model: {
        id: null,
        numero: null,
        efectivo: 0,
        total: 0,
        ctaban: null,
        caja: this.caja_id,
        mayor: null,
      },
      list_bancos_mayor: [],
    };
  },
  computed: {
    ...mapState("parametros", ["centavos_contabilidad"]),
  },
  methods: {
    async onSubmit() {
      const validate = await this.$refs.fromcosignacion.validate();
      if (validate) {
        await this.Post(
          "contabilidad/info_diario_caja/add_cosignacion",
          this.model
        ).then((resp) => {
          this.LInfo(
            "success",
            `Cosignación ${
              this.model.id == null ? "agregada" : "editada"
            } correctamente.`
          );
          this.$emit("reload");
          this.$refs.modaladd.close();
        });
      }
    },
    abrirModal(model = null) {
      this.onReset();
      this.$refs.modaladd.open();
      if (model != null) {
        this.model = { ...model };
      }
      this.getBancosMayor();
    },
    async getBancosMayor() {
      await this.Get("contabilidad/ctabanco").then((resp) => {
        this.list_bancos_mayor = resp;
      });
    },
    onReset() {
      this.model = {
        id: null,
        numero: null,
        efectivo: 0,
        total: 0,
        ctaban: null,
        caja: this.caja_id,
        mayor: null,
      };
    },
  },
  watch: {
    "model.efectivo"(val) {
      this.model.total = val;
    },
  },
};
</script>

<style>
</style>
