<template>
  <l-newmodal
    ref="modalcerrar"
    width="1300px"
    :validar_salir="false"
    titulo="Cerrar Caja"
    footer
  >
    <template slot="body">
      <q-form ref="fromcerrar">
        <q-tabs
          v-model="tab"
          dense
          class="tabprocesos tab_class"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab name="datos_actuales" label="Datos del informe actual" />
          <q-tab
            name="datos_siguientes"
            label="Datos para el siguiente informe"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="datos_actuales" style="padding: 0px !important">
            <div class="row">
              <div class="row col-12 divinicio q-pt-lg q-pl-md">
                <div class="col-4">
                  <l-date
                    col="4"
                    v-model="value.fecha"
                    option-label="nombre"
                    label="Fecha"
                    :disable="true"
                  />
                </div>
                <div class="col-7 flex text-justify q-ml-lg">
                  <label
                    color="primary"
                    style="color: #42a5f5; font-size: 14px"
                  >
                    <q-icon name="info" class="q-mr-sm" color="primary"></q-icon
                    >Al realizar el cierre de caja se creará la nota de
                    contabilidad de consignaciones del día. Si ya existe dicho
                    documento, este será modificado.
                  </label>
                </div>
              </div>
              <div class="row col-12 q-pa-md q-mb-sm q-pt-lg">
                <l-input
                  col="4"
                  v-model="value.planilla"
                  label="Número de planilla"
                  :disable="true"
                />
                <l-input
                  col="4"
                  v-model="model.num_documento"
                  label="Nota de contabilidad de consignaciones"
                  :disable="true"
                />
                <l-input
                  col="4"
                  v-model="value.ultimo_consecutivo_consig"
                  label="Último consecutivo de consignaciones"
                  :disable="true"
                />
                <l-input
                  col="12 nopadding q-mt-md"
                  v-model="model.observaciones"
                  label="Observaciones"
                  type="textarea"
                  rows="4"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="datos_siguientes" class="q-pa-none">
            <div class="row">
              <div class="row col-12 divinicio q-pt-lg q-pl-md">
                <div class="col-4">
                  <l-date
                    col="4"
                    v-model="model.nueva_fecha"
                    option-label="nombre"
                    label="Fecha del siguiente día laboral *"
                    :rules="[$rules.required($t('validator.required'))]"
                  />
                </div>
                <div class="col-7 flex text-justify q-ml-lg">
                  <label
                    color="primary"
                    style="color: #42a5f5; font-size: 14px"
                  >
                    <q-icon name="info" class="q-mr-sm" color="primary"></q-icon
                    >Al inicializar caja solo se podrán realizar recibos de caja
                    con esta fecha, a menos que tenga permiso para modificar la
                    fecha.
                  </label>
                </div>
              </div>
              <div class="row col-12q-pa-sm">
                <!-- <div
              class="col-4 q-ml-sm q-pt-md flex items-center"
              v-if="model.fecha != null"
            >
              <strong>{{ formatNewFecha }}</strong>
            </div> -->
                <!-- <div class="col-12"> -->
                <div class="q-pa-sm">
                  <div class="col-6 q-pr-xs">
                    <label class="q-pa-sm colorlabel text-weight-bold"
                      >Saldo inicial</label
                    >
                    <div class="row q-pa-sm">
                      <l-money
                        col="3"
                        class="q-mb-sm"
                        v-model="model.efectivo"
                        label="Efectivo"
                        :disable="true"
                        prefijo="$ "
                        sufijo=""
                        icon="monetization_on"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                      />
                      <l-money
                        col="3"
                        class="q-mb-sm"
                        v-model="model.cheques"
                        label="Cheques"
                        :disable="true"
                        prefijo="$ "
                        sufijo=""
                        icon="monetization_on"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                      />
                      <l-money
                        col="3"
                        class="q-mb-sm"
                        v-model="model.consignacion"
                        label="Consignación"
                        :disable="true"
                        prefijo="$ "
                        sufijo=""
                        icon="monetization_on"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                      />
                      <l-money
                        col="3"
                        class="q-mb-sm"
                        v-model="model.tarjeta"
                        label="Tarjeta"
                        :disable="true"
                        prefijo="$ "
                        sufijo=""
                        icon="monetization_on"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                      />
                      <l-money
                        col="6"
                        v-model="model.total"
                        :disable="true"
                        prefijo="$ "
                        sufijo=""
                        icon="monetization_on"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                        valorMoney="valorMoney"
                        tituloinput="Total: "
                        class="inputliquidacion"
                      />
                    </div>
                  </div>
                  <div class="col-6 q-pl-xs">
                    <label class="q-pa-sm colorlabel text-weight-bold"
                      >Números consecutivos</label
                    >
                    <div class="row q-pa-sm">
                      <l-input
                        col="3"
                        v-model="model.planilla"
                        label="Número de planilla diaria"
                        :disable="disable_num_consecutivos"
                        type="number"
                        :min="1"
                        :rules="[
                          (val) => val > 0,
                          $rules.required($t('validator.required')),
                        ]"
                      />
                      <l-input
                        col="3"
                        v-model="model.ultimo_consecutivo"
                        label="Último consecutivo de consignaciones"
                        :disable="disable_num_consecutivos"
                        :rules="[$rules.required($t('validator.required'))]"
                      />
                      <can
                        permiso="view_menu_gestion_contable_informes_informe_diario_de_caja_acciones_editar_consecutivos"
                      >
                        <div class="q-mt-sm">
                          <q-btn
                            unelevated
                            round
                            dense
                            size="12px"
                            :color="
                              disable_num_consecutivos ? 'primary' : 'orange'
                            "
                            :icon="disable_num_consecutivos ? 'edit' : 'save'"
                            @click="
                              disable_num_consecutivos =
                                !disable_num_consecutivos
                            "
                          >
                            <q-tooltip>{{
                              disable_num_consecutivos ? "Modificar" : "Guardar"
                            }}</q-tooltip>
                          </q-btn>
                        </div>
                      </can>
                    </div>
                  </div>
                </div>
                <!-- </div> -->
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-form>
    </template>
    <template slot="footer">
      <div class="row justify-center">
        <div class="col-3">
          <q-btn
            dense
            rounded
            unelevated
            class="full-width btn_close"
            type="buttom"
            color="amber"
            :disable="!disable_num_consecutivos"
            @click="cerrarCaja()"
          >
            <span class="qbtn-label">Cerrar Caja</span>
          </q-btn>
        </div>
      </div>
    </template>
  </l-newmodal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  name: "cerrarcaja",
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tab: "datos_actuales",
      model: {
        caja_id: null,
        observaciones: null,
        fecha: null,
        documento_id: null,
        num_documento: null,
        planilla: null,
        ultimo_consecutivo: null,
        nueva_fecha: null,
        efectivo: 0,
        cheques: 0,
        consignacion: 0,
        tarjeta: 0,
        total: 0,
      },
      disable_num_consecutivos: true,
    };
  },
  computed: {
    ...mapState("parametros", ["centavos_contabilidad"]),
    formatNewFecha() {
      return moment(this.model.nueva_fecha, ["DD/MM/YYYY"])
        .lang("es")
        .format("dddd DD MMMM YYYY");
    },
  },
  methods: {
    async cerrarCaja() {
      const validate = await this.$refs.fromcerrar.validate();
      if (validate) {
        this.LConfim(
          "¿Está seguro de cerrar la caja?",
          () => {
            this.$emit("cerrar-caja", this.model);
            this.$refs.modalcerrar.close();
          },
          () => {}
        );
      }
    },
    abrirModal(total) {
      this.$refs.modalcerrar.open();
      this.model.caja_id = this.value.id;
      this.model.observaciones = null;
      this.model.planilla = parseInt(this.value.planilla) + 1;
      this.model.ultimo_consecutivo = this.value.ultimo_consecutivo_consig;
      this.model.documento_id = this.value.documento_id;
      this.model.num_documento = this.value.num_documento;
      this.model.fecha = this.value.fecha;
      this.model.nueva_fecha = moment(this.value.fecha, ["DD/MM/YYYY"])
        .add(1, "d")
        .format("DD/MM/YYYY");
      if (total != null) {
        this.model.efectivo = total.efectivo;
        this.model.cheques = total.cheque;
        this.model.consignacion = total.consignacion;
        this.model.tarjeta = total.tarjeta;
        this.model.total = total.total;
      }
    },
  },
};
</script>

<style lang="scss">
.divborder {
  border: 1px solid lightgray;
}
.colorlabel {
  color: #194880 !important;
}
.nopadding {
  & label {
    padding-bottom: 0px;
  }
  & .q-field__bottom {
    display: none;
  }
}
.inputliquidacion .q-field__prepend {
  background: #d4e8f8 0% 0% no-repeat padding-box;
  border-radius: 24px 0px 0px 24px;
  opacity: 1;
}
.inputliquidacion.q-field--standout .q-field__control {
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d4e8f8;
  border-radius: 24px;
  opacity: 1;
}
.inputliquidacion .q-field--outlined .q-field__control {
  padding: 0px 13px 0px 0px !important;
}
.inputliquidacion .q-field--outlined .q-field__control {
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d4e8f8;
  border-radius: 24px;
  opacity: 1;
}
.inputliquidacion .q-field--outlined .q-field__control:before {
  border: none !important;
}
@mixin btnaccionesmodal($codeicon) {
  &:hover {
    & .qbtn-label {
      position: relative;
      &::before {
        content: $codeicon;
        font-family: "Material Icons";
        position: absolute;
        left: -25px;
        font-size: 18px;
      }
    }
  }
}
.btn_close {
  @include btnaccionesmodal("\e5cd");
}
</style>
