<template>
  <div class="q-ma-lg">
    <q-card flat>
      <q-card-section class="row text-white q-pa-sm">
        <div class="flex items-center">
          <q-icon name="build_circle" size="24px" />
          <span class="q-ml-sm fonttitle q-pr-md"
            >Procesos de reconstrucción de movimientos</span
          >
        </div>
        <q-separator class="espaciotab" />
        <q-chip class="botones_acciones q-ma-none q-ml-md" size="22px">
          <div class="row q-col-gutter-x-md">
            <div class="col">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="reconstruir"
              >
                <q-icon name="mdi-reload" style="color: #42a5f5" />
                <q-tooltip>Reconstruir movimientos</q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="abrirBitacora"
              >
                <q-icon name="mdi-message-bulleted" style="color: #42a5f5" />
                <q-tooltip>Bitácora</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-chip>
      </q-card-section>
      <q-card-section>
        <q-form ref="formrecons" class="row">
          <l-select
            col="3"
            v-model="model.anio"
            option-value="id"
            option-label="nombre"
            class="q-field--float"
            label="Año *"
            :options="anio"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <div class="q-ml-sm flex items-center">
            <can
              permiso="view_menu_contabilidad_consultas_reconstruccion_de_movimientos_acciones_reconstruir"
            >
            </can>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <l-bitacoraprocesoscontables ref="bitacoraprocesoscontables" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  layout: "main",
  name: "reconstruccion",
  data() {
    return {
      model: {
        anio: null,
      },
      bitacora: [],
    };
  },
  computed: {
    ...mapState("generales", ["anio"]),
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async getBitacora() {
      await this.Get("contabilidad/reconstruccion/bitacora").then((resp) => {
        this.bitacora = resp;
      });
    },
    async reconstruir() {
      const validate = await this.$refs.formrecons.validate();
      if (validate) {
        await this.Post("contabilidad/reconstruccion", this.model).then(
          (resp) => {
            if (resp.status == 200) {
              this.getBitacora();
              this.LFinish(resp.msg, () => {
                this.onReset();
              });
            } else {
              this.LInfo("warning", resp.msg);
            }
          }
        );
      }
    },
    abrirBitacora() {
      this.$refs.bitacoraprocesoscontables.abrirModal(this.bitacora);
    },
    onReset() {
      this.model = {
        anio: null,
      };
      setTimeout(() => {
        this.$refs.formrecons.resetValidation();
      }, 500);
    },
  },
  created() {
    this.getBitacora();
    this.getConfAnio();
  },
};
</script>
<style lang="scss">
.fonttitle {
  color: #194880;
}
.espaciotab {
  border-color: black;
  margin-top: 23px;
}

.btnAcciones {
  border: 1px solid #42a5f5 !important;
  &:hover {
    color: #194880 !important;
    border: 1px solid #194880 !important;
    & i {
      color: #194880 !important;
    }
  }
}

.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>
