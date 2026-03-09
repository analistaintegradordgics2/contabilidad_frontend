<template>
  <div class="q-ma-lg">
    <q-card flat>
      <q-card-section>
        <div class="row">
          <div class="row col-12">
            <label class="text-weight-bold q-pr-md fontblue">Cierre de mes</label>
            <q-separator class="espaciotab" />
            <can permiso="view_menu_contabilidad_consultas_cierres_acciones_cerrar_mes">
              <q-btn round dense color="primary q-ml-md" icon="mdi-lock" @click="accionesCierreMes(1)"
                v-if="validarcierremes.cerrado">
                <q-tooltip>Cerrar mes</q-tooltip>
              </q-btn>
            </can>
            <can
                  permiso="view_menu_contabilidad_consultas_cierres_acciones_reabrir_mes"
                >
                  <q-btn
                    unelevated
                    round
                    dense
                    color="orange"
                    icon="mdi-lock-open"
                    @click="accionesCierreMes(2)"
                    v-if="validarcierremes.reabierto"
                  >
                    <q-tooltip>Reabrir mes</q-tooltip>
                  </q-btn>
                </can>
          </div>
          <div class="col-12 ">
            <q-form ref="formcerrarmes" class="row q-pa-sm">
              <l-select col="3 text-black" v-model="model_mes.anio" option-value="id" class="q-field--float" option-label="nombre" label="Año *"
                :options="anio" :rules="[$rules.required($t('validator.required'))]" />
              <l-select col="3 text-black" v-model="model_mes.mes" option-value="id" option-label="nombre" label="Mes *"
                :options="meses" :rules="[$rules.required($t('validator.required'))]" />
            </q-form>
          </div>
          <div class="col-12 q-mt-lg">
            <div class="row col-12">
            <label class="text-weight-bold q-pr-md fontblue">Cierre de año</label>
            <q-separator class="espaciotab" />
            <div class="q-ml-sm flex items-center">
                    <can permiso="view_menu_contabilidad_consultas_cierres_acciones_cerrar_anio">
                      <q-btn unelevated round dense color="primary q-ml-md" icon="mdi-lock" @click="cerrarAnio()">
                        <q-tooltip>Cerrar año</q-tooltip>
                      </q-btn>
                    </can>
                  </div>
          </div>
          </div>
          <div class="col-12 ">
            <q-form ref="formcerraranio" class="row q-pa-sm">
              <div class="col-12">
                <div class="row">
                  <l-select :col="model_anio.proceso == 2 ? '2' : '3'" v-model="model_anio.anio" option-value="id" class="q-field--float"
                    option-label="nombre" label="Año *" :options="anio"
                    :rules="[$rules.required($t('validator.required'))]" />
                  <l-select-rest col="3" url="contabilidad/mayor/selectnew" v-model="model_anio.cta_utilidad"
                    label="Cuenta de utilidad *" :rules="[$rules.required($t('validator.required'))]"
                    v-if="model_anio.proceso == 2" />
                  <l-select-rest col="3" url="contabilidad/mayor/selectnew" v-model="model_anio.cta_perdida"
                    label="Cuenta de pérdida *" :rules="[$rules.required($t('validator.required'))]"
                    v-if="model_anio.proceso == 2" />
                  <l-select col="3" v-model="model_anio.concepto_id" option-value="id" option-label="codigo_nombre"
                    label="Concepto *" :options="conceptos_conta" :rules="[$rules.required($t('validator.required'))]"
                    v-if="model_anio.proceso == 2" />         
                </div>
              </div>
              <div class="col-12">
                <div class="row q-gutter-md">
                  <q-radio v-model="model_anio.proceso" label="Pasar saldos de este año al siguiente año" :val="1" />
                  <q-radio v-model="model_anio.proceso" label="Generar nota de cierre de cuentas de resultado (CIERRE 1)"
                    :val="2" />
                  <q-radio v-model="model_anio.proceso" label="Realizar cierre de año definitivo" :val="3" />
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  layout: "main",
  name: "cierre",
  data() {
    return {
      model_mes: {
        anio: null,
        mes: null,
      },
      model_anio: {
        anio: null,
        cta_utilidad: null,
        cta_perdida: null,
        concepto_id: null,
        cta_retenciones: null,
        cta_iva: null,
        nit_dian: null,
        proceso: 1,
      },
      validarcierremes: {
        cerrado: true,
        reabierto: false,
      },
      validarcierreanio: true,
      cierres: [],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    ...mapState("contabilidad", ["conceptos_conta"]),
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    ...mapActions("contabilidad", ["getList_conceptos_conta"]),
    async accionesCierreMes(tipo) {
      const validate = await this.$refs.formcerrarmes.validate();
      if (validate) {
        if (this.validateCierreMes() == true) {
          this.model_mes["tipo"] = tipo;
          await this.Post(
            "contabilidad/cierres/cerrar_mes",
            this.model_mes
          ).then((resp) => {
            if (resp.status == 200) {
              this.LFinish(resp.msg, () => {
                this.onResetMes();
              });
            } else {
              this.LInfo("warning", resp.msg);
            }
          });
        }
      }
    },
    async cerrarAnio() {
      const validate = await this.$refs.formcerraranio.validate();
      if (validate) {
        await this.Post(
          "contabilidad/cierres/cerrar_anio",
          this.model_anio
        ).then((resp) => {
          if (resp.status == 200) {
            this.LFinish(resp.msg, () => {
              this.onResetAnio();
            });
          } else {
            this.LInfo("warning", resp.msg);
          }
        });
      }
    },
    async getCierres() {
      await this.Get("contabilidad/cierres").then((resp) => {
        this.cierres = resp;
      });
    },
    validateCierreMes() {
      if (this.cierres.length > 0) {
        let anio = this.anio.filter((f) => f.id == this.model_mes.anio)[0]
          .nombre;
        let mes = this.model_mes.mes;
        let mescierre = this.cierres.filter(
          (f) => f.anio == anio && f.mes == mes
        );
        if (mescierre.length > 0) {
          let anio2 = null;
          let mes2 = null;
          let anio3 = null;
          let mes3 = null;
          if (mes == 1) {
            anio2 = anio - 1;
            mes2 = 12;
            anio3 = anio;
            mes3 = mes + 1;
          } else if (mes == 12) {
            anio3 = anio + 1;
            mes3 = 1;
            anio2 = anio;
            mes2 = mes - 1;
          } else {
            anio2 = anio;
            mes2 = mes - 1;
            anio3 = anio;
            mes3 = mes + 1;
          }
          // Validar mes anterior
          let cierre_anterior = this.cierres.filter(
            (f) => f.anio == anio2 && f.mes == mes2
          );
          // Validar mes siguiente
          let cierre_siguiente = this.cierres.filter(
            (f) => f.anio == anio3 && f.mes == mes3
          );
          if (cierre_anterior.length > 0) {
            if (cierre_siguiente.length > 0) {
              if (
                cierre_anterior[0].cierre == true &&
                cierre_anterior[0].reabierto == false
              ) {
                if (
                  cierre_siguiente[0].cierre == false ||
                  cierre_siguiente[0].reabierto == true
                ) {
                  if (mescierre[0].cierre == false) {
                    // Se esta cerrando el mes
                    if (mes != parseInt(moment().format("M"))  || (anio != parseInt(moment().format("Y"))) && mes == parseInt(moment().format("M"))) {
                      this.model_mes["cierre_mes_id"] = mescierre[0].id;
                      this.validarcierremes.cerrado = true;
                      this.validarcierremes.reabierto = false;
                    } else {
                      this.validarcierremes.cerrado = true;
                      this.validarcierremes.reabierto = false;
                      this.LInfo(
                        "warning",
                        "No se puede cerrar el mes actual."
                      );
                      return false;
                    }
                  } else {
                    // Se esta reabriendo el mes
                    this.model_mes["cierre_mes_id"] = mescierre[0].id;
                    this.validarcierremes.cerrado = false;
                    this.validarcierremes.reabierto = true;
                  }
                } else {
                  this.LInfo(
                    "warning",
                    "No se puede cerrar el mes ya que el mes siguiente no esta abierto."
                  );
                  return false;
                }
              } else {
                this.LInfo(
                  "warning",
                  "No se puede cerrar el mes ya que el mes anterior esta abierto."
                );
                return false;
              }
            } else {
              this.LInfo(
                "warning",
                "No existe el mes siguiente. por favor pasar saldos."
              );
              return false;
            }
          } else {
            this.LInfo(
              "warning",
              "No existe el mes anterior. por favor comuníquese con soporte."
            );
            return false;
          }
        } else {
          this.validarcierremes.cerrado = true;
          this.validarcierremes.reabierto = false;
          this.LInfo(
            "warning",
            "No existen movimientos contables en el mes seleccionado, no es posible realizar el cierre de mes."
          );
          return false;
        }
      } else {
        this.validarcierremes.cerrado = true;
        this.validarcierremes.reabierto = false;
        this.LInfo(
          "warning",
          "No existen meses creados, por favor pasar saldos."
        );
        return false;
      }
      return true;
    },
    onResetMes() {
      this.model_mes = {
        anio: null,
        mes: null,
      };
      this.validarcierremes = {
        cerrado: true,
        reabierto: false,
      };
      this.getCierres();
      setTimeout(() => {
        this.$refs.formcerrarmes.resetValidation();
      }, 500);
    },
    onResetAnio() {
      this.model_anio = {
        anio: null,
        cta_utilidad: null,
        cta_perdida: null,
        concepto_id: null,
        cta_retenciones: null,
        cta_iva: null,
        nit_dian: null,
        proceso: 1,
      };
      this.getParametros();
      setTimeout(() => {
        this.$refs.formcerraranio.resetValidation();
      }, 500);
    },
    async getParametros() {
      await this.Get("contabilidad/cierres/parametros").then((resp) => {
        this.model_anio.cta_utilidad = resp.cta_utilidad_id;
        this.model_anio.cta_perdida = resp.cta_perdida_id;
        this.model_anio.concepto_id = resp.concepto_nota_cierre_id;
      });
    },
  },
  watch: {
    "model_mes.anio"(val) {
      if (val != null && this.model_mes.mes != null) {
        this.validateCierreMes();
      }
    },
    "model_mes.mes"(val) {
      if (val != null && this.model_mes.anio != null) {
        this.validateCierreMes();
      }
    },
    model_mes: {
      handler(val) {
        if (this.model_anio.anio != null) {
          this.onResetAnio();
        }
      },
      deep: true,
    },
    model_anio: {
      handler(val) {
        if (this.model_mes.anio != null && this.model_mes.mes != null) {
          this.onResetMes();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getList_conceptos_conta();
    this.getConfMes();
    this.getConfAnio();
    this.getCierres();
    this.getParametros();
  },
};
</script>
<style>
.divborder {
  border: 1px solid lightgray;
  border-radius: 10px;
}
.espaciotab {
  border-color: #d8d8d8;
  margin-top: 15px;
}
.fontblue{
  color: #194880;
}
</style>
