<template>
  <div>
    <q-form ref="formencegresos" class="form_enca">
      <q-tabs
        v-model="tab"
        dense
        flat
        class="tabprocesos"
        active-color="primary"
        indicator-color="primary"
        @input="cambiartabs"
        style="padding-top: 0px !important"
        narrow-indicator
      >
        <q-tab size="12px" name="inicio" label="Egresos" />
        <q-tab name="auditoria" label="Auditorias" />
        <q-tab name="adjuntos" label="Archivos Adjuntos" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="q-mt-s">
        <!-- style="height: 150px !important" -->
        <q-tab-panel name="inicio" class="inicioegreso">
          <div class="row">
            <div class="col-12">
              <label class="text-weight-bold">Encabezado:</label>
            </div>
            <l-select
              col="2 textinput"
              v-model="model.tipo"
              value="id"
              option-label="nombre"
              :options="tipodocumentofuente"
              label="Tipo *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="selectTipoDocumento"
            />
            <l-select
              col="2 textinput"
              v-model="model.concepto"
              option-value="id"
              option-label="codigo_nombre"
              :options="conceptos_conta"
              label="Concepto *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="asignarDetalleConcepto"
            />
            <l-input
              col="2 text-black textinput"
              v-model="model.detalle"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              label="Detalle"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-select-rest
              col="2 textinput"
              url="tercero/personas/selectnew"
              v-model="model.persona"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              @emitselecte="select_persona"
              label="Persona *"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-date
              col="2 text-black textinput"
              v-model="fechas.fecha"
              :rules="[$rules.required($t('validator.required'))]"
              colorico="primary"
              :readonly="estado"
              label="Fecha *"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              :error="estilo_error_fecha"
              @input="validarAñoFecha($event)"
            />
            <l-select-rest
              col="2 textinput"
              url="tercero/personas/selectnew"
              v-model="model.beneficiario"
              :readonly="estado"
              @emitselecte="select_persona"
              label="Beneficiario"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <div class="col-12">
              <label class="text-weight-bold">Forma de pago:</label>
            </div>
            <l-select
              col="2"
              v-model="formapago"
              :options="options"
              optionLabel="label"
              optionValue="id"
              label="Tipo de Pago"
              :class="`${estado ? 'text-weight-bold text-black' : ''}`"
              :readonly="estado"
            />
            <l-money
              col="2 q-mb-sm"
              v-model="model.total"
              prefijo="$"
              sufijo=""
              valorMoney="valorMoney"
              tituloinput="Valor:"
              class="inputdocu"
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="2 text-black textinput"
              v-model="model.numcheque"
              :readonly="formapago == 1 || estado"
              v-if="formapago == 2"
              label="# Cheque"
            />
            <l-select
              col="2 textinput"
              :clearable="true"
              v-model="model.ctaorigen"
              value="id"
              option-label="nombre"
              label="Cuenta Origen"
              :options="list_bancos_mayor"
              :readonly="formapago == 1 || estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="2 text-black textinput"
              v-model="model.ctadestino"
              :readonly="formapago == 1 || estado"
              v-if="formapago != 2 && formapago != 6"
              label="Cuenta Destino"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-select
              col="2 text-black textinput"
              :clearable="true"
              v-model="model.bancodestino"
              value="id"
              option-label="nombre"
              :options="list_bancos"
              label="Banco Destino"
              :readonly="formapago == 1 || formapago == 2 || estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <!-- <q-checkbox 
              v-model="model.incluir_cupones" 
              label="¿Incluir en el cupón?"
              :disable="estado"
              v-if="view_incluir_cupon"
            /> -->
            <!-- <div class="q-ml-sm q-my-sm">
              <q-checkbox dense v-model="model.marcar_como_pago" label="Marcar movimientos como pago" :disable="estado || valCheckPago" v-if="auto != null ? auto.toLowerCase() != 'auto' : true" />
            </div> -->
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
  name: "enca_egresos",
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
      pagination: {
        rowsPerPage: 10,
      },
      tab: "inicio",
      paramtab: {
        factura: false,
        contabilizacion: true,
      },
      formapago: 3,
      fechas: {
        fecha: moment().format("DD/MM/YYYY"),
      },
      options: [
        {
          id: 1,
          label: "Efectivo",
        },
        {
          id: 2,
          label: "Cheque",
        },
        {
          id: 3,
          label: "Transferencia",
        },
      ],
      model: {
        tipo: null,
        fecha: null,
        concepto: null,
        detalle: null,
        referencia: null,
        persona: null,
        beneficiario: null,
        tipopago: 3,
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
      list_bancos_mayor: [],
      list_bancos: [],
      archivos: [],
      valCheckPago: true,
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
      "ctabanco",
    ]),
    ...mapState("parametros", ["centavos_contabilidad", "cta_prop_id", "cta_admon_id"]),
  },
  methods: {
    ...mapActions("inmueble", ["getBancos"]),
    ...mapActions("contabilidad", [
      "getClaseTarjeta",
      "getTipodocumentoFuente",
    ]),
    asignarDetalleConcepto(model) {
      this.$emit('eventos-egresos', 3, model);
      if (model != null) {
        this.model.detalle = model.detalle;
      } else {
        this.model.detalle = null;
      }
    },
    select_persona(model) {
      if(!this.estado) {
        if (model != null) {
          this.$emit("eventos-egresos", 4, {id: model.value});
          if (this.model.tipopago != 1) {
            if (this.model.tipopago == 3) {
              this.model.ctadestino = model.modelo.forma_de_pago.cuenta;
            } else {
              this.model.numcheque = model.modelo.forma_de_pago.cuenta;
            }
            this.model.bancodestino = model.modelo.forma_de_pago.banco;
          }
        } else {
          this.$emit("eventos-egresos", 4, null);
        }
      }
    },
    formatFecha(fecha) {
      return moment(fecha).format("DD/MM/YYYY hh:mm a");
    },
    async onSubmit() {
      const validate = await this.$refs.formencegresos.validate();
      if (validate) {
        if (this.model.total > 0) {
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
            var validateFormapago = true;
            if (this.model.tipopago == 2) {
              this.model.efectivo = this.model.total;
            } else if (this.model.tipopago == 3) {
              this.model.consignacion = this.model.total;
            } else if (this.model.tipopago == 1) {
              this.model.cheques = this.model.total;
              // validateFormapago = true;
            }
            if (validateFormapago == true) {
              var encabezado = {
                model: this.model,
                tarjetas: this.modeltarjeta,
                consignacion: this.modelconsignacion,
                cheques: this.cheques,
              };
              return encabezado;
            } else {
              this.LInfo(
                "warning",
                "Faltan campos por diligenciar en forma de pago."
              );
              return null;
            }
          } else {
            this.LInfo("warning", "La fecha del documento es errónea.");
            return null;
          }
        } else {
          this.LInfo("warning", "El valor del documento no puede ser cero.");
          return null;
        }
      }
    },
    onReset() {
      this.fechas = {
        fecha: moment().format("DD/MM/YYYY"),
      };
      this.model = {
        tipo: null,
        fecha: moment().format("DD/MM/YYYY"),
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
        marcar_como_pago: null
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
        this.$refs.formencegresos.resetValidation();
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
    asignarValor(val) {
      this.model.total = val;
    },
    fechaactual() {
      this.model.fecha = moment().format("YYYY-MM-DD");
      this.fechas.fecha = moment().format("DD/MM/YYYY");
    },
    async getBancosMayor() {
      await this.Get("contabilidad/ctabanco").then((resp) => {
        this.list_bancos_mayor = resp;
      });
    },
    async getBancos() {
      await this.Get("parametrizacion/bancos").then((resp) => {
        this.list_bancos = resp;
      });
    },
    limpiar_archivos() {
      this.archivos = [];
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
    "model.detalle"(val) {
      this.$emit("eventos-egresos", 7, val);
    },
    "model.ctaorigen"(val) {
      if (val != null) {
        setTimeout(() => {
          var result = this.list_bancos_mayor.filter(
            (filter) => filter.id == val
          );
          // Cuenta por defecto en la primera linea de la grid es banco
          if (result.length > 0) {
            this.$emit("eventos-egresos", 6, {
              tipo: "EGRESO",
              clase: "BANCO",
              id: result[0].mayor,
            });
          }
        }, 500);
      }
    },
    formapago(val) {
      this.model.tipopago = val;
      switch (val) {
        case 1:
          this.model.ctadestino = null;
          this.model.ctaorigen = null;
          this.model.numcheque = null;
          this.model.bancodestino = null;
          this.$emit("eventos-egresos", 6, {
            tipo: "EGRESO",
            clase: "CAJA",
          });
          break;
        case 2:
          this.model.numcheque = this.model.numcheque;
          this.model.ctadestino = null;
          // this.model.bancodestino = null;
          break;
        case 3:
          this.model.ctadestino = this.model.ctadestino;
          this.model.numcheque = null;
          break;
      }
    },
    encabezado() {
      this.model.ctadestino = null;
      this.model.ctaorigen = null;
      this.model.numcheque = null;
      this.model.bancodestino = null;
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
      if (this.model.tipopago > 3 && this.model.tipopago < 6) {
        this.formapago = 3;
      } else if (this.model.tipopago == 6) {
        this.formapago = 1;
      } else {
        this.formapago = this.model.tipopago;
      }
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
    this.getTipodocumentoFuente({ id: 2 });
    this.cambiartabs();
    this.getBancosMayor();
  },
};
</script>

<style lang="scss">
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
  padding-left: 0px;
  padding-right: 0px;
}
.divqpanel {
  border: 1px solid lightgray;
  border-radius: 5px;
}
.q-table__top.relative-position.row.items-center {
  padding: 5px !important;
}
/* .radioegreso {
  font-size: 12px;
} */
.inicioegreso {
  height: 235px !important;
  background: #f1f7fc 0% 0% no-repeat padding-box;
  opacity: 1;
}
.widthinput {
  width: 80% !important;
}

.valor input {
  font-weight: bold;
}

.inicio {
  height: 131px !important;
}

/* .textinput input {
  font-size: 12px;
} */

.form_enca {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: inset !important;
  }
}
</style>
