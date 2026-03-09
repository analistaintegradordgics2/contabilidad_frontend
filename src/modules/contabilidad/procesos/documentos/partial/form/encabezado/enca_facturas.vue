<template>
  <div>
    <q-form ref="formencfacturas" class="form_enca">
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
        <q-tab name="inicio" label="Facturas" v-if="!ocultar_factura_tab"/>
        <q-tab name="contabilizacion" label="Contabilización" />
        <q-tab name="auditoria" label="Auditorias" />
        <q-tab name="adjuntos" label="Archivos Adjuntos" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated dense class="q-mt-sm">
        <q-tab-panel name="inicio" class="iniciofactura">
          <div class="row">
            <div class="col-12">
              <label class="q-pa-sm text-center text-weight-bold"
                >Encabezado</label
              >
            </div>
            <l-select
              col="2 textinput"
              v-model="model.tipo"
              :options="tipodocumentofuenteactivos"
              label="Tipo *"
              :rules="[$rules.required($t('validator.required'))]"
              :disable="estado || nota_parcial"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @selected="selectTipoDocumento"
            />
            <l-input
              col="2 text-black textinput"
              v-model="model.detalle"
              label="Detalle *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-date
              col="2 text-black textinput"
              v-model="fechas.fecha"
              label="Fecha *"
              :rules="[$rules.required($t('validator.required'))]"
              colorico="primary"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-date
              col="2 text-black textinput"
              v-model="fechas.fechaven"
              label="F. Ven *"
              :rules="[$rules.required($t('validator.required'))]"
              colorico="primary"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-select
              col="2 textinput"
              v-model="model.f_pago"
              value="id"
              option-label="nombre"
              label="Forma de pago *"
              :options="forma_pago_fact_elect"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-select
              col="2 textinput"
              v-model="model.medio_pago"
              value="id"
              option-label="nombre"
              :options="medio_pago"
              label="Medio de pago *"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <div class="col-12">
              <label class="text-weight-bold">Cliente:</label>
            </div>
            <l-select-rest
              col="2 textinput"
              label="Persona *"
              url="tercero/personas/selectnew"
              v-model="cliente.id"
              :rules="[$rules.required($t('validator.required'))]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              @emitselecte="selectPersona"
            />
            <l-email
              col="2 text-black textinput"
              v-model="cliente.correo"
              :rules="[
                $rules.email($t('validator.email')),
                $rules.required($t('validator.required')),
              ]"
              label="Correo *"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="2 text-black textinput"
              v-model="cliente.tipodoc"
              label="Tipo"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="2 text-black textinput"
              v-model="cliente.direccion"
              label="Dirección"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              col="2 text-black textinput"
              v-model="cliente.ciudad"
              label="Ciudad"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-input
              :col="`${view_mandato ? '1' : '2'} text-black textinput`"
              v-model="cliente.telefono"
              label="Teléfono"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />

            <l-input
              col="1 text-black textinput"
              v-model="model.nofactura_proveedor"
              label="N° Factura *"
              :rules="[$rules.required($t('validator.required'))]"
              :disable="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
              v-if="esProveedor"
            />
            <div class="col text-center" v-if="view_mandato && !esProveedor">
              <q-checkbox v-model="model.mandato" label="¿Mandato?" :disable="estado"/>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="auditoria" class="q-pa-none">
          <q-table
            :data="auditorias"
            :columns="audcolumns"
            :pagination.sync="pagination"
            flat
            bordered
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
  name: "enca_facturas",
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
    nota_parcial: {
      type: Boolean,
      default: false,
    },
    ocultar_factura_tab: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      esProveedor: false,
      view_mandato: false,
      pagination: {
        rowsPerPage: 10,
      },
      tipodocumentofuenteactivos: [],
      tab: "inicio",
      paramtab: {
        factura: true,
        contabilizacion: false,
      },
      fechas: {
        fecha: moment().format("DD/MM/YYYY"),
        fechaven: moment().format("DD/MM/YYYY"),
      },
      cliente: {
        id: null,
        correo: null,
        tipodoc: null,
        direccion: null,
        ciudad: null,
        telefono: null,
      },
      model: {
        tipo: null,
        fecha: null,
        fechaven: null,
        detalle: null,
        persona: null,
        referencia: null,
        id: 0,
        usuario: this.$store.getters["auth/user"].id,
        f_pago: null,
        medio_pago: null,
        mandato: false,
        nofactura_proveedor: null
      },
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
    };
  },
  computed: {
    ...mapState("inmueble", ["bancos"]),
    ...mapState("contabilidad", [
      "clasetarjeta",
      "tipodocumentofuente",
      "storedocumentoid",
    ]),
    ...mapState("parametros", [
      "nota_credito_id",
      "nota_debito_id",
      "doc_soporte_id",
      "nota_ajuste_id",
    ]),
    ...mapState("generales", ["medio_pago", "forma_pago_fact_elect"]),
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    ...mapActions("inmueble", ["getBancos"]),
    ...mapActions("contabilidad", [
      "getClaseTarjeta",
      "getTipodocumentoFuente",
    ]),
    ...mapActions("generales", ["getMedioPago", "getFormaPagoFactElect"]),
    formatFecha(fecha) {
      return moment(fecha).format("DD/MM/YYYY hh:mm a");
    },
    async onSubmit() {
      const validate = await this.$refs.formencfacturas.validate();
      if (validate) {
        var fecha1 = false;
        var fecha2 = false;

        if (this.fechas.fecha != null) {
          fecha1 = moment(
            this.fechas.fecha,
            ["DD/MM/YYYY", "DD-MM-YYYY"],
            true
          ).isValid();
        }

        if (this.fechas.fechaven != null) {
          fecha2 = moment(
            this.fechas.fechaven,
            ["DD/MM/YYYY", "DD-MM-YYYY"],
            true
          ).isValid();
        }

        if (fecha1 == true && fecha2 == true) {
          // Nelson Lugo - Se realiza
          let fecha_ini = moment(this.fechas.fecha, [
            "DD/MM/YYYY",
            "DD-MM-YYYY",
          ]).format("YYYY-MM-DD");
          let fecha_ven = moment(this.fechas.fechaven, [
            "DD/MM/YYYY",
            "DD-MM-YYYY",
          ]).format("YYYY-MM-DD");
          if (moment(fecha_ven).isSameOrAfter(fecha_ini)) {
            this.model.fecha = fecha_ini;

            this.model.fechaven = fecha_ven;
            var encabezado = {};
            encabezado["model"] = { ...this.model };
            this.$store.commit(
              "contabilidad/SET_STOREDOCUMENTOID",
              this.model.id
            );
            return encabezado;
          } else {
            this.LInfo("warning", "Rango de fechas invalido.");
            return null;
          }
        } else {
          this.LInfo(
            "warning",
            "Alguna de las fechas del documento es errónea."
          );
          return null;
        }
      }
    },
    onReset() {
      this.fechas = {
        fecha: moment().format("DD/MM/YYYY"),
        fechaven: moment().format("DD/MM/YYYY"),
      };
      this.cliente = {
        id: null,
        correo: null,
        tipodoc: null,
        direccion: null,
        ciudad: null,
        telefono: null,
      };
      this.model = {
        tipo: null,
        fecha: null,
        fechaven: null,
        detalle: null,
        persona: null,
        referencia: null,
        id: 0,
        usuario: this.$store.getters["auth/user"].id,
        f_pago: null,
        medio_pago: null,
        mandato: false,
        nofactura_proveedor: null,
      };
      setTimeout(() => {
        this.$refs.formencfacturas.resetValidation();
      }, 500);
    },
    selectPersona(data) {
      if (data != null) {
        this.cliente.correo = data.modelo.email;
        this.cliente.tipodoc = data.modelo.tipodocumento.nombre;
        this.cliente.direccion = data.modelo.direcciones_personas.length > 0 ? data.modelo.direcciones_personas[0].descripcion : "";
        this.cliente.ciudad = data.modelo.direcciones_personas.length > 0 ? data.modelo.direcciones_personas[0].ciudad__nombre : "";
        this.cliente.telefono = data.modelo.telefonos_personas.length > 0 ? data.modelo.telefonos_personas[0].valor : "";
        this.model.persona = data.value;
        this.$emit("eventos-facturas", 4, {id: data.value});
      }
    },
    cambiartabs(tab = null) {
      if (tab != null) {
        this.tab = tab;
      }
      if (this.tab == "contabilizacion") {
        this.paramtab.factura = false;
        this.paramtab.contabilizacion = true;
        this.$emit("cambio-tabs", this.paramtab);
      } else if (this.tab == "inicio") {
        this.paramtab.factura = true;
        this.paramtab.contabilizacion = false;
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
    fechaactual() {
      this.model.fecha = moment().format("YYYY-MM-DD");
      this.fechas.fecha = moment().format("DD/MM/YYYY");
      this.fechas.fechaven = moment().format("DD/MM/YYYY");
    },
    async validarResolucion() {
      if (this.model.tipo != null) {
        await this.Get("contabilidad/documentos/validar_resolucion", {
          tipodocumento: this.model.tipo,
        }).then((resp) => {
          if (resp.status == false) {
            this.LConfimOK("warning", resp.msg, () => {
              this.model.tipo = null;
            });
          }
        });
      }
    },
    selectTipoDocumento(val) {
      if (!val) return;

      const nuevoTipo = val.id;
      const tipoAnterior = this.tempTipoDocumento;
      
      const emitir = () => {
        this.validarResolucion();
        this.$emit("eventos-facturas", 10, this.model.tipo);
        if (val.es_nota == false) {
          this.view_mandato = true;
          this.model.mandato = val.mandato;
        } else {
          this.view_mandato = false;
          this.model.mandato = false;
        }
        this.$emit("eventos-facturas", 10, this.model.tipo);
        // se buscar si el tipo de documento seleccinado es proveedor
        const tipoproveedor = this.tipodocumentofuente.find((prov) => prov.proveedor == true && prov.id == this.model.tipo)
        if (tipoproveedor) {
          this.esProveedor = true
        } else {
          this.esProveedor = false
        }
        this.$emit("eventos-facturas", 11, this.esProveedor);
        this.tempTipoDocumento = nuevoTipo;
      };

      if (tipoAnterior !== null) {
        if (nuevoTipo !== tipoAnterior) {
          this.LConfim(
            "¿Está seguro de cambiar el tipo de documento seleccionado inicialmente?",
            () => {
              emitir();
            },
            () => {
              this.model.tipo = tipoAnterior;
            }
          );
        }
      } else {
        emitir();
      }
    },
  },
  watch: {
    archivos: {
      deep: true,
      handler() {
        this.$emit("change_files", this.archivos);
      },
    },
    encabezado() {
      // Formatear fechas a DD/MM/YYYY para el formulario
      if (this.encabezado.model.fecha) {
        this.encabezado.model.fecha = moment(
          this.encabezado.model.fecha,
          ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"]
        ).format("DD/MM/YYYY");
      }
      if (this.encabezado.model.fechaven) {
        this.encabezado.model.fechaven = moment(
          this.encabezado.model.fechaven,
          ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"]
        ).format("DD/MM/YYYY");
      }
      this.fechas = {
        fecha: this.encabezado.model.fecha,
        fechaven: this.encabezado.model.fechaven,
      };
      this.model = this.encabezado.model;
      this.cliente.id = this.encabezado.cliente[0].id;
    },
    "fechas.fecha"(val) {
      if (!this.estado) {
        if (val != null) {
          let fecha_documento = moment().format("YYYY-MM-DD");
          if (this.model.fecha != null) {
            fecha_documento = this.model.fecha;
          }
          if (moment(val, ["DD/MM/YYYY", "DD-MM-YYYY"], true).isValid()) {
            let fecha_rango_ini = null;
            let fecha_rango_fin = null;
            if (!this.estado) {
              fecha_rango_ini = moment()
                .startOf("month")
                .startOf("day")
                .format("YYYY-MM-DD");
              fecha_rango_fin = moment()
                .endOf("month")
                .endOf("day")
                .format("YYYY-MM-DD");
            } else {
              fecha_rango_ini = moment(this.model.fecha, [
                "DD/MM/YYYY",
                "DD-MM-YYYY",
                "YYYY-MM-DD",
              ])
                .startOf("month")
                .startOf("day")
                .format("YYYY-MM-DD");
              fecha_rango_fin = moment(this.model.fecha, [
                "DD/MM/YYYY",
                "DD-MM-YYYY",
                "YYYY-MM-DD",
              ])
                .endOf("month")
                .endOf("day")
                .format("YYYY-MM-DD");
            }
            let fecha = moment(val, ["DD/MM/YYYY", "DD-MM-YYYY"]).format(
              "YYYY-MM-DD"
            );
            if (
              !moment(fecha).isBetween(
                fecha_rango_ini,
                fecha_rango_fin,
                undefined,
                "[]"
              )
            ) {
              // LeidyB - Se realiza porque en las resoluciones antiguas se puede generar notas en rango de 10 dias a la fecha actual.
              let diferencia_dias = moment(moment().format("YYYY-MM-DD")).diff(fecha, "days");
              let result = this.tipodocumentofuenteactivos.filter((f) => f.id == this.model.tipo)[0];
        
              if(!(diferencia_dias <= 10 && result.es_nota == true)){
                this.LConfimOK(
                  "warning",
                  "Fecha fuera del rango del mes en que se facturo.",
                  () => {
                    this.fechas.fecha = null;
                  }
                );
              }
            }
          }
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  created() {
    this.getBancos();
    this.getClaseTarjeta();
    this.cambiartabs();
    this.getMedioPago();
    this.getFormaPagoFactElect();
    this.getTipodocumentoFuente({ id: 4 }).then((resp) => {
      if (!this.estado) {
        this.tipodocumentofuenteactivos = this.tipodocumentofuente.filter(
          (f) =>
            f.estado == "Activo" &&
            f.id != this.nota_credito_id &&
            f.id != this.nota_debito_id &&
            f.id != this.nota_ajuste_id
        );
      } else {
        this.tipodocumentofuenteactivos = [...this.tipodocumentofuente];
        let result = this.tipodocumentofuenteactivos.filter((f) => f.id == this.model.tipo)[0];
        if (result.es_nota == false) {
          this.view_mandato = true;
        }
      }
    });
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
}
.divqpanel {
  border: 1px solid lightgray;
  border-radius: 5px;
}
.q-table__top.relative-position.row.items-center {
  padding: 5px !important;
}

.iniciofactura {
  height: 185px !important;
  background: #f1f7fc 0% 0% no-repeat padding-box;
  opacity: 1;
}

.form_enca {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: inset !important;
  }
}
</style>