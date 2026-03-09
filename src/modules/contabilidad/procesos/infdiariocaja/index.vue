<template>
  <q-page class="">
    <div>
      <headers
        v-model="model"
        :options="diashabiles"
        :primera_caja="primera_caja"
        @emit-fecha="cambioFecha"
        @emit-iniciar-caja="abrirModalCaja"
        @emit-cerrar-caja="abrirModalCerrarCaja"
        @emitconsulta="getConsultar"
        @emit-regresarTab="getConsultar"
        class="head_estilo"
      />

      <q-tabs
        v-model="tab"
        dense
        class="tabprocesos tab_class"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
      >
        <q-tab
          name="resumen"
          label="Resumen"
          style="padding-left: 0px !important"
        />
        <q-tab name="por_concepto" label="Por Conceptos" />
        <q-tab name="detallado" label="Detallado" />
        <q-tab name="consiginaciones" label="Consignaciones" />

        <q-space />
      </q-tabs>
      <div class="row" v-if="tab != 'consiginaciones'">
        <div class="col text-right q-my-sm q-mr-xl">
          <q-btn
            round
            dense
            color="white"
            class="q-mr-sm"
            v-show="tab !== 'consiginaciones'"
            @click="imprimirDocumento"
          >
            <q-icon name="print" color="teal" />
            <q-tooltip> Imprimir </q-tooltip>
          </q-btn>
          <q-btn
                class="q-mr-sm"
                round
                dense
                color="white"
                v-show="tab == 'detallado'"
                @click="exportarexcel()"
              >
                <q-icon name="mdi-microsoft-excel" style="color: teal" />
                <q-tooltip>Exportar</q-tooltip>
              </q-btn>
        </div>
      </div>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="resumen">
          <tablaresumen v-model="model.resumen" />
        </q-tab-panel>

        <q-tab-panel name="por_concepto">
          <tablaporconceptos v-model="model.por_concepto" />
        </q-tab-panel>

        <q-tab-panel name="detallado">
          <tabladetallado v-model="model.detallado" />
        </q-tab-panel>

        <q-tab-panel name="consiginaciones">
          <tablacosignaciones
            v-model="model.consignaciones"
            :model="model"
            :caja_id="model.id"
            :estado="model.estado"
            @reload="getConsultar"
            @emitconsulta="actualizarConsignaciones"
            @imprimir_documento="imprimirDocumento"
            ref="tablaConsignaciones"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <inicializarcaja
      ref="inicializarcaja"
      @inicializar-caja="inicializarCaja"
    />
    <cerrarcaja ref="cerrarcaja" v-model="model" @cerrar-caja="cerrarCaja" />
    <imprimirdocumento ref="imprimirdocumento" />
  </q-page>
</template>

<script>
import headers from "./partial/headers.vue";
import inicializarcaja from "./partial/inicializarcaja.vue";
import tablaresumen from "./partial/tabla_resumen.vue";
import tablaporconceptos from "./partial/tabla_por_conceptos.vue";
import tabladetallado from "./partial/tabla_detallado.vue";
import tablacosignaciones from "./partial/tabla_cosignaciones.vue";
import cerrarcaja from "./partial/cerrarcaja.vue";
import imprimirdocumento from "./partial/imprimir.vue";
import moment from "moment";
import fileDownload from "js-file-download";
export default {
  name: "index",
  layout: "main",
  components: {
    tablaresumen,
    headers,
    inicializarcaja,
    tablaporconceptos,
    tabladetallado,
    tablacosignaciones,
    cerrarcaja,
    imprimirdocumento,
  },
  data() {
    return {
      tab: "resumen",
      model: {
        id: null,
        fecha: null,
        planilla: null,
        page: null,
        totalpage: null,
        diashabiles: [],
        resumen: [],
        por_concepto: [],
        detallado: [],
        consignaciones: [],
        documento_id: null,
        num_documento: null,
        estado: "",
        ultimo_consecutivo_consig: null,
        usuariocierre_id: "",
        usuarioinicial_id: "",
      },
      primera_caja: false,
      diashabiles: [],
      pdfs: { path: null },
    };
  },
  methods: {
    async exportarexcel() {
      let namefile ="detallado_caja.xlsx" ;
      var params = {
        'datos' : this.model.detallado,
        'fecha' : this.model.fecha,
        'planilla': this.model.planilla
      }
      await this.PostDownload("contabilidad/documentos/excel_detallado_caja", params
      ).then((resp) => {
        fileDownload(resp, namefile);
      });
    },
    actualizarConsignaciones() {
      setTimeout(() => {
        this.tab = "consiginaciones";
      }, 100);
      this.getConsultar();
    },
    abrirModalCaja() {
      this.$refs.inicializarcaja.abrirModal();
    },
    cambioFecha(val) {
      let page = null;
      this.model.diashabiles.forEach((element) => {
        if (element.fecha == moment(val, ["DD/MM/YYYY"]).format("YYYY-MM-DD")) {
          page = element.page;
        }
      });
      this.model.page = page;
    },
    async inicializarCaja(val) {
      let params = { ...val };
      params.fecha = moment(params.fecha, ["DD/MM/YYYY"]).format("YYYY-MM-DD");
      params.dia = moment(params.fecha).format("DD");
      await this.Post("contabilidad/info_diario_caja/inicializar", params).then(
        (resp) => {
          if (resp == "OK") {
            this.getConsultar();
            this.LInfo("success", "Caja inicializada correctamente.");
          }
        }
      );
    },
    // async reabrirCaja() {
    //   this.LConfim(
    //     "¿Está seguro de reabrir la caja?, la caja abierta actualmente quedará en un estado Inactiva.",
    //     async () => {
    //       await this.Post("contabilidad/info_diario_caja/reabir", {
    //         caja_id: this.model.id,
    //       }).then((resp) => {
    //         if (resp == "OK") {
    //           this.LInfo("success", "Caja reabierta correctamente");
    //           this.getConsultar();
    //         }
    //       });
    //     },
    //     () => {}
    //   );
    // },
    async cerrarCaja(model) {
      await this.Post("contabilidad/info_diario_caja/cerrar_caja", model).then(
        (resp) => {
          if (resp == "OK") {
            this.LInfo("success", "Caja cerrada correctamente.");
            this.getConsultar();
          }
        }
      );
    },
async imprimirDocumento() {
  
      var params = {
        'datos' : this.model.por_concepto,
        'estado': this.model.estado,
        'fecha' : this.model.fecha,
        'usuariocierre_id' : this.model.usuariocierre_id,
        'usuarioinicial_id': this.model.usuarioinicial_id,
        'planilla': this.model.planilla
      }
      switch (this.tab) {
        case 'por_concepto':
          params.datos = this.model.por_concepto;
          var data = await this.Post("contabilidad/documentos/imprimir_info_caja", params);
          break;

        case 'detallado':
          params.datos = this.model.detallado;
          var data = await this.Post("contabilidad/documentos/imprimir_info_caja", params);
          break;
        
        case 'resumen':
          params.datos = this.model.resumen;
          var data = await this.Post("contabilidad/documentos/imprimir_info_caja", params);
          break;
      
        default:
          var params = { id: this.model.documento_id };
          var data = await this.Post(`contabilidad/documentos/imprimir_documento`, params);
          break;
      }
      
      const url = window.URL.createObjectURL( new Blob([data], { type: "application/pdf" }));
      this.pdfs.path = url;
      this.$refs.imprimirdocumento.abrirmodal(this.pdfs);
    },
    abrirModalCerrarCaja() {
      let result = this.model.resumen.filter(
        (filter) => filter.descripcion.toLowerCase() == "totales"
      );
      this.$refs.cerrarcaja.abrirModal(result.length > 0 ? result[0] : null);
    },
    async getConsultar() {
      this.tab = "resumen";
      await this.Post(
        "contabilidad/info_diario_caja/consultar",
        this.model
      ).then((resp) => {
        if (resp != undefined) {
          if (resp.caja != null) {
            this.diashabiles = [];
            this.model = {
              id: resp.caja.results[0].id,
              fecha: moment(resp.caja.results[0].fecha, ["YYYY-MM-DD"]).format(
                "DD/MM/YYYY"
              ),
              planilla: resp.caja.results[0].planilla,
              page: this.model.page == null ? resp.caja.count : this.model.page,
              totalpage: resp.caja.count,
              ultimo_consecutivo_consig:
                resp.caja.results[0].ultimo_consecutivo_consig,
              diashabiles: resp.caja.fechas,
              resumen: resp.consulta.resumen,
              por_concepto: resp.consulta.por_concepto,
              detallado: resp.consulta.detallado,
              consignaciones: resp.caja.results[0].consignaciones,
              documento_id: resp.caja.results[0].documento_id,
              num_documento: resp.caja.results[0].num_documento,
              estado: resp.caja.results[0].estado,
              usuariocierre_id: resp.caja.results[0].usuariocierre_id,
              usuarioinicial_id: resp.caja.results[0].usuarioinicial_id,
            };
            resp.caja.fechas.forEach((element) => {
              this.diashabiles.push(moment(element.fecha).format("YYYY/MM/DD"));
            });
            this.primera_caja = true;
          }
        }
      });
    },
  },
  watch: {
    "model.page"() {
      this.getConsultar();
    },
  },
  created() {
    this.getConsultar();
  },
};
</script>

<style>
  .head_estilo {
    background: #f9f9f9 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000012;
    opacity: 1;
  }
  .tab_class {
    padding-top: 10px !important;
    border-bottom: 1px solid lightgrey;
    width: 96%;
  }
</style>