<template>
  <div>
    <q-form ref="formencnotascontantble" class="form_enca">
      <q-tabs
        v-model="tab"
        dense
        flat
        class="tabprocesos"
        active-color="primary"
        indicator-color="primary"
        @input="cambiartabs"
        style="padding-top: 0px !important"
      >
        <q-tab name="inicio" label="Notas contables" />
        <q-tab name="auditoria" label="Auditorias" />
        <q-tab name="adjuntos" label="Archivos Adjuntos" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="q-mt-md">
        <q-tab-panel name="inicio" class="inicionota">
          <div class="row">
            <div class="col-12">
              <label class="text-weight-bold">Encabezado:</label>
            </div>

            <l-select
              col="3"
              v-model="model.tipo"
              label="Tipo *"
              optionValue="id"
              optionLabel="nombre"
              :options="tipodocumentofuente"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado || estado_documento == 4"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="selectTipoDocumento"
            />

            <l-date
              col="2 text-black"
              v-model="fechas.fecha"
              :rules="[$rules.required($t('validator.required'))]"
              colorico="primary"
              label="Fecha *"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              :error="estilo_error_fecha"
              @input="validarAñoFecha($event)"
            />
            <l-select
              col="3"
              v-model="model.concepto"
              label="Concepto *"
              optionValue="id"
              optionLabel="codigo_nombre"
              :options="conceptos_conta"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="asignarDetalleConcepto"
            />
            <l-input
              col="3 text-black"
              v-model="model.referencia"
              label="Documento de referencia"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="8 text-black divarea"
              v-model="model.detalle"
              label="Detalle"
              :readonly="estado"
              @input="$emit('eventos-notascontables', 7, $event)"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <!-- <q-checkbox 
              class="q-mb-md"
              v-model="model.incluir_cupones" 
              label="¿Incluir en el cupón?"
              :disable="estado"
              v-if="view_incluir_cupon"
            /> -->
            <!-- <q-checkbox class="q-mb-md q-mx-md" dense v-model="model.marcar_como_pago" label="Marcar movimientos como pago" :disable="estado || valCheckPago" v-if="auto != null ? auto.toLowerCase() != 'auto' : true" /> -->
          </div>
        </q-tab-panel>

        <q-tab-panel name="auditoria" class="q-pa-sm">
          <q-table
            :data="auditorias"
            :columns="audcolumns"
            :pagination.sync="pagination"
            flat
            bordered
            class="q-ma-sm"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td auto-width>
                  {{ formatFecha(props.row.fecha) }}
                </q-td>
                <q-td auto-width>
                  {{ props.row.evento }}
                </q-td>
                <q-td auto-width>
                  <!-- {{ props.row.foraneas.estado }} -->
                  <q-chip
                    :style="
                      props.row.foraneas.estado == 'ABIERTO'
                        ? 'background:#29C16040;border: 1px solid #29C160;'
                        : props.row.foraneas.estado == 'CERRADO'
                        ? 'background:#E2424240;border: 1px solid #E24242;'
                        : props.row.foraneas.estado == 'ANULADO'
                        ? 'background:#D8D8D840;border: 1px solid #D8D8D8;'
                        : props.row.foraneas.estado == 'REABIERTO'
                        ? 'background:#F5B21D40;border: 1px solid #F5B21D;'
                        : ''
                    "
                    dense
                    class="q-px-md text-weight-bold anulados"
                  >
                    {{ props.row.foraneas.estado }}
                  </q-chip>
                </q-td>
                <q-td auto-width>
                  {{ props.row.foraneas.usuario }}
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="full-width flex justify-center items-center">
                <q-icon size="24px" name="mdi-alert" color="red" /><span
                  class="q-ml-xs"
                >
                  Sin Datos Disponibles
                </span>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="adjuntos" class="q-pa-xl">
          <can
            permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_adjuntar_archivos"
          >
            <!-- <l-inmueble-form-archivos
              ref="addarchivos"
              v-model="archivos"
              :disable="
                estado_documento == 2 || estado_documento == 3 ? true : false
              "
              @limpiar-list="limpiar_archivos"
              :ver_archivos="true"
            /> -->
            <l-archivos :disable="estado" />
          </can>
        </q-tab-panel>
      </q-tab-panels>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
export default {
  name: "enca_notascontables",
  props: {
    encabezado: {
      type: Object,
      default: null,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    estado_documento: {
      type: Number,
      default: 0,
    },
    auditorias: {
      type: Array,
      default: () => [],
    },
    archivos_props: {
      type: Array,
      default: () => [],
    },
    view_incluir_cupon: {
      type: Boolean,
      default: false,
    },
    auto: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      valCheckPago: true,
      mescerrado: null,
      mesreabierto: null,
      pagination: {
        rowsPerPage: 10,
      },
      tab: "inicio",
      paramtab: {
        factura: false,
        contabilizacion: true,
      },
      fechas: {
        fecha: moment().format("DD/MM/YYYY"),
      },
      model: {
        tipo: null,
        fecha: null,
        concepto: null,
        detalle: null,
        referencia: null,
        persona: null,
        beneficiario: null,
        tipopago: null,
        total: 0,
        numcheque: null,
        ctadestino: null,
        ctaorigen: null,
        bancodestino: null,
        id: 0,
        usuario: this.$store.getters["auth/user"].id,
        // Estos valores se envian quemados ya que son para documentos de tipo ingreso pero se deben enviar.
        efectivo: 0,
        cheques: 0,
        consignacion: 0,
        tarjeta: 0,
        incluir_cupones: false,
        marcar_como_pago: false
      },
      // Estos valores se envian quemados ya que son para documentos de tipo ingreso pero se deben enviar.
      modelconsignacion: {
        valor: 0,
        banco: null,
        numero: null,
        fecha: null,
      },
      modeltarjeta: {
        valor: 0,
        banco: null,
        clase: null,
        numero: null,
        tipo: null,
      },
      cheques: [],
      // Fin
      audcolumns: [
        {
          name: "fecha",
          label: "Fecha",
          field: "fecha",
          align: "left",
          sortable: true,
        },
        {
          name: "evento",
          label: "Evento",
          align: "left",
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
        },
        {
          name: "usuario",
          label: "Usuario",
          align: "left",
        },
      ],
      archivos: [],
      tempTipoDocumento: null,
      estilo_error_fecha: false
    };
  },
  computed: {
    ...mapState("inmueble", ["bancos"]),
    ...mapState("contabilidad", [
      "clasetarjeta",
      "tipodocumentofuente",
      "conceptos_conta",
    ]),
  },
  methods: {
    ...mapActions("inmueble", ["getBancos"]),
    ...mapActions("contabilidad", ["getClaseTarjeta", "getTipodocumentoFuente"]),
    asignarDetalleConcepto(model) {
      if (model != null) {
        this.model.detalle = model.detalle;
      } else {
        this.model.detalle = null;
      }
      this.$emit('eventos-notascontables', 3, model);
    },
    formatFecha(fecha) {
      return moment(fecha).format("DD/MM/YYYY hh:mm a");
    },
    async onSubmit() {
      const validate = await this.$refs.formencnotascontantble.validate();
      if (validate) {
        var fecha1 = false;
        if (this.fechas.fecha != null) {
          fecha1 = moment(
            this.fechas.fecha,
            ["DD/MM/YYYY", "DD-MM-YYYY"],
            true
          ).isValid();
        }
        if (fecha1 == true) {
          this.model.fecha = moment(this.fechas.fecha, [
            "DD/MM/YYYY",
            "DD-MM-YYYY",
          ]).format("YYYY-MM-DD");
          var encabezado = {
            model: this.model,
            tarjetas: this.modeltarjeta,
            consignacion: this.modelconsignacion,
            cheques: this.cheques,
          };
          return encabezado;
        } else {
          this.LInfo("warning", "La fecha del documento es errónea.");
          return null;
        }
      }
    },
    onReset() {
      (this.mescerrado = null),
        (this.mesreabierto = null),
        (this.fechas = {
          fecha: moment().format("DD/MM/YYYY"),
        });
      this.model = {
        tipo: null,
        fecha: null,
        concepto: null,
        detalle: null,
        referencia: null,
        persona: null,
        efectivo: 0,
        cheques: 0,
        consignacion: 0,
        tarjeta: 0,
        total: 0,
        beneficiario: null,
        tipopago: null,
        numcheque: null,
        ctadestino: null,
        bancodestino: null,
        ctaorigen: null,
        id: 0,
        usuario: this.$store.getters["auth/user"].id,
        incluir_cupones: false,
        marcar_como_pago: false
      };
      this.modelcheque = {
        banco: null,
        numero: null,
        valor: 0,
      };
      this.modelconsignacion = {
        valor: 0,
        banco: null,
        numero: null,
        fecha: null,
      };
      this.modeltarjeta = {
        valor: 0,
        banco: null,
        clase: null,
        numero: null,
        tipo: null,
      };
      this.cheques = [];
      setTimeout(() => {
        this.$refs.formencnotascontantble.resetValidation();
      }, 500);
    },
    cambiartabs() {
      if (this.tab == "contabilizacion") {
        this.paramtab.factura = false;
        this.paramtab.contabilizacion = true;
        this.$emit("cambio-tabs", this.paramtab);
      } else if (this.tab == "inicio") {
        this.paramtab.factura = false;
        this.paramtab.contabilizacion = true;
        this.$emit("cambio-tabs", this.paramtab);
      } else if (this.tab == "adjuntos") {
        this.paramtab = {
          factura: false,
          contabilizacion: false,
        };
        this.$emit("cambio-tabs", this.paramtab);
      } else {
        this.paramtab = {
          factura: false,
          contabilizacion: false,
        };
        this.$emit("cambio-tabs", this.paramtab);
      }
    },
    limpiar_archivos() {
      this.archivos = [];
    },
    async selectConcepto(id) {
      const data = await this.Get("contabilidad/concepto/" + id);
      this.model.detalle = data.detalle;
    },
    fechaactual() {
      this.model.fecha = moment().format("YYYY-MM-DD");
      this.fechas.fecha = moment().format("DD/MM/YYYY");
    },
    async getmescerrado() {
      let params = { mes: this.fechas.fecha };
      await this.Post("contabilidad/documentos/mescerrado", params).then((data) => {
        this.mescerrado = data.cierre;
        this.mesreabierto = data.reabierto;
      });
    },
    asignarIncluirEnCupon(val) {
      this.model.incluir_cupones = val;
    },
    validateCheckPago(val) {
      this.valCheckPago = !val;
    },
    changeCheckPago(val) {
      this.model.marcar_como_pago = val;
    },
    selectTipoDocumento(model) {
      if (!model) return;

      const nuevoTipo = model.id;
      const tipoAnterior = this.tempTipoDocumento;

      if (tipoAnterior !== null) {
        if (nuevoTipo !== tipoAnterior) {
          this.LConfim(
            "¿Está seguro de cambiar el tipo de documento seleccionado inicialmente?",
            () => {
              this.tempTipoDocumento = nuevoTipo;
            },
            () => {
              this.model.tipo = tipoAnterior;
            }
          );
        }
      } else {
        this.tempTipoDocumento = nuevoTipo;
      }
    },
    async validarAñoFecha(val) {
      if (val != null && moment(val, ["DD/MM/YYYY", "YYYY/MM/DD"], true).isValid()) {
        const formatFecha = moment(val, ["DD/MM/YYYY", "YYYY/MM/DD"]).format("YYYY");
        const añoActual = moment().format("YYYY");
        if (formatFecha != añoActual) {
          await this.validatFechaMes(val);
          if (this.fechas.fecha != null) {
            this.LConfim("La fecha ingresada pertenece a un año diferente al actual. ¿Desea continuar de todos modos?", () => {}, () => {
              this.fechas.fecha = null;
            });
          }
        } else {
          this.validatFechaMes(val);
        }
      }
    },
    async validatFechaMes(val) {
      if (!this.estado && this.model.id != 0) {
        if (val != null) {
          let fecha_documento = moment().format("YYYY-MM-DD");
          if (this.model.fecha != null) {
            fecha_documento = this.model.fecha;
          }
          let arrayFormat = ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"];
          if (moment(val, arrayFormat, true).isValid()) {
            let fecha_rango_ini = moment(fecha_documento, arrayFormat).startOf("month").startOf("day").format("YYYY-MM-DD");
            let fecha_rango_fin = moment(fecha_documento, arrayFormat).endOf("month").endOf("day").format("YYYY-MM-DD");
            let fecha = moment(val, arrayFormat).format("YYYY-MM-DD");
            if (!moment(fecha).isBetween(fecha_rango_ini, fecha_rango_fin, undefined, "[]")) {
              this.LInfo(
                "warning",
                "Fecha fuera del rango del mes en que se realizo el documento."
              );
              this.fechas.fecha = null;
            }
          } else {
            const regexFechaCompleta = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!regexFechaCompleta.test(val)) {
              this.estilo_error_fecha = false
              return;
            }
            this.estilo_error_fecha = true
            this.LInfo("warning", "Fecha no existe");
          }
        }
      }
    }
  },
  watch: {
    archivos: {
      deep: true,
      handler() {
        this.$emit("change_files", this.archivos);
      },
    },
    "model.concepto"(val) {
      try {
        if (val != "" && val != null) {
          if (!this.estado) {
            this.selectConcepto(val);
          }
        } else {
          this.model.detalle = null;
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    encabezado() {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      // Formatear fecha a DD/MM/YYYY para el formulario
      if (this.encabezado.model.fecha) {
        this.encabezado.model.fecha = moment(
          this.encabezado.model.fecha,
          ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"]
        ).format("DD/MM/YYYY");
      }
      if (this.encabezado.modelconsignacion && this.encabezado.modelconsignacion.fecha != null) {
        this.encabezado.modelconsignacion.fecha = moment(
          this.encabezado.modelconsignacion.fecha,
          ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"]
        ).format("DD/MM/YYYY");
      }
      this.fechas = {
        fecha: this.encabezado.model.fecha,
        fechaconsignacion: this.encabezado.modelconsignacion ? this.encabezado.modelconsignacion.fecha : null,
      };
      this.model = this.encabezado.model;
      this.modelconsignacion = this.encabezado.modelconsignacion;
      this.modeltarjeta = this.encabezado.modeltarjeta;
      this.encabezado.cheques.forEach((element) => {
        this.cheques.push({
          banco: element.bancos.id,
          numero: element.numero,
          valor: element.valor,
          total: formatterPeso.format(element.valor),
          nbanco: element.bancos.nombre,
        });
      });
      this.tempTipoDocumento = this.encabezado.model.tipo;
    },
    view_incluir_cupon(val) {
      // if (val == false && this.estado == false) {
      //   this.model.incluir_cupones = false;
      // }
    }
  },
  created() {
    this.getBancos();
    this.getClaseTarjeta();
    this.getTipodocumentoFuente({ id: 3 });
    this.cambiartabs();
  },
};
</script>

<style lang="scss">
.inicionota {
  height: 160px !important;
  background: #f1f7fc 0% 0% no-repeat padding-box;
  opacity: 1;
}
.qtab {
  border: 1px solid lightgray;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.qpanel {
  border: 1px solid lightgray;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.divqpanel {
  border: 1px solid lightgray;
  border-radius: 5px;
}
.q-table__top.relative-position.row.items-center {
  padding: 5px !important;
}
div.qinputheigth,
/* div.divarea {
  font-size: 10px;
} */

.inicio {
  height: 145px !important;
}

.form_enca {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: inset !important;
  }
}
</style>
