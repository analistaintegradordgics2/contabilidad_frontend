<template>
  <div>
    <l-newmodal
      persistent
      :footer="true"
      ref="refcreardocumentos"
      full_width
      body_class="q-pa-none"
    >
      <template slot="title">
        <div class="row">
        <div class="col-5 flex items-center">
          <span class="tituloModal q-ml-sm titulocard text-bold"
            >DOCUMENTO #{{ documento.numero }}</span
          >
          <span
            class="tituloModal q-ml-sm titulocard text-bold"
            v-if="
              documento != undefined &&
              documento.referencia != null &&
              documento.referencia != 'None'
            "
            >- REF: {{ documento.referencia }}</span
          >
          <q-chip
            :style="
              documento.estado == 1
                ? 'background:#29C16040;border: 1px solid #29C160;'
                : documento.estado == 2
                ? 'background:#E2424240;border: 1px solid #E24242;'
                : documento.estado == 3
                ? 'background:#D8D8D840;border: 1px solid #D8D8D8;'
                : documento.estado == 4
                ? 'background:#F5B21D40;border: 1px solid #F5B21D;'
                : ''
            "
            dense
            class="q-px-md text-weight-bold anulados"
            v-if="verdocumento || this.document != undefined"
          >
            {{
              documento.estado == 1
                ? "Abierto"
                : documento.estado == 2
                ? "Cerrado"
                : documento.estado == 3
                ? "Anulado"
                : documento.estado == 4
                ? "Reabierto"
                : ""
            }}
          </q-chip>
        
          <q-icon
            class="q-ml-xs"
            name="mdi-cloud-sync"
            size="20px"
            color="white"
            v-if="
              verdocumento == true && documento.cont_estadofact != undefined
                ? documento.cont_estadofact == 4
                : false
            "
          >
            <q-tooltip>Transmitida</q-tooltip>
            <q-badge v-if="documento.auto" style="background: #06bc54;margin-left: 5px">{{ documento.auto }}</q-badge>
          </q-icon>
          <q-badge v-if="documento.auto" style="background: #06bc54;margin-left: 5px">{{ documento.auto }}</q-badge>
        </div>
        <div class="col-3 text-center">
          <template v-if="indexnavegacion">
            <q-btn
              round
              dense
              flat
              size="10px"
              class="q-mr-sm class_navegacion"
              @click="navegacion(1)"
              :disable="keynavegacion.primero"
              v-if="verdocumento == true"
            >
              <q-icon name="first_page" color="withe" size="20px" />
              <q-tooltip>Primero</q-tooltip>
            </q-btn>
            <q-btn
              round
              dense
              flat
              size="10px"
              class="q-mr-sm class_navegacion"
              @click="navegacion(2)"
              :disable="keynavegacion.anterior"
              v-if="verdocumento == true"
            >
              <q-icon name="arrow_back" color="withe" size="20px" />
              <q-tooltip>Anterior</q-tooltip>
            </q-btn>
            <q-btn
              round
              dense
              flat
              size="10px"
              class="q-mr-sm class_navegacion"
              @click="navegacion(3)"
              :disable="keynavegacion.siguiente"
              v-if="verdocumento == true"
            >
              <q-icon name="arrow_forward" color="withe" size="20px" />
              <q-tooltip>Siguiente</q-tooltip>
            </q-btn>
            <q-btn
              round
              dense
              flat
              size="10px"
              class="q-mr-sm class_navegacion" 
              @click="navegacion(4)"
              :disable="keynavegacion.ultimo"
              v-if="verdocumento == true"
            >
              <q-icon name="last_page" color="withe" size="20px" />
              <q-tooltip>Último</q-tooltip>
            </q-btn>
          </template>
        </div>
      </div>
      </template>
      <template slot="body">
        <div class="row" id="crearDoc">
          <div class="col-12">
            <div>
              <encaingresos
                v-if="this.tipodocument == 1"
                ref="encaingresos"
                @cambio-tabs="cambiotabs"
                @eventos-ingresos="ejecutarEventos"
                @change_files="actualizar_archivos"
                :encabezado="encabezado"
                :estado="verdocumento"
                :auditorias="auditorias"
                :estado_documento="documento.estado"
                :archivos_props.sync="archivos"
                :view_incluir_cupon="view_incluir_cupon"
              />
              <encaegresos
                v-if="this.tipodocument == 2"
                ref="encaegresos"
                @cambio-tabs="cambiotabs"
                @eventos-egresos="ejecutarEventos"
                @change_files="actualizar_archivos"
                :encabezado="encabezado"
                :estado="verdocumento"
                :auditorias="auditorias"
                :estado_documento="documento.estado"
                :archivos_props="archivos"
                :view_incluir_cupon="view_incluir_cupon"
                :auto="documento.auto"
              />
              <encanotascontables
                v-if="this.tipodocument == 3"
                ref="encanotascontables"
                @cambio-tabs="cambiotabs"
                @eventos-notascontables="ejecutarEventos"
                @change_files="actualizar_archivos"
                :encabezado="encabezado"
                :estado="verdocumento"
                :auditorias="auditorias"
                :estado_documento="documento.estado"
                :archivos_props="archivos"
                :view_incluir_cupon="view_incluir_cupon"
                :auto="documento.auto"
              />
              <encafacturas
                v-if="this.tipodocument == 4"
                ref="encafacturas"
                @cambio-tabs="cambiotabs"
                @eventos-notascontables="ejecutarEventos"
                @eventos-facturas="ejecutarEventos"
                @change_files="actualizar_archivos"
                :encabezado="encabezado"
                :estado="verdocumento"
                :auditorias="auditorias"
                :estado_documento="documento.estado"
                :archivos_props="archivos"
                :nota_parcial="disable_nota_parcial"
                :ocultar_factura_tab="edicion_contabilizacion"
              />
            </div>
            <div>
              <contabilizacion
                v-show="tabs.contabilizacion"
                ref="contabilizacion"
                @eventos="ejecutarEventos"
                :tipodocumento="parseInt(this.tipodocument)"
                :contabilizacion="contabilizacion"
                :estado="verdocumento"
                :novalidar_nit="novalidar_nit"
                :estadodoc="this.documento.estado"
                :notacredito="notacredito"
                :notaajuste ="notaajuste"
                :docsoporte="documento.tipodocumento.id"
                @validar_cta_arre="validar_cta_arre"
              />
              <template v-if="this.tipodocument == 4">
                <factura
                  v-show="tabs.factura"
                  ref="factura"
                  @eventos="ejecutarEventos"
                  :tipodocumento="parseInt(this.tipodocument)"
                  :factura="factura"
                  :proporc="porcentajes"
                  :estado="verdocumento"
                  :id_doc="id_doc"
                  :tipo_electronica="encabezado != null ? encabezado.model.tipo_electronica : null"
                />
              </template>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="row q-gutter-sm justify-center">
          <can
            permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_editar_documento"
            class="col"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              class="btnEditar full-width"
              label="Editar"
              @click="accionDocumento(4)"
              :disable="
                documento.estado === 2 || documento.estado === 3 || bloquear_btn
              "
            />
          </can>
          <can
            class="col"
            :permiso="validacionPermisosCerrarDoc()"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              class="full-width"
              style="background: #e24242; color: white"
              :label="
                documento.estado == 2 || documento.estado == 3
                  ? 'Reabrir'
                  : 'Cerrar'
              "
              @click="accionDocumento(1)"
              :disable="validnota_credito || bloquear_btn"
            ></q-btn>
          </can>
          <can
            class="col"
            :permiso="validacionPermisosAnularDoc()"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              class="full-width"
              @click="accionDocumento(2)"
              style="background: #484848; color: white"
              :label="
                this.documento.tipodocumento.fuente == 4 &&
                this.documento.estado == 2 &&
                tiporc != tiporcdoc &&
                this.documento.tipodocumento.id != this.doc_soporte_id
                  ? 'Generar nota crédito'
                  : this.documento.tipodocumento.fuente == 4 &&
                    this.tiporc == this.tiporcdoc &&
                    this.documento.tipodocumento.id != this.doc_soporte_id
                  ? 'Anular nota crédito'
                  : this.documento.tipodocumento.id == this.doc_soporte_id
                  ? 'Generar nota de ajuste'
                  : 'Anular'
              "
              :disable="
                documento.estado == 3 ||
                (this.documento.referencia != null &&
                  this.documento.referencia != 'None' &&
                  this.documento.referencia != '') ||
                tiporc == tiporcdoc ||
                (this.documento.tipodocumento.id == this.doc_soporte_id &&
                  documento.estado == 1) ||
                documento.estado == 4 ||
                bloquear_btn
              "
            ></q-btn>
          </can>
          <can
            permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_nota_debito"
            class="col"
            v-if="
              verdocumento == true &&
              this.documento.tipodocumento.fuente == 4 &&
              this.documento.tipodocumento.id != this.doc_soporte_id
            "
          >
            <q-btn
              rounded
              color="green"
              class="full-width"
              @click="generarNotaDebito"
              v-if="
                verdocumento == true &&
                this.documento.tipodocumento.fuente == 4 &&
                this.documento.tipodocumento.id != this.doc_soporte_id && esProveedor == false
              "
              :disable="
                documento.estado == 3 ||
                (this.documento.referencia != null &&
                  this.documento.referencia != 'None' &&
                  this.documento.referencia != '') ||
                tiporc == tiporcdoc ||
                (this.documento.tipodocumento.id == this.doc_soporte_id &&
                  documento.estado == 1) ||
                documento.estado == 4 ||
                bloquear_btn
              "
              label="Generar Nota Débito"
            >
            </q-btn>
          </can>
          <can
            class="col"
            permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_copiar_documento"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              class="btnGuardar1 full-width"
              @click="accionDocumento(3)"
              label="Copiar"
              :disable="bloquear_btn"
            ></q-btn>
          </can>
          <can
            class="col"
            permiso="view_menu_gestion_contable_gastos_administrativos_documentos_acciones_imprimir_documento"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              class="btnGuardar1 full-width"
              @click="imprimirDocumento"
              label="Imprimir"
              :disable="
                documento.estado == 1 || documento.estado == 4 || bloquear_btn
              "
            ></q-btn>
          </can>
          <div
            :class="verdocumento ? 'col' : 'col-2'"
            v-if="verdocumento == false"
          >
            <q-btn
              rounded
              class="btnGuardar full-width"
              label="Guardar"
              @click="onSubmit"
              :disable="bloquear_btn"
            ></q-btn>
          </div>
          <div
            class="col"
            v-if="verdocumento == true"
          >
            <q-btn
              rounded
              color="amber"
              class="btnGuardar1 full-width"
              @click="exportarMovimiento"
              label="Exportar Movimiento"
            >
            </q-btn>
          </div>
          <!-- <div
            :class="verdocumento ? 'col' : 'col-2'"
            v-if="
              tipo_de_contabilidad == 1 &&
              !verdocumento &&
              inmuebles_asociados.length > 0
            "
          >
            <q-btn
              rounded
              class="btnGuardar1 full-width"
              @click="$refs.modalinmoasociados.open()"
              label="Inmuebles asociados a la persona"
              :disable="bloquear_btn"
            >
            </q-btn>
          </div> -->
        </div>
      </template>
    </l-newmodal>
    <l-newmodal
      ref="modalinmoasociados"
      width="1200px"
      :validar_salir="false"
      titulo="Inmuebles Asociados a la persona"
      footer
      btn_listo
    >
      <template slot="body">
        <div>
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th class="text-left bg-primary text-white">ID</th>
                <th class="text-left bg-primary text-white">Inmueble</th>
                <th class="text-left bg-primary text-white">Estado</th>
                <th class="text-left bg-primary text-white">Tipo</th>
                <th class="text-center bg-primary text-white">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inm in inmuebles_asociados" :key="inm.id">
                <td class="text-left">{{ inm.id }}</td>
                <td class="text-left">{{ inm.label }}</td>
                <td>
                  <q-badge
                    :style="`background-color: rgb(${item.estado.color})`"
                    :label="item.estado.nombre"
                  />
                </td>
                <td class="text-left">{{ inm.tipo }}</td>
                <td class="text-center">
                  <q-btn
                    unelevated
                    dense
                    round
                    icon="east"
                    color="primary"
                    size="11px"
                    @click="ejecutarEventos(9, inm)"
                  >
                    <q-tooltip>Asignar Inmueble</q-tooltip>
                  </q-btn>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </template>
    </l-newmodal>
    <imprimirdocumento ref="imprimirdocumento" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import encaingresos from "./form/encabezado/enca_ingresos";
import encaegresos from "./form/encabezado/enca_egresos";
import encanotascontables from "./form/encabezado/enca_notascontables";
import encafacturas from "./form/encabezado/enca_facturas";
import contabilizacion from "./form/cuerpo/contabilizacion";
import factura from "./form/cuerpo/factura";
import imprimirdocumento from "./form/imprimir";
import moment from "moment";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "Crear",
  components: {
    encaingresos,
    encaegresos,
    encanotascontables,
    encafacturas,
    contabilizacion,
    factura,
    imprimirdocumento,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      tabs: true,
      notacredito: false,
      notaajuste: false,
      documento: {
        tipodocumento: {
          id: null,
        },
      },
      view_incluir_cupon: false,
      verdocumento: false,
      validacion: true,
      persona_id: null,
      encabezado: null,
      cheques: [],
      contabilizacion: [],
      factura: [],
      porcentajes: {},
      cerrardocumento: false,
      mensaje: null,
      validnota_credito: false,
      tdfuente: null,
      tiporc: null,
      tiporcdoc: null,
      numdocumentogene: null,
      pdfs: { path: null },
      keynavegacion: {
        primero: false,
        anterior: false,
        siguiente: false,
        ultimo: false,
      },
      indexnavegacion: false,
      archivos: [],
      expandir: false,
      validacion_from_facturas: 0,
      auditorias: [],
      id_doc: null,
      document: null,
      tipodocument: null,
      inmuebles_asociados: [],
      bloquear_btn: false,
      nota_parcial: false,
      disable_nota_parcial: false,
      novalidar_nit: false,
      esProveedor: false,
      primera_persona_encabezado: false,
      enviar_nota_parcial: false,
      copiado:false,
      edicion_contabilizacion:false,
      es_nota_credito: false,
    };
  },
  computed: {
    ...mapState("parametros", [
      "cod_ini_ingreso",
      "cod_ini_egreso",
      "nota_credito_id",
      "cerrar_doc_automatico",
      "validar_nit_factura",
      "tipo_de_contabilidad",
      "nota_debito_id",
      "doc_soporte_id",
      "nota_ajuste_id",
      "cta_arr_id",
      "cta_prop_id",
      "cta_admon_id"
    ]),
    ...mapState("contabilidad", [
      "copiadocumento",
      "listfilterdocumentos",
      "conceptos_conta",
    ]),
    ...mapState("generales", ["archivos_store"]),
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    ...mapActions("parametros", ["getProcesos"]),
    ...mapActions("generales", ["autoguardado"]),
    ...mapActions("contabilidad", [
      "getList_conceptos_conta",
      "getList_cta_banco",
      "getList_centro_costo",
    ]),
    validar_cta_arre(estado) {
      this.view_incluir_cupon = estado;
    },
    async exportarMovimiento() {
      let mov = this.$refs.contabilizacion.exportarMovimiento();
      await this.PostDownload("contabilidad/contabilizacion/exportar_movimiento", mov).then((resp) =>
        fileDownload(resp, "movimientos.xlsx")
      );
    },
    async getAuditoria(documento) {
      await this.Get(`contabilidad/documentos/auditoria/${documento}`).then((resp) => {
        this.auditorias = resp;
      });
    },
    abrirmodal(documento, tipo_documento, id_doc, editar) {
      this.onReset();
      this.verdocumento = false;
      this.id_doc = id_doc;
      this.document = documento;
      this.tipodocument = tipo_documento;
      this.bloquear_btn = false;
      // setTimeout(() => {
      this.$refs.refcreardocumentos.open();
      // }, 500);
      this.getAuditoria(id_doc);
      this.cargarmodal();
      if (editar) {
        this.accionDocumento(4);
      }
    },
    async getAuditoria(documento_id = null) {
      if (documento_id != null) {
        await this.Get(
          "contabilidad/documentos/auditoria/" + documento_id
        ).then((resp) => {
          this.auditorias = resp;
        });
      }
    },
    limpiar_list(tipo) {
      switch (tipo) {
        case "archivos":
          this.archivos = [];
          break;
      }
    },
    cambiotabs(tab) {
      this.tabs = tab;
    },
    generarNotaDebito() {
      if (this.documento.cont_estadofact == 4) {
        this.LConfim(
          "¿Está seguro de generar nota débito para el documento?",
          () => {
            var tempdocumento = { ...this.documento };
            // tempdocumento.encabezado.model.tipo = this.nota_debito_id;
            // Nelson Lugo - Se realiza ajuste para tomar el tipo de documento para la nota credito
            // parametrizado en el tipo de documento de la factura
            let result = this.tiposdocumentos.filter(
              (f) => f.id == tempdocumento.encabezado.model.tipo
            );
            if (result.length > 0) {
              result = result[0];
              if (result.tipo_documento_nota_debito != null) {
                tempdocumento.encabezado.model.tipo = result.tipo_documento_nota_debito;
              } else {
                this.LInfo(
                  "warning",
                  "Factura no tiene tipo de documento nota débito parametrizada."
                );
                return;
              }
            }
            tempdocumento.encabezado.model.id = 0;
            tempdocumento.encabezado.model.tipo = result.tipo_documento_nota_debito;
            tempdocumento.encabezado.model.referencia = this.documento.id;
            var tempgrid = tempdocumento.contabilizacion;
            tempdocumento.contabilizacion = [];
            tempgrid.forEach((element) => {
              tempdocumento.contabilizacion.push({
                mayor_id: element.mayor_id,
                persona_id: element.personas_id,
                concepto_id: element.concepto_id,
                detalle: element.detalle,
                valorcr: element.valor_cr,
                valordb: element.valor_db,
                tercero_id: element.nittercero,
                base: element.base,
                mov_id: "0",
                cc_id: element.centro_costos_id,
                docref: null,
                inmu_id: element.inmueble_id,
                pago_id: null,
                direccion: element.direccion,
                pagado: false,
              });
            });
            this.$store.commit("contabilidad/SET_COPIADOCUMENTO", tempdocumento);
            this.auditorias = [];
          },
          () => {},
          false
        );
      } else {
        this.LInfo(
          "warning",
          "El documento no ha sido transmitido, no se puede generar nota."
        );
      }
    },
    accionDocumento(accion) {
      this.bloquear_btn = true;
      var estado = null;
      if (accion != 4) {
        if (this.documento.tipodocumento.id != this.doc_soporte_id) {
          if (
            this.validar_nit_factura == true &&
            parseInt(this.documento.tipodocumento.id) == 4
          ) {
            if (this.documento.estado == 1 || this.documento.estado == 4) {
              if (this.documento.contabilizacion.length > 0) {
                if (
                  this.documento.contabilizacion[0].personas_id !=
                  this.documento.encabezado.model.persona
                ) {
                  this.LInfo(
                    "warning",
                    "La persona del encabezado debe ser la misma en la primera linea de la contailización."
                  );
                  return;
                }
              }
            }
          }
        }
      }
      switch (accion) {
        case 1:
          //Cerrar o reabir documento
          if (this.documento.estado == 2 || this.documento.estado == 3) {
            estado = "reabrir";
          } else {
            estado = "cerrar";
          }
          break;
        case 2:
          // if (this.tdfuente == this.nota_credito_id) {
          if (
            this.tipodocument == 4 &&
            this.tiporc != this.tiporcdoc &&
            this.documento.tipodocumento.id != this.doc_soporte_id && this.esProveedor == false
          ) {
            this.notacredito = true;
            estado = "generar nota crédito para";
          } else if (this.documento.tipodocumento.id == this.doc_soporte_id) {
            estado = "generar nota de ajuste para";
            this.notaajuste = true;
          } else {
            estado = "anular";
          }
          break;
        case 3:
          estado = "copiar";
          this.copiado=true;
          break;
        case 4:
          this.novalidar_nit = true;          
          this.edicion_contabilizacion= this.documento.cont_estadofact == 4 ? true : false;
          this.expandir = false;
          this.verdocumento = false;
          this.primera_persona_encabezado = true
          // this.cambiotabs({ contabilizacion: true, factura: false });
          if (this.documento.cont_estadofact == 4 ){
            this.$refs.encafacturas.cambiartabs("contabilizacion")
          }
          if (this.tipodocument == 1) {
            setTimeout(() => {
              this.$refs.encaingresos.limpiar_cheques();
            }, 500);
          }
          break;
      }
      if (accion != 4) {
        if (accion == 2) {
          if (
            (this.notacredito == true || this.notaajuste) &&
            this.documento.cont_estadofact != 4
          ) {
            // Se valida si se va hacer una nota crédito, la factura este transmitida
            this.LConfimOK(
              "warning",
              "El documento no ha sido transmitido, no se puede generar nota.",
              () => {
                this.notacredito = false;
                this.this.notaajuste = false;
              },
              false
            );
            return;
          }
        }
        if (this.cerrardocumento == false) {
          this.LConfim(
            `¿Está seguro(a) de ${estado} el documento?`,
            () => {
              this.cerrardocumento = true;
              if (accion == 1) {
                if (this.tipodocument == 1) {
                  this.$refs.encaingresos.limpiar_cheques();
                }
                this.finalizarDocumento(accion);
              } else if (accion == 3) {
                if (this.documento.encabezado.model.origen == "PAGOPROP" || this.documento.encabezado.model.origen == "PAGOADMON") {
                  this.LInfo("warning", "Este documento fue realizado desde un proceso de pago automatico, no se puede copiar.");
                  return;
                }
                this.primera_persona_encabezado = true
                this.documento.estado = null;
                var tempdocumento = { ...this.documento };
                tempdocumento.encabezado.model.usuario = this.$store.getters['auth/user'].id
                tempdocumento.encabezado.model.id = 0;
                tempdocumento.encabezado.model.referencia = null;
                var tempgrid = tempdocumento.contabilizacion;
                tempdocumento.contabilizacion = [];
                let regex = /-.+?%/g
                tempgrid.forEach((element) => {
                  let detalle = element.detalle.replace(regex, '');
                  tempdocumento.contabilizacion.push({
                    mayor_id: element.mayor_id,
                    persona_id: element.personas_id,
                    concepto_id: element.concepto_id,
                    detalle: detalle,
                    valordb: element.valor_db,
                    valorcr: element.valor_cr,
                    docref: null,
                    cc_id: element.centro_costos_id,
                    tercero_id: element.nittercero,
                    inmu_id: element.inmueble_id,
                    mov_id: "0",
                    base: element.base,
                    pago_id: null,
                    direccion: element.direccion,
                    pagado: false,
                  });
                });
                this.$store.commit("contabilidad/SET_COPIADOCUMENTO", tempdocumento);
                this.auditorias = [];

                 } else if (accion == 2) {

                if (this.tipodocument != 4  || (this.tipodocument == 4 && this.esProveedor == true)) {
                  // Se va anular el documento
                  this.LConfimInput(
                    "textarea",
                    "warning",
                    "Por favor, justifique la anulación del documento.",
                    (data) => {
                      this.mensaje = data;
                      this.finalizarDocumento(accion);
                    },
                    () => {
                      this.mensaje = null;
                      this.cerrardocumento = false;
                    },
                    false
                  );
                } else {
                  //Se va generar una nota credito
                  this.LConfim(
                    "¿Desea hacer nota parcial?",
                    () => {
                      this.disable_nota_parcial = true;
                      this.nota_parcial = true;
                      this.enviar_nota_parcial = true
                      this.onSubmit();
                    },
                    () => {
                      this.nota_parcial = false;
                      this.enviar_nota_parcial = false
                      this.onSubmit();
                    },
                    true,
                    "",
                    "",
                    "SÍ",
                    "NO"
                  );
                }
              }
            },
            () => {
              this.cerrardocumento = false;
            },
            false
          );
        } else {
          this.finalizarDocumento(accion);
        }
      }
    },
    async finalizarDocumento(accion) {
      if (this.cerrardocumento == true) {
        var parametros = {
          iddocumento: this.documento.id,
          estado: this.documento.estado,
          usuario: this.$store.getters["auth/user"].id,
          accion: accion,
          mensaje: this.mensaje,
        };
        const resp = await this.Post(
          "contabilidad/documentos/acciondocumento",
          parametros
        );
        if (resp[0][0] == null) {
          // Cerro el documento ok
          this.LFinish(
            "Proceso finalizado correctamente.",
            () => {
              this.cerrardocumento = false;
            },
            false
          );
          this.GetDocumentos(this.documento.id).then(() => {
            if (sessionStorage.getItem("documentosfiltrados") != null) {
              var storedocument = JSON.parse(
                sessionStorage.getItem("documentosfiltrados")
              );
              var index = storedocument.findIndex(
                (index) => index.id === this.documento.id
              );
              storedocument[index] = this.documento;
              sessionStorage.setItem(
                "documentosfiltrados",
                JSON.stringify(storedocument)
              );
              this.$store.commit(
                "contabilidad/SET_LISTFILTERDOCUMENTOS",
                JSON.parse(sessionStorage.getItem("documentosfiltrados"))
              );
            }
          });
          this.getAuditoria(this.documento.id);
        } else {
          // El documento no cuenta con las condiciones para cerrarce
          this.GetDocumentos(this.documento.id).then(() => {
            if (sessionStorage.getItem("documentosfiltrados") != null) {
              var storedocument = JSON.parse(
                sessionStorage.getItem("documentosfiltrados")
              );
              var index = storedocument.findIndex(
                (index) => index.id === this.documento.id
              );
              storedocument[index] = this.document;
              sessionStorage.setItem(
                "documentosfiltrados",
                JSON.stringify(storedocument)
              );
              this.$store.commit(
                "contabilidad/SET_LISTFILTERDOCUMENTOS",
                JSON.parse(sessionStorage.getItem("documentosfiltrados"))
              );
              this.indexnavegacion = true;
              var storedocument = JSON.parse(
                sessionStorage.getItem("documentosfiltrados")
              );
              key = storedocument.findIndex(
                (index) => index.numero === this.documento.numero
              );
              if (key == 0) {
                this.keynavegacion.primero = true;
                this.keynavegacion.anterior = true;
              } else if (key == storedocument.length - 1) {
                this.keynavegacion.siguiente = true;
                this.keynavegacion.ultimo = true;
              }
            }
          });
          this.getAuditoria(this.documento.id);
          this.LConfimOK(
            "warning",
            resp[0][0],
            () => {
              this.cerrardocumento = false;
            },
            false
          );
        }
        // } else {
        //   this.LInfo("warning", resp[0][0]);
        // }
      }
    },
    async onSubmit() {
      this.bloquear_btn = true;
      let validacion_resolucion = false;
      if (!this.copiado) {
        this.copiado = false;
      }
      try {
        this.$store.commit(
          "contabilidad/SET_STORENUMDOCUMENTO",
          this.documento.numero
        );
        let tipodocumento = null;

        if (this.documento.tipodocumento.id == null) {
          tipodocumento = this.tipodocument;
        } else {
          tipodocumento = this.documento.tipodocumento.fuente;
        }
        let encabezado = null;
        let contabilizacion = null;
        let factura = null;
        this.validacion_from_facturas = 0;
      
        if (tipodocumento == 1) {
          this.$refs.encaingresos.onSubmit().then((response) => {
            encabezado = response;
          });
        } else if (tipodocumento == 2) {
          this.$refs.encaegresos.onSubmit().then((response) => {
            encabezado = response;
          });
        } else if (tipodocumento == 3) {
          this.$refs.encanotascontables.onSubmit().then((response) => {
            encabezado = response;
          });
        } else if (tipodocumento == 4) {
          this.$refs.factura.onSubmit().then((response) => {
            factura = response;
            if (factura != null) {
              this.validacion_from_facturas++;
            }
          });
          this.$refs.encafacturas.onSubmit().then(async (response) => {
            encabezado = { ...response };
            if (encabezado != null) {
              await this.Get("contabilidad/documentos/validar_resolucion", {
                tipodocumento: encabezado.model.tipo,
              }).then((resp) => {
                if (resp.status == false) {
                  this.LInfo("warning", resp.msg);
                  validacion_resolucion = true;
                }
              });
              this.validacion_from_facturas++;
            }
          });

        }
        this.$refs.contabilizacion.onSubmit().then((response) => {
          contabilizacion = response;
          if (this.es_nota_credito === true) {
            // Nelson Lugo 19/02/2026 - Caso #75844 - Se solicitio que al generar una nota crédito en el campo de base de la contabilización del documento siempre sea negativo.
            contabilizacion.filter((f) => Math.abs(f.base) > 0).forEach(item => {
              item.base = Math.abs(item.base) * -1;
            });
          }
        });
        setTimeout(async () => {
          if (tipodocumento == 4) {
            if (this.encabezado) {
              factura.grid.forEach((element) => {
                if (this.encabezado.cliente[0].inmuebles_asociados.length > 0) {
                  let inmu_id = this.encabezado.cliente[0].inmuebles_asociados[0].id;
                  let contrato_id = this.encabezado.cliente[0].inmuebles_asociados[0]
                    .contrato;
                  element.inmueble_id = inmu_id ? inmu_id : null;
                  element.contrato_id = contrato_id ? contrato_id.contrato_id : null;
                } else {
                  element.inmueble_id = null;
                  element.contrato_id = null;
                }
              });
            }
          }
          if (validacion_resolucion == false) {
            var parametros = {};
            var validar = false;
            if (encabezado != null && contabilizacion != null) {
              if (tipodocumento == 4) {
                if (encabezado.model.mandato === true) {
                  if (!contabilizacion.some((f) => f.mayor_id === this.cta_arr_id)) {
                    this.LInfo(
                      "warning",
                      "Los documentos de tipo mandato deben contar con una cuenta de arrendatario."
                    );
                    return;
                  }
                }
              }
              // if (encabezado.model.incluir_cupones) {
              //   contabilizacion.forEach((element) => {
              //     if (element.mayor_id == this.cta_arr_id) {
              //       element["es_novedad"] = encabezado.model.incluir_cupones;
              //     } else {
              //       element["es_novedad"] = false;
              //     }
              //   });
              // }
              encabezado.model["tipodocumento"] = parseInt(tipodocumento);
              if (tipodocumento == 3) {
                if (!encabezado.model.persona || this.primera_persona_encabezado) {
                  encabezado.model.persona = contabilizacion[0].persona_id;
                }   
               // encabezado.model.persona = contabilizacion[0].persona_id; Dblanco 2025-06-25
                this.primera_persona_encabezado = false
                var totaldb = 0;
                var totalcr = 0;
                var diferencia = 0;
                contabilizacion.forEach((element) => {
                  totaldb = totaldb + element.valordb;
                  totalcr = totalcr + element.valorcr;
                });
                diferencia = totaldb - totalcr;
                if (diferencia == 0) {
                  encabezado.model.total = totaldb;
                }
              }
              if (tipodocumento == 4) {
                if (factura != null) {
                  validar = true;
                  if (
                    (encabezado.model.id != 0 && this.notacredito == true) ||
                    this.documento.tipodocumento.id == this.doc_soporte_id
                  ) {
                    if (encabezado.model.id != 0 && this.notacredito) {
                      encabezado.model.id = 0;
                      encabezado.model.referencia = this.documento.id;
                      // encabezado.model.tipo = this.nota_credito_id;
                      // Nelson Lugo - Se realiza ajuste para tomar el tipo de documento para la nota credito
                      // parametrizado en el tipo de documento de la factura
                      let result = this.tiposdocumentos.filter(
                        (f) => f.id == encabezado.model.tipo
                      );
                      if (result.length > 0) {
                        result = result[0];
                        if (result.tipo_documento_nota_credito != null) {
                          encabezado.model.tipo = result.tipo_documento_nota_credito;
                          this.encabezado.model.id = 0;
                          this.encabezado.model.tipo = result.tipo_documento_nota_credito;
                          this.documento.encabezado.model.id = 0;
                          this.documento.numero = null;
                          this.documento.estado = null;
                        } else {
                          this.LInfo(
                            "warning",
                            "Factura no tiene tipo de documento nota crédito parametrizada."
                          );
                          this.cerrardocumento = false;
                          return;
                        }
                      }
                    } else if (
                      this.documento.tipodocumento.id == this.doc_soporte_id &&
                      this.notaajuste
                    ) {
                      encabezado.model.id = 0;
                      encabezado.model.referencia = this.documento.id;
                      encabezado.model.tipo = this.nota_ajuste_id;
                      encabezado.model.fecha = moment().format("YYYY-MM-DD");
                      encabezado.model.fechaven = moment().format("YYYY-MM-DD");
                    }
                  }
                }
              } else {
                validar = true;
              }
              if (validar == true) {
                encabezado.model.nota_parcial = this.enviar_nota_parcial ? true : this.nota_parcial;
                parametros = {
                  encabezado: encabezado.model,
                  tarjeta: encabezado.tarjetas,
                  consignacion: encabezado.consignacion,
                  cheques: encabezado.cheques,
                  contabilizacion: contabilizacion,
                  factura: factura,
                  copiado: this.copiado,
                };
                if (this.tipodocument == 4 && this.nota_parcial == true) {
                  this.verdocumento = false;
                  this.auditorias = [];
                  this.nota_parcial = false;
                  for (let i = 0; i < this.contabilizacion.length; i++) {
                    this.contabilizacion[i].pago_id = null;
                  }
                  return;
                }
                const data = await this.Post("contabilidad/documentos", parametros);
                if (Array.isArray(data)) {
                  if (this.documento.tipodocumento.id == 1) {
                    this.$refs.encaingresos.limpiar_cheques();
                  }
                  this.notacredito = false;
                  this.notaajuste = false;
                  this.nota_parcial = false
                  this.enviar_nota_parcial = false
                  if (data.length > 0) {
                    if (this.archivos_store.length > 0) {
                      var documento_id = data[0][0];
                      let fileUpload = this.archivos_store.filter((f) => f.id == null);
                      for (let i = 0; i < fileUpload.length; i++) {
                        await this.PostFile(
                          "contabilidad/documentos/" + documento_id + "/upload",
                          fileUpload[i]
                        );
                        
                      }
                    }
                    this.archivos = [];
                    this.expandir = false;
                    this.persona_id = null;
                    this.numdocumentogene = data[0][1];
                    this.consultarEstado(data[0][0]);
                    this.getAuditoria(data[0][0]);
                    this.$emit("reload");
                    this.LFinish(
                      `${
                        encabezado.model.id == 0
                          ? "Se ha generado el documento número: " + data[0][1]
                          : "Documento modificado correctamente."
                      }`,
                      () => {
                        this.verdocumento = true;
                        let continuar = true;
                        if (this.cerrar_doc_automatico == true) {
                          if (this.nota_parcial == false) {
                            this.cerrardocumento = true;
                            this.accionDocumento(1);
                            continuar = false;
                          }
                        }
                        if (continuar) {
                          this.GetDocumentos(data[0][0]).then(() => {
                            if (sessionStorage.getItem("documentosfiltrados") != null) {
                              var storedocument = JSON.parse(
                                sessionStorage.getItem("documentosfiltrados")
                              );
                              let index = storedocument.findIndex(
                                (index) => index.id === encabezado.model.id
                              );
                              if (index >= 0) {
                                storedocument[index] = this.documento;
                              } else {
                                storedocument.push(this.documento);
                              }
                              sessionStorage.setItem(
                                "documentosfiltrados",
                                JSON.stringify(storedocument)
                              );
                              this.$store.commit(
                                "contabilidad/SET_LISTFILTERDOCUMENTOS",
                                JSON.parse(sessionStorage.getItem("documentosfiltrados"))
                              );
                            }
                          });
                        }
                      },
                      false
                    );
                    this.nota_parcial = false;
                    this.copiado = false;
                  }
                }
              }
            } else {
              this.cerrardocumento = false;
              this.nota_parcial = false;
              this.enviar_nota_parcial = false
            }
          }
        }, 1000);
      } catch ({ message }) {
        // console.error(message);
      }
      this.edicion_contabilizacion=false;
    },
    cancelar(tipodocumento) {
      if (tipodocumento == 1) {
        this.$refs.encaingresos.onReset();
      } else if (tipodocumento == 2) {
        this.$refs.encaegresos.onReset();
      } else if (tipodocumento == 3) {
        this.$refs.encanotascontables.onReset();
      } else if (tipodocumento == 4) {
        this.$refs.factura.onReset();
        this.$refs.encafacturas.onReset();
      }
      this.$refs.contabilizacion.onReset();
      this.auditorias = [];
      this.inmuebles_asociados = [];
    },
    async consultarEstado(id) {
    const result = await this.Get(`contabilidad/documentos/${id}`);
      this.documento = result;
    },
    salirDocumento() {
      const $router = this.$router;
      this.LConfim(
        "¿Está seguro de cancelar el proceso del documento?",
        () => {
          if (this.document != undefined) {
            // if (this.$route.params.documento != undefined) {
            if (this.tipodocument == 1) {
              this.$refs.encaingresos.limpiar_cheques();
            }
            this.GetDocumentos(this.$route.params.id_doc);
            this.verdocumento = true;
          } else {
            this.cancelar(this.tipodocument);
          }
        },
        () => {},
        false
      );
    },
    primertotal(val) {
      this.$refs.contabilizacion.asignarprimertotal(1, val);
    },
    async ejecutarEventos(tipo, val) {
      switch (tipo) {
        case 1:
          //Asignar valor en egresos casa ves que se cambie algo en la grid.
          this.$refs.encaegresos.asignarValor(val);
          break;
        case 2:
          //Asignar el concepto del encabezado en la primera fila de la grilla.
          this.$refs.contabilizacion.ejecurtarEventosGrid(1, val);
          break;
        case 3:
          //Asignar el concepto en la primera fila de la grilla.      
          if (!this.verdocumento) {
            if (val == null) {
              this.$refs.contabilizacion.ejecurtarEventosGrid(2, null);
            } else {
              this.$refs.contabilizacion.ejecurtarEventosGrid(2, val);
            }
          }
          break;
        case 4:
          //Asignar la persona en la primera fila de la grilla.
          if (val == null) {
            this.$refs.contabilizacion.ejecurtarEventosGrid(3, null);
            this.inmuebles_asociados = [];
          } else {
            if (this.verdocumento == false) {
              this.$refs.contabilizacion.ejecurtarEventosGrid(3, val);
              this.inmuebles_asociados = val.inmuebles_asociados;
            }
          }
          break;
        case 5:
          //Validacion para seleccionar la persona del primer registro de la grilla para documento de tipo nota contable.
          this.persona_id = val;
          break;
        case 6:
          //Validar si es recibo de caja coloca en el primer mayor la cuenta de caja si no la cuenta que se seleccione en bacos
          if (val.tipo == "INGRESO") {
            if (val.clase == "CAJA") {
              var param = {
                id: this.cod_ini_ingreso,
                tipo: 1,
              };
              this.$refs.contabilizacion.ejecurtarEventosGrid(4, param);
            } else {
              var param = {
                id: val.id,
                tipo: 1,
              };
              this.$refs.contabilizacion.ejecurtarEventosGrid(4, param);
            }
          } else if (val.tipo == "EGRESO") {
            if (val.clase == "CAJA") {
              var param = {
                id: this.cod_ini_egreso,
                tipo: 2,
              };
              this.$refs.contabilizacion.ejecurtarEventosGrid(4, param);
            } else {
              var param = {
                id: val.id,
                tipo: 2,
              };
              this.$refs.contabilizacion.ejecurtarEventosGrid(4, param);
            }
          }
          break;
        case 7:
          //Asignar el detalle del documento al primer concepto de la grid
          if (!this.verdocumento) {
            this.$refs.contabilizacion.ejecurtarEventosGrid(5, val);
          }
          break;
        case 8:
          //Cambiar de tab a contabilizacion cuando falten campos por llenar en tipo de documento factura
          setTimeout(() => {
            if (this.validacion_from_facturas == 2) {
              this.$refs.encafacturas.cambiartabs("contabilizacion");
            }
          }, 1000);
          break;
        case 9:
          //Asignar id de l inmueble seleccionado en la grid
          this.$refs.contabilizacion.ejecurtarEventosGrid(6, val);
          this.$refs.modalinmoasociados.close();
          break;
        case 10:
          //Validar si es tipo de documento es documento soporte para que la contabilizacion no sea obligatoria
          this.$refs.contabilizacion.ejecurtarEventosGrid(7, val);
          break;
        case 11:
          //Es factura de Proveedor
          this.esProveedor = val;
          break;
        case 12:
          //Marcar check de incluir cupones
          // if (val.value == this.cta_arr_id) {
          //   if (this.tipodocument == 1) {
          //     this.$refs.encaingresos.asignarIncluirEnCupon(true);
          //   } else if (this.tipodocument == 2) {
          //     this.$refs.encaegresos.asignarIncluirEnCupon(true);
          //   } else if (this.tipodocument == 3) {
          //     this.$refs.encanotascontables.asignarIncluirEnCupon(true);
          //   }
          // }
          try {
            if (this.tipodocument == 2) {
              this.$refs.encaegresos.validateCheckPago(val);
            } else if (this.tipodocument == 3) {
              this.$refs.encanotascontables.validateCheckPago(val);
            }
          } catch (error) {}
          break;
      }
    },
    async imprimirDocumento() {
      if (this.documento.estado == 1 || this.documento.estado == 4) {
        this.LInfo(
          "warning",
          "El documento no se puede imprimir en el estado actual."
        );
        return;
      }
      let total_db = 0;
      let total_cr = 0;
      this.documento.contabilizacion.forEach((element) => {
        total_db = total_db + element.valor_db;
        total_cr = total_cr + element.valor_cr;
      });
      
      if (total_db.toFixed(2) != total_cr.toFixed(2)) {
        this.LInfo(
          "warning",
          "Documento descuadrado no se puede imprimir."
        );
        return;
      }
      var params = {
        id: this.documento.id,
        tipodocumento: this.tipodocument,
      };
      let url = await this.view_pdf("contabilidad/documentos/imprimir_documento", "post", params);
      if (url != undefined) {
        this.pdfs.path = url;
        this.$refs.imprimirdocumento.abrirmodal(this.pdfs);
      }
    },
    navegacion(accion) {
      this.keynavegacion = {
        primero: false,
        anterior: false,
        siguiente: false,
        ultimo: false,
      };
      var storedocument = JSON.parse(sessionStorage.getItem("documentosfiltrados"));
      var key = null;
      switch (accion) {
        case 1:
          this.GetDocumentos(storedocument[0].id);
          this.id_doc = storedocument[0].id;
          this.document = storedocument[0].numero;
          break;
        case 2:
          key = storedocument.findIndex(
            (index) => index.numero === this.documento.numero
          );
          if (key - 1 >= 0) {
            this.GetDocumentos(storedocument[key - 1].id);
            this.id_doc = storedocument[key - 1].id;
            this.document = storedocument[key - 1].numero;
          }
          break;
        case 3:
          key = storedocument.findIndex(
            (index) => index.numero === this.documento.numero
          );
          if (key + 1 <= storedocument.length - 1) {
            this.GetDocumentos(storedocument[key + 1].id);
            this.id_doc = storedocument[key + 1].id;
            this.document = storedocument[key + 1].numero;
          }
          break;
        case 4:
          this.GetDocumentos(storedocument[storedocument.length - 1].id);
          this.id_doc = storedocument[storedocument.length - 1].id;
          this.document = storedocument[storedocument.length - 1].numero;
          break;
      }
    },
    async GetTiposdocumentos() {
      await this.Get("contabilidad/tiposdocumentos").then((data) => {
        this.tiposdocumentos = data;
        const resp = this.tiposdocumentos.filter(
          (filter) => filter.id == this.nota_credito_id
        );
        if (resp.length > 0) {
          this.tiporc = resp[0].tipo;
        }
      });
    },
    async GetDocumentos(numero) {
      var key = null;
      try {
        this.disable_nota_parcial = false;
        this.contabilizacion = [];
        this.factura = [];
        this.archivos = [];
        var params = {
          numero: numero,
        };
        await this.Post("contabilidad/documentos/numero", params).then(
          (resp) => {
            if (resp[0].contabilizacion.length > 0) {
              this.validar_cta_arre(resp[0].contabilizacion.filter((f) => f.mayor_id == this.cta_arr_id).length == 0 ? true : false);
              resp[0].encabezado.model.incluir_cupones = (resp[0].contabilizacion.filter((f) => f.mayor_id == this.cta_arr_id && f.es_novedad == true).length > 0 ? true : false);
            }
            this.$store.commit("generales/SET_ARCHIVOS_STORE", resp[0].archivos);
            this.documento = resp[0];
            this.encabezado = resp[0].encabezado;
            this.es_nota_credito = false;
            if (this.documento.tipodocumento.fuente == 4) {
              this.encabezado.model.referencia = this.documento.id;
              this.nota_parcial = this.encabezado.model.nota_parcial;
              this.es_nota_credito = this.encabezado.model.es_nota_credito;
            }
            if (resp[0].contabilizacion.length > 0) {
              resp[0].contabilizacion.forEach((element) => {
                this.contabilizacion.push({
                  mayor_id: element.mayor_id,
                  persona_id: element.personas_id,
                  concepto_id: element.concepto_id,
                  detalle: element.detalle,
                  valorcr: element.valor_cr,
                  valordb: element.valor_db,
                  tercero_id: element.nittercero,
                  base: element.base,
                  mov_id: element.id,
                  cc_id: element.centro_costos_id,
                  docref: element.docref,
                  inmu_id: element.inmueble_id,
                  pago_id: element.pago_id,
                  direccion: element.direccion,
                  pagado: element.pagado,
                  es_novedad: element.es_novedad,
                  pago_arr: element.pago_arr
                });
              });
            }
            resp[0].factura.forEach((element) => {
              this.factura.push({
                concepto_id: element.concepto_id,
                cantidad: parseInt(element.cantidad),
                detalle: element.detalle,
                iva: element.piva,
                valor: element.valor,
                valoriva: 0,
                retencion: element.retencion,
                orden: element.orden,
                id: element.id,
                mandantes: element.mandantes
              });
            });
            this.porcentajes = resp[0].encabezado.porcentajes;
            if (sessionStorage.getItem("documentosfiltrados") != null) {
              this.indexnavegacion = true;
              var storedocument = JSON.parse(
                sessionStorage.getItem("documentosfiltrados")
              );
              key = storedocument.findIndex(
                (index) => index.id === this.documento.id
              );
              if (storedocument.length == 1) {
                this.keynavegacion.primero = true;
                this.keynavegacion.anterior = true;
                this.keynavegacion.siguiente = true;
                this.keynavegacion.ultimo = true;
              } else {
                if (key == 0) {
                  this.keynavegacion.primero = true;
                  this.keynavegacion.anterior = true;
                } else if (key == storedocument.length - 1) {
                  this.keynavegacion.siguiente = true;
                  this.keynavegacion.ultimo = true;
                }
              }
            }
          }
        );
      } catch ({ message }) {
        // console.error(message);
      }
    },
    cargarmodal() {
      this.getProcesos("008");
      this.getAuditoria();
      this.getList_conceptos_conta();
      this.getList_cta_banco();
      this.getList_centro_costo();
      this.$store.commit("parametros/SET_NOTA_CREDITO_ID", null);
      if (this.document != undefined) {
        if (this.id_doc != undefined) {
          this.GetDocumentos(this.id_doc);
          this.verdocumento = true;
          this.$route.meta.validar_salida = false;
        }
      }
      this.GetTiposdocumentos();
    },
    onReset() {
      this.tabs = true;
      this.edicion_contabilizacion = false;
      this.notacredito = false;
      this.notaajuste = false;
      this.documento = {
        tipodocumento: {
          id: null,
        },
      };
      this.verdocumento = false;
      this.validacion = true;
      this.persona_id = null;
      this.encabezado = null;
      this.cheques = [];
      this.contabilizacion = [];
      this.factura = [];
      this.porcentajes = {};
      this.cerrardocumento = false;
      this.mensaje = null;
      this.validnota_credito = false;
      this.tdfuente = null;
      this.tiporc = null;
      this.tiporcdoc = null;
      this.numdocumentogene = null;
      this.pdfs = { path: null };
      this.keynavegacion = {
        primero: false,
        anterior: false,
        siguiente: false,
        ultimo: false,
      };
      this.indexnavegacion = false;
      this.archivos = [];
      this.expandir = false;
      this.validacion_from_facturas = 0;
      this.auditorias = [];
      this.id_doc = null;
      this.document = null;
      this.tipodocument = null;
      this.inmuebles_asociados = [];
      this.bloquear_btn = false;
      this.$store.commit("generales/SET_ARCHIVOS_STORE", []);
    },
    actualizar_archivos(archivos) {
      this.archivos = archivos;
    },
    validacionPermisosCerrarDoc(){
      if (this.documento.estado == 2 || this.documento.estado == 3) {
        if (this.documento.tipodocumento.tipo == 'RC') return 'reabrir_recibo_caja'
        if (this.documento.tipodocumento.tipo == 'RB') return 'reabrir_recibo_banco'
        if (this.documento.tipodocumento.fuente == 2) return 'reabrir_egreso'
        return 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_reabrir_documento'
      } 
      return 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_cerrar_documento'
    },
    validacionPermisosAnularDoc(){
      if (this.documento.tipodocumento.tipo == 'RC') return 'anular_recibo_caja'
      if (this.documento.tipodocumento.tipo == 'RB') return 'anular_recibo_banco'
      if (this.documento.tipodocumento.fuente == 2) return 'anular_egreso'

      if (this.documento.tipodocumento.fuente == 4 && this.tiporc != this.tiporcdoc && this.esProveedor == false) {
        return 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_nota_credito'
      } else if (this.documento.tipodocumento.fuente == 4 && this.tiporc == this.tiporcdoc && esProveedor == false) {
        return 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_anular_nota_credito'
      } else {
        return 'view_menu_gestion_contable_gastos_administrativos_documentos_acciones_anular_documento'
      }
    }
  },
  watch: {
    bloquear_btn(val) {
      if (val == true) {
        setTimeout(() => {
          this.bloquear_btn = false;
        }, 2000);
      }
    },
    nota_credito_id() {
      if (this.documento.tipodocumento.id == 4) {
        setTimeout(() => {
          if (Object.keys(this.documento).length !== 0) {
            if (this.documento.tipodocumento.id != this.nota_credito_id) {
              this.validnota_credito = false;
              this.tdfuente = this.documento.tipodocumento.id;
            } else {
              this.validnota_credito = true;
            }
          }
        }, 1000);
      }
    },
    documento() {
      this.tiporcdoc = this.documento.tipodocumento.tipo;
      if (this.documento.tipodocumento.id == this.nota_credito_id) {
        this.tdfuente = this.documento.tipodocumento.fuente;
      }
    },
    copiadocumento() {
      this.verdocumento = false;
      this.$router.app._route.meta.validar_salida = false;
      // this.$router.replace({
      //   name: "creardocumentos",
      //   params: { tipodocumento: this.documento.tipodocumento.fuente },
      //   meta: {
      //     validar_salida: false,
      //   },
      // });
      try {
        var tipodocumento = this.documento.tipodocumento.fuente;
        this.encabezado = {};
        this.contabilizacion = [];
        this.factura = [];
        this.porcentajes = {};
        this.encabezado = this.copiadocumento.encabezado;
        setTimeout(() => {
          this.contabilizacion = this.copiadocumento.contabilizacion;
          this.factura = this.copiadocumento.factura;
        }, 500);
        this.porcentajes = this.copiadocumento.encabezado.porcentajes;
        if (tipodocumento == 1) {
          this.$refs.encaingresos.fechaactual();
        } else if (tipodocumento == 2) {
          //this.$refs.encaegresos.changeCheckPago(false);
          this.$refs.encaegresos.fechaactual();
        } else if (tipodocumento == 3) {
          //this.$refs.encanotascontables.changeCheckPago(false);
          this.$refs.encanotascontables.fechaactual();
        } else if (tipodocumento == 4) {
          this.encabezado.model.fecha = null;
          this.encabezado.model.fechaven = null;
          this.$refs.encafacturas.fechaactual();
        }
      } catch ({ message }) {
        // console.error(message);
      }
    },
  },
  // mounted() {
  //   this.$nextTick(() => {});
  // },
  mounted() {
    this.getList_conceptos_conta();
    this.getList_cta_banco();
    this.getList_centro_costo();
    this.$store.commit("parametros/SET_NOTA_CREDITO_ID", null);
    if (this.document != undefined) {
      if (this.id_doc != undefined) {
        this.getAuditoria(this.id_doc);
        this.GetDocumentos(this.id_doc);
        this.verdocumento = true;
        this.$route.meta.validar_salida = false;
      }
    }
    this.GetTiposdocumentos();
  },
};
</script>
<style lang="scss">
#crearDoc label.text-caption,
label {
  font-size: 16px !important;
}
#crearDoc label.q-field--with-bottom {
  padding-bottom: 5px !important;
}
#crearDoc .qinputheigth div.q-field__control.relative-position.row.no-wrap::after {
  height: 25px !important;
}
#crearDoc .qinputheigth div.q-field__control.relative-position.row.no-wrap::before {
  height: 25px !important;
}
#crearDoc .qinputheigth div.q-field__control.relative-position.row.no-wrap {
  height: 25px !important;
}
#crearDoc
  .qinputheigth
  div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip {
  height: 25px !important;
}
#crearDoc .qinputheigth div.q-field__native.row.items-center {
  min-height: 25px !important;
  padding: none !important;
}
#crearDoc .qinputheigth div.q-field__prepend.q-field__marginal.row.no-wrap.items-center {
  height: 25px !important;
}
#crearDoc .qinputheigth div.q-field__append.q-field__marginal.row.no-wrap.items-center {
  height: 25px !important;
}
#crearDoc .qinputheigth .q-field__native {
  padding: 0px !important;
}
#crearDoc .qinputheigth .q-field__native.row {
  min-height: 25px !important;
}

#crearDoc div.q-tab__label {
  font-size: 16px !important;
}

#crearDoc .bold input {
  font-weight: bold !important;
}

#crearDoc {
  .inputdocu .q-field__prepend {
    background: #d4e8f8 0% 0% no-repeat padding-box;
    border-radius: 24px 0px 0px 24px;
    opacity: 1;
  }
  .inputdocu.q-field--standout .q-field__control {
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #d4e8f8;
    border-radius: 24px;
    opacity: 1;
  }
  .inputdocu .q-field--outlined .q-field__control {
    padding: 0px 13px 0px 0px !important;
  }
  .inputdocu .q-field--outlined .q-field__control {
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #d4e8f8;
    border-radius: 24px;
    opacity: 1;
  }
}

.class_navegacion {
  background: #d4e8f8 0% 0% no-repeat padding-box;
  color: #42a5f5 !important;
  opacity: 1;
}
</style>
