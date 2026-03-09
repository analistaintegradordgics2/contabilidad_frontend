<template>
  <div class="q-ma-md">
    <q-card flat>
      <q-card-section>
        <q-form  class="row" ref="form_cierre_especial">
          <div class="col-12 text-right">
            <q-chip class="botones_acciones" size="22px">
              <div class="row q-col-gutter-x-sm">
                <div class="col">
                  <q-btn
                    unelevated
                    round
                    dense
                    color="primary"
                    @click="onSubmit"
                    :disable="habilitarPago"
                  >
                    <q-icon name="mdi-lock" />
                    <q-tooltip>Cerrar cuenta</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-chip>
          </div>
          <div class="col-12">
            <div class="row">
              <div class="col-12 row q-mb-md">
                <label class="text-weight-bold q-px-sm" style="color: #194880">Datos a trasladar o cerrar</label>
                <q-separator class="espaciotab" />
              </div>
              <div class="col-12 row">
                <l-select-rest
                  col="6"
                  label="Cuenta que desea trasladar o cerrar *"
                  url="contabilidad/mayor/selectnewall"
                  v-model="model.cta_cerrar"
                  :rules="[$rules.required($t('validator.required'))]"
                  hint="Puedes elegir entre cuentas auxiliares o generales. Si seleccionas
                  una cuenta general, todas las cuentas auxiliares asociadas a esta
                  se cerrarán o trasladarán automáticamente."
                />
                <l-select-rest
                  col="6"
                  label="Nit que desea trasladar o cerrar"
                  url="tercero/personas/selectnew"
                  v-model="model.persona_cerrar"
                  hint="Si deseas cerrar o trasladar todos los NIT, déja este campo en blanco."
                />
              </div>
              <div class="col-12 row q-mb-md">
                <label class="text-weight-bold q-px-sm" style="color: #194880">Datos destino</label>
                <q-separator class="espaciotab" />
              </div>
              <div class="col-12 row">
                <l-select-rest
                  col="6"
                  label="Cuenta destino"
                  url="contabilidad/mayor/selectnewall"
                  v-model="model.cta_destino"
                  hint="Si la cuenta se cierra con ella misma, deje este espacio en blanco."
                />
                <l-select-rest
                  col="6"
                  label="Nit contra el cual desea trasladar o cerrar la cuenta"
                  url="tercero/personas/selectnew"
                  v-model="model.persona_destino"
                  hint="Si deseas que cada NIT se cierre contra sí mismo, deja este campo en blanco."
                />
              </div>
              <div class="col-12 row q-mb-md">
                <!-- <div class="col-1 flex items-center">
                  <q-checkbox
                    v-model="editar_fecha"
                    label="Cambiar Fecha"
                    color="amber"
                  />
                </div> -->
                <!-- <l-input
                  col="2"
                  label="Fehca *"
                  v-model="model.fecha_doc"
                  type="date"
                  :rules="[$rules.required($t('validator.required'))]"
                  :disable="!editar_fecha"
                /> -->
                <l-select
                  col="2"
                  label="Año *"
                  v-model="model.anio"
                  :options="anio"
                  optionValue="nombre"
                  :rules="[$rules.required($t('validator.required'))]"
                />
                <l-select
                  col="md-2 text-black"
                  v-model="model.mes"
                  option-value="id"
                  option-label="nombre"
                  label="Mes"
                  :options="meses"
                  :rules="[true]"
                />
              </div>
              <div class="col-12 row q-mb-md">
                <label class="text-weight-bold q-px-sm" style="color: #194880">Generar nota de contabilidad</label>
                <q-separator class="espaciotab" />
              </div>
              <div class="col-12 row">
                <l-select
                  col="4"
                  label="Concepto *"
                  v-model="model.concepto"
                  option-value="id"
                  option-label="codigo_nombre"
                  :options="conceptos_conta"
                  :rules="[$rules.required($t('validator.required'))]"
                />
                <l-input
                  col="6"
                  label="Detalle *"
                  v-model="model.detalle"
                  :rules="[$rules.required($t('validator.required'))]"
                />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  layout: "main",
  name: "index",
  data() {
    return {
      model: {
        cta_cerrar: null,
        persona_cerrar: null,
        cta_destino: null,
        persona_destino: null,
        fecha_doc: moment().format("YYYY-MM-DD"),
        anio: moment().format("YYYY"),
        mes: null,
        concepto: null,
        detalle: null,
      },
      editar_fecha: false,
    };
  },
  computed: {
    ...mapState("contabilidad", ["conceptos_conta"]),
    ...mapState("generales", ["anio", "meses"]),
  },
  methods: {
    ...mapActions("contabilidad", ["getList_conceptos_conta"]),
    ...mapActions("generales", ["getConfAnio", "getConfMes"]),
    async onSubmit() {
      const validate = await this.$refs.form_cierre_especial.validate();
      if (validate) {
        this.LConfim("¿Estás seguro de realizar el cierre especial?", async () => {
          await this.Post(
            "contabilidad/cierres/cierre_especial",
            this.model
          ).then((resp) => {
            if (resp.status == 200) {
              this.LConfimOK("success", resp.msg, () => {
                this.onReset();
              }, false);
            }
          });
        }, () => {});
      }
    },
    onReset() {
      this.model = {
        cta_cerrar: null,
        persona_cerrar: null,
        cta_destino: null,
        persona_destino: null,
        fecha_doc: moment().format("YYYY-MM-DD"),
        anio: moment().format("YYYY"),
        concepto: null,
        detalle: null,
      };
      this.editar_fecha = false;
      setTimeout(() => {
        this.$refs.form_cierre_especial.resetValidation();
      }, 500);
    },
  },
  watch: {
    editar_fecha(val) {
      if (val == false) {
        this.model.fecha = moment().format("YYYY-MM-DD");
      }
    },
  },
  created() {
    this.getList_conceptos_conta();
    this.getConfAnio();
    this.getConfMes();
  },
};
</script>

<style lang="scss">
.espaciotab {
  border-color: #d8d8d8;
  margin-top: 15px;
}
</style>