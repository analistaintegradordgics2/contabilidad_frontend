<template>
  <div>
    <q-form ref="formencingreso" class="form_enca">
      <q-tabs
        v-model="tab"
        dense
        flat
        class="tabprocesos"
        style="padding-top: 0px !important"
        active-color="primary"
        indicator-color="primary"
        @input="cambiartabs"
        narrow-indicator
      >
        <q-tab
          size="12px"
          name="inicio"
          label="Ingresos"
          @click="cheques_valor()"
        />
        <q-tab name="opciones" label="Tarjeta, Consignación, Cheques" />
        <q-tab name="auditoria" label="Auditorias" />
        <q-tab name="adjuntos" label="Archivos Adjuntos" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="q-mt-md">
        <q-tab-panel name="inicio" class="inicioingreso">
          <div class="row">
            <div class="col-12">
              <label class="text-weight-bold">Encabezado:</label>
            </div>
            <l-select
              col="2 textinput"
              v-model="model.tipo"
              label="Tipo *"
              :options="tiposDocumentoFiltrados"
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
              label="Conceptos *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="asignarDetalleConcepto"
            />
            <l-input
              col="3 text-black textinput"
              v-model="model.detalle"
              label="Detalle"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-select-rest
              col="3 textinput"
              url="tercero/personas/selectnew"
              v-model="model.persona"
              label="Persona *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @emitselecte="selectPersona"
            />
            <l-date
              col="2 text-black textinput"
              v-model="fechas.fecha"
              label="Fecha *"
              :rules="[$rules.required($t('validator.required'))]"
              colorico="primary"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              :error="estilo_error_fecha"
              @input="validarAñoFecha($event)"
            />
            <div class="col-12">
              <label class="text-weight-bold">Forma de Pago:</label>
            </div>
            <l-money
              col="2"
              v-model="model.efectivo"
              prefijo="$"
              sufijo=""
              valorMoney="valorMoney"
              tituloinput="Efectivo"
              class="inputdocu"
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="estado"
            />
            <l-money
              col="2 text-black textinput"
              v-model="model.cheques"
              prefijo="$ "
              sufijo=""
              valorMoney="valorMoney"
              tituloinput="Cheques"
              :precision="centavos_contabilidad == true ? 2 : 0"
              class="inputdocu"
              :readonly="true"
            />
            <l-money
              col="2 text-black textinput"
              v-model="model.consignacion"
              prefijo="$ "
              sufijo=""
              valorMoney="valorMoney"
              tituloinput="Consig"
              :precision="centavos_contabilidad == true ? 2 : 0"
              class="inputdocu"
              :readonly="true"
            />
            <l-money
              col="2 text-black textinput"
              v-model="model.tarjeta"
              prefijo="$ "
              sufijo=""
              valorMoney="valorMoney"
              tituloinput="Tarjeta"
              class="inputdocu"
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="true"
            />
            <!-- <q-checkbox 
              class="q-mb-md"
              v-model="model.incluir_cupones" 
              label="¿Incluir en el cupón?"
              :disable="estado"
              v-if="view_incluir_cupon"
            /> -->
            <q-space />
            <l-money
              col="2 text-black bold textinput"
              v-model="model.total"
              prefijo="$ "
              sufijo=""
              class="inputdocu"
              valorMoney="valorMoney"
              tituloinput="Total"
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="true"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="opciones" class="q-pa-sm">
          <div class="row">
            <div class="col-md-12 q-pa-sm">
              <div class="q-pa-xs row">
                <label class="text-weight-bold col-12 class_textcolor"
                  >Tarjeta</label
                >
                <div class="col-12 q-mb-sm">
                  <q-radio
                    v-model="modeltarjeta.tipo"
                    :val="1"
                    label="Crédito"
                    style="font-size: 14px"
                    :disable="estado"
                    :class="`${estado ? 'text-weight-bold text-black' : ''}`"
                  />
                  <q-radio
                    v-model="modeltarjeta.tipo"
                    :val="2"
                    label="Debito"
                    style="font-size: 14px"
                    :disable="estado"
                    :class="`${estado ? 'text-weight-bold text-black' : ''}`"
                  />
                  <q-btn
                    unelevated
                    round
                    dense
                    color="red"
                    size="10px"
                    class="q-ml-md"
                    @click="quitarseleccion"
                    v-if="modeltarjeta.tipo != null && !estado"
                  >
                    <q-icon name="clear" color="withe" size="20px" />
                    <q-tooltip>Quitar selección</q-tooltip>
                  </q-btn>
                </div>
                <l-money
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modeltarjeta.valor"
                  label="Valor"
                  prefijo="$ "
                  sufijo=""
                  :precision="centavos_contabilidad == true ? 2 : 0"
                  style_val="margin-bottom: 24px !important;"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
                <l-select
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modeltarjeta.banco"
                  :options="bancos"
                  label="Banco"
                  :readonly="estado"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                  @selected="selectBanco($event, 2)"
                />
                <l-select
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modeltarjeta.clase"
                  :options="clasetarjeta"
                  label="Clase"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
                <l-input
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modeltarjeta.numero"
                  label="Numero"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
              </div>
            </div>
            <div class="col-md-12 q-pa-sm">
              <div class="q-pa-xs q-mb-sm row">
                <label class="text-weight-bold col-12 q-mb-sm class_textcolor"
                  >Consignaciones</label
                >
                <l-money
                  col="md-3 q-mb-md text-black textinput q-mb-lg"
                  v-model="modelconsignacion.valor"
                  label="Valor"
                  prefijo="$ "
                  sufijo=""
                  :precision="centavos_contabilidad == true ? 2 : 0"
                  style_val="margin-bottom: 24px !important;"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
                <l-select
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modelconsignacion.banco"
                  value="id"
                  option-label="nombre"
                  :options="bancosConsig"
                  label="Banco"
                  :readonly="estado"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                  @selected="selectBanco($event, 2)"
                />
                <l-input
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="modelconsignacion.numero"
                  label="Numero"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
                <l-date
                  col="md-3 text-black textinput q-mb-lg"
                  v-model="fechas.fechaconsignacion"
                  label="Fecha"
                  colorico="primary"
                  :readonly="estado"
                  :class_input="`${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                />
              </div>
            </div>
            <div class="col-md-12">
              <div class="row q-pa-sm">
                <label class="text-weight-bold class_textcolor">Cheques</label>
                <q-separator
                  style="margin-left: 20px; width: 88%; margin-top: 16px"
                />
                <q-space />
                <q-btn
                  round
                  dense
                  unelevated
                  color="primary"
                  @click="nuevo_cheque"
                  :disable="estado"
                >
                  <q-tooltip>Agregar</q-tooltip>
                  <q-icon name="add" />
                </q-btn>
              </div>
              <q-table
                :data="cheques"
                :columns="columns"
                row-key="name"
                flat
                bordered
                class="q-ma-sm"
              >
                <template v-slot:body="props">
                  <!-- {{props}} -->
                  <q-tr>
                    <q-td auto-width>
                      <span v-if="abrir_cheque == false">{{
                        props.row.nbanco
                      }}</span>
                      <l-select
                        col="3 text-black q-mb-md q-mt-sm"
                        v-model="props.row.banco"
                        value="id"
                        v-if="abrir_cheque == true"
                        option-label="nombre"
                        :options="bancos"
                        label="Banco"
                      />
                    </q-td>
                    <q-td auto-width>
                      <span v-if="abrir_cheque == false">{{
                        props.row.numero
                      }}</span>
                      <l-input
                        col="text-black q-mt-sm"
                        v-if="abrir_cheque == true"
                        v-model="props.row.numero"
                        label="Número"
                      />
                    </q-td>
                    <q-td auto-width>
                      <span v-if="abrir_cheque == false">{{
                        props.row.total
                      }}</span>
                      <l-money
                        col="md-4 text-black q-mb-md q-mt-sm"
                        v-model="props.row.valor"
                        label="Valor"
                        prefijo="$ "
                        sufijo=""
                        v-if="abrir_cheque == true"
                        :precision="centavos_contabilidad == true ? 2 : 0"
                      />
                    </q-td>
                    <q-td auto-width class="text-center qtd">
                      <q-btn
                        size="xs"
                        color="green"
                        round
                        dense
                        unelevated
                        icon="check"
                        v-if="abrir_cheque == true"
                        @click="agregarcheque"
                        :disable="estado"
                        class="q-mr-sm btn"
                      >
                        <!-- <q-tooltip>Eliminar cheque</q-tooltip> -->
                      </q-btn>
                      <q-btn
                        size="xs"
                        color="primary"
                        round
                        dense
                        unelevated
                        icon="delete"
                        @click="eliminarcheque(props.rowIndex)"
                        :disable="estado"
                      >
                        <q-tooltip>Eliminar cheque</q-tooltip>
                      </q-btn>
                    </q-td>
                  </q-tr>
                </template>
                <template v-slot:no-data>
                  <div class="row flex-center q-gutter-sm">
                    <q-icon size="2em" name="warning" />
                    <label>Sin datos disponibles</label>
                  </div>
                </template>
              </q-table>
            </div>
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
  name: "enca_ingresos",
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
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      abrir_cheque: false,
      tab: "inicio",
      paramtab: {
        factura: false,
        contabilizacion: true,
      },
      fechas: {
        fecha: moment().format("DD/MM/YYYY"),
        fechaconsignacion: null,
      },
      model: {
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
        // Estos valores se envian quemados ya que son para documentos de tipo egresos pero se deben enviar.
        beneficiario: null,
        tipopago: null,
        numcheque: null,
        ctadestino: null,
        bancodestino: null,
        ctaorigen: null,
        // Fin
        id: 0,
        usuario: this.$store.getters["auth/user"].id,
        incluir_cupones: false,
        copiado: false,
      },
      modelcheque: {
        banco: null,
        numero: null,
        valor: 0,
      },
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
      columns: [
        {
          name: "banco",
          required: true,
          label: "Banco",
          align: "left",
          sortable: true,
        },
        {
          name: "numero",
          label: "Número",
          align: "left",
          sortable: true,
        },
        {
          name: "total",
          label: "Valor",
          align: "left",
          sortable: true,
        },
        {
          name: "accion",
          label: "Acción",
          align: "center",
          field: "accion",
        },
      ],
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
      archivos: [],
      bancosConsig: [],
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
    ...mapState("parametros", ["centavos_contabilidad", "cta_arr_id"]),
    ...mapState("auth", ["permisos", "user"]),
    tiposDocumentoFiltrados() {
      // const permisosStorage = JSON.parse(localStorage.getItem('permisos')) || [];
      // const user = JSON.parse(localStorage.getItem('user')) || {};
      const isSuperuser = this._.get(this.user, 'is_superuser', false);
      const canReciboCaja = isSuperuser || this.permisos.includes('add_recibo_caja');
      const canRecibBanco = isSuperuser || this.permisos.includes('add_recibo_banco');
      if (!this.tipodocumentofuente || this.tipodocumentofuente.length === 0) {
        return [];
      }
      // Filtrar según el permiso y si el documento está en modo lectura (this.estado)
      if ((canReciboCaja && canRecibBanco) || this.estado) {
        // Si tiene el permiso, mostrar todos
        return this.tipodocumentofuente;
      } else if (!canReciboCaja) {
        return this.tipodocumentofuente.filter(tipo =>tipo.tipo !== 'RC');
      } else if (!canRecibBanco) {
        return this.tipodocumentofuente.filter(tipo =>tipo.tipo !== 'RB');
      } else {
        return this.tipodocumentofuente.filter(tipo =>tipo.tipo !== 'RB').filter(tipo =>tipo.tipo !== 'RC');
      }
    }
  },
  methods: {
    ...mapActions("inmueble", ["getBancos"]),
    ...mapActions("contabilidad", [
      "getClaseTarjeta",
      "getTipodocumentoFuente",
    ]),
    selectBanco(model, tipo) {
      if (model != null) {
        var result = this.list_bancos_mayor.filter(
          (filter) => filter.banco == model.id
        );
        if (result.length > 0) {
          if (tipo == 1) {
            this.$emit("eventos-ingresos", 6, {
              tipo: "INGRESO",
              clase: "BANCO",
              id: result[0].mayor,
            });
          } else {
            this.$emit("eventos-ingresos", 6, {
              tipo: "INGRESO",
              clase: "BANCO",
              id: result[0].mayor,
            });
          }
        }
      }
    },
    asignarDetalleConcepto(model) {
      if (model != null) {
        this.model.detalle = model.detalle;
        this.$emit("eventos-ingresos", 3, model);
      } else {
        this.model.detalle = null;
        this.$emit("eventos-ingresos", 3, null);
      }
    },
    formatFecha(fecha) {
      return moment(fecha).format("DD/MM/YYYY hh:mm a");
    },
    async onSubmit() {
      try {
        const validate = await this.$refs.formencingreso.validate();
        if (validate) {
          if (this.model.total > 0) {
            var tarjeta = false;
            var consignacion = false;
            if (
              this.modelconsignacion.valor != 0 ||
              this.modelconsignacion.banco != null ||
              this.modelconsignacion.numero != null ||
              this.fechas.fechaconsignacion != null
            ) {
              if (
                this.modelconsignacion.valor != 0 &&
                this.modelconsignacion.banco != null &&
                // this.modelconsignacion.numero != null &&
                this.fechas.fechaconsignacion != null
              ) {
                consignacion = false;
              } else {
                consignacion = true;
              }
            }
            if (
              this.modeltarjeta.valor != 0 ||
              this.modeltarjeta.banco != null ||
              this.modeltarjeta.clase != null ||
              this.modeltarjeta.numero != null ||
              this.modeltarjeta.tipo != null
            ) {
              if (
                (this.modeltarjeta.valor != 0) &
                (this.modeltarjeta.banco != null) &
                (this.modeltarjeta.clase != null) &
                // (this.modeltarjeta.numero != null) &
                (this.modeltarjeta.tipo != null)
              ) {
                tarjeta = false;
              } else {
                tarjeta = true;
              }
            }
            var fecha1 = false;
            var fecha2 = false;
            if (this.fechas.fecha != null) {
              fecha1 = moment(
                this.fechas.fecha,
                ["DD/MM/YYYY", "DD-MM-YYYY"],
                true
              ).isValid();
            }
            if (this.fechas.fechaconsignacion != null) {
              fecha2 = moment(
                this.fechas.fechaconsignacion,
                ["DD/MM/YYYY", "DD-MM-YYYY"],
                true
              ).isValid();
            } else {
              fecha2 = true;
            }
            if (tarjeta == false && consignacion == false) {
              if (fecha1 == true && fecha2 == true) {
                this.model.fecha = moment(this.fechas.fecha, [
                  "DD/MM/YYYY",
                  "DD-MM-YYYY",
                ]).format("YYYY-MM-DD");

                if (this.fechas.fechaconsignacion != null) {
                  this.modelconsignacion.fecha = moment(
                    this.fechas.fechaconsignacion,
                    ["DD/MM/YYYY", "DD-MM-YYYY"]
                  ).format("YYYY-MM-DD");
                }
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
                  "Alguna de las fechas del documento es errónea."
                );
                return null;
              }
            } else {
              this.LInfo(
                "warning",
                "Faltan campos por diligenciar en tarjeta, consignación o cheques."
              );
              return null;
            }
          } else {
            this.LInfo("warning", "El total del documento no puede ser cero.");
            return null;
          }
        } else {
          return null;
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    limpiar_cheques() {
      this.cheques = [];
    },
    cheques_valor() {
      this.model.cheques = 0;
      this.model.total = 0;
      this.cheques.forEach((element) => {
        this.model.cheques = this.model.cheques + element.valor;
      });
      this.model.total =
        this.model.efectivo +
        this.model.cheques +
        this.model.consignacion +
        this.model.tarjeta;
    },
    onReset() {
      this.fechas = {
        fecha: moment().format("DD/MM/YYYY"),
        fechaconsignacion: null,
      };
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
        incluir_cupones: false
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
        this.$refs.formencingreso.resetValidation();
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
    agregarcheque() {
      if (
        this.modelcheque.banco != null &&
        this.modelcheque.numero != null &&
        this.modelcheque.valor > 0
      ) {
        const formatterPeso = new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        });
        this.modelcheque.total = formatterPeso.format(this.modelcheque.valor);
        const result = this.bancos.filter(
          (filter) => filter.id == this.modelcheque.banco
        );
        this.modelcheque["nbanco"] = result[0].nombre;
        // this.cheques.push(this.modelcheque);
        this.abrir_cheque = false;
        // this.$refs.nuevocheque.close();
      } else {
        this.LInfo("warning", "Ingrese todos los campos correspondientes.");
      }
    },
    nuevo_cheque() {
      this.modelcheque = {
        banco: null,
        numero: null,
        valor: 0,
      };
      this.cheques.push(this.modelcheque);
      // this.$refs.nuevocheque.open();
      this.abrir_cheque = true;
    },
    eliminarcheque(index) {
      this.cheques.splice(index, 1);
    },
    fechaactual() {
      this.model.fecha = moment().format("YYYY-MM-DD");
      this.fechas.fecha = moment().format("DD/MM/YYYY");
    },
    quitarseleccion() {
      this.modeltarjeta.tipo = null;
    },
    limpiar_archivos() {
      this.archivos = [];
    },
    async getBancosMayor() {
      await this.Get("contabilidad/ctabanco").then((resp) => {
        this.list_bancos_mayor = resp;
      });
    },
    selectPersona(model) {
      if (model != null) {
        this.$emit("eventos-ingresos", 4, {id: model.value});
      } else {
        this.$emit("eventos-ingresos", 4, null);
      }
    },
    asignarIncluirEnCupon(val) {
      this.model.incluir_cupones = val;
    },
    selectTipoDocumento(model) {
      if (!model) return;

      const isFormaPagoCaja = model.forma_pago === 1;
      const nuevoTipo = model.id;
      const tipoAnterior = this.tempTipoDocumento;

      const emitirCaja = () => {
        // Cuenta por defecto en la primera linea de la grid es de caja
        this.$emit("eventos-ingresos", 6, {
          tipo: "INGRESO",
          clase: "CAJA",
        });
      };

      if (tipoAnterior !== null) {
        if (nuevoTipo !== tipoAnterior) {
          this.LConfim(
            "¿Está seguro de cambiar el tipo de documento seleccionado inicialmente?",
            () => {
              if (isFormaPagoCaja) emitirCaja();
              this.tempTipoDocumento = nuevoTipo;
            },
            () => {
              this.model.tipo = tipoAnterior;
            }
          );
        }
      } else {
        if (isFormaPagoCaja) emitirCaja();
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
    "model.detalle"(val) {
      this.$emit("eventos-ingresos", 7, val);
    },
    "fechas.fechaconsignacion"(val) {
      if (val == "") {
        this.fechas.fechaconsignacion = null;
        this.modelconsignacion.fecha = null;
      }
    },
    "modelconsignacion.numero"(val) {
      if (val == "") {
        this.modelconsignacion.numero = null;
      }
    },
    "modeltarjeta.numero"(val) {
      if (val == "") {
        this.modeltarjeta.numero = null;
      }
    },
    cheques() {
      this.model.cheques = 0;
      this.model.total = 0;
      this.cheques.forEach((element) => {
        this.model.cheques = this.model.cheques + element.valor;
      });
      this.model.total =
        this.model.efectivo +
        this.model.cheques +
        this.model.consignacion +
        this.model.tarjeta;
    },
    "modelconsignacion.valor"(val) {
      this.model.consignacion = val;
      this.model.total = 0;
      this.model.total =
        this.model.efectivo +
        this.model.cheques +
        this.model.consignacion +
        this.model.tarjeta;
    },
    "modeltarjeta.valor"(val) {
      this.model.tarjeta = val;
      this.model.total = 0;
      this.model.total =
        this.model.cheques + this.model.consignacion + this.model.tarjeta;
    },
    "model.efectivo"() {
      this.model.total = 0;
      this.model.total =
        this.model.efectivo +
        this.model.cheques +
        this.model.consignacion +
        this.model.tarjeta;
    },
    "model.total"(val) {
      this.$emit("eventos-ingresos", 2, val);
    },
    encabezado() {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
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
      if (this.encabezado.cheques && Array.isArray(this.encabezado.cheques)) {
        this.encabezado.cheques.forEach((element) => {
          this.cheques.push({
            banco: element.bancos.id,
            numero: element.numero,
            valor: element.valor,
            total: formatterPeso.format(element.valor),
            nbanco: element.bancos.nombre,
          });
        });
      }
      this.tempTipoDocumento = this.encabezado.model.tipo;
    },
    view_incluir_cupon(val) {
      // LeidyB 17/10/2024 se comenta porque siempre estaba dejando en true el incluir cupon
      // if (val == false && this.estado == false) {
      //   this.model.incluir_cupones = true;
      // } else {
      //   this.model.incluir_cupones = false;
      // }
    },
    archivos(val) {
      this.$emit("update:archivos_props", val);
    }
  },
  mounted() {
    this.$nextTick(() => {});
  },
  async created() {
    this.getBancosMayor();
    await this.getBancos();
    this.getClaseTarjeta();
    this.cambiartabs();
    this.getTipodocumentoFuente({ id: 1 });
    console.log(this.tipodocumentofuente);
    this.bancos.forEach(item => {
      if (this.ctabanco.some((f) => f.banco === item.id)) {
        this.bancosConsig.push(item);
      }
    });
  },
};
</script>

<style lang="scss">
/* .qtab { */
/* border: 1px solid lightgray; */
/* border-top-left-radius: 5px; */
/* border-top-right-radius: 5px; */
/* } */
/* .qpanel { */
/* border: 1px solid lightgray; */
/* border-top: none; */
/* border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px; */
/* } */
/* .divqpanel {
  border: 1px solid lightgray;
  border-radius: 5px;
} */
.colorico {
  color: #194880 !important;
  /* box-shadow: #6BB7E0 !important; */
  opacity: 1;
  /* background-color: #42A5F5 !important; */
  /* border-radius: 11px;
  box-shadow: 0px 3px 16px #6BB7E0 ; */
  /* background: transparent !important; */
  /* background: #194880 0% 0% no-repeat padding-box; */
}
.q-table__top.relative-position.row.items-center {
  padding: 5px !important;
}

.inicioingreso {
  height: 200px !important;
  background: #f1f7fc 0% 0% no-repeat padding-box;
  opacity: 1;
}
/* .inputdocu.q-field--standout .q-field__control:before{
  background: unset !important;
} */
.class_textcolor {
  color: #194880;
  opacity: 1;
}
.qtd button i {
  color: white !important;
}

.form_enca {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: inset !important;
  }
}
</style>
