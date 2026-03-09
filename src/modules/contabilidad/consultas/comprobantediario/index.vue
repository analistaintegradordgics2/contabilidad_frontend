<template>
  <div class="q-ml-lg">
    <imprimirconsulta ref="imprimirconsulta" />
    <q-card flat>
      <q-card-section>
        <div class="q-mt-md">
          <div class="">
            <div class="row">
              <div class="col-2">
                <q-tabs
                  v-model="tab"
                  dense
                  class="q-mb-lg"
                  active-color="blue-10"
                  indicator-color="blue-10"
                  align="left"
                  @input="cambiartabs"
                >
                  <q-tab name="detalle" label="Detalle" />

                  <q-tab name="totales" label="Totales" />
                </q-tabs>
              </div>
              <q-separator class="q-mt-auto" style="margin-top: 35px" />
              <q-chip class="botones_acciones q-ma-none q-ml-xl q-mr-md " size="22px">
                <div class="row ">
                  <q-btn
                    class="btnAcciones q-mr-sm"
                    round
                    dense
                    unelevated
                    color="white"
                    @click="exportarexcel"
                    v-if="detallado.length > 0 && totales.length > 0"
                  >
                    <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
                    <q-tooltip>Exportar</q-tooltip>
                  </q-btn>

                  <can
                    permiso="view_menu_gestion_contable_informes_comprobante_diario_acciones_imprimir"
                  >
                    <q-btn
                      class="btnAcciones q-mr-sm"
                      round
                      dense
                      unelevated
                      @click="imprimirConsulta"
                      :disable="detallado.length > 0 ? false : true"
                    >
                      <!-- <q-icon name="print" color="orange" /> -->
                      <q-icon name="print" style="color: #42a5f5" />

                      <q-tooltip> Imprimir</q-tooltip>
                    </q-btn>
                  </can>
                  <can
                    permiso="view_menu_gestion_contable_informes_comprobante_diario_acciones_buscar"
                  >
                    <q-btn
                      unelevated
                      round
                      dense
                      color="primary"
                      icon="filter_list"
                      @click="abrirVentanaFiltro"
                      v-if="tab == 'detalle'"
                    >
                      <q-tooltip>Filtrar</q-tooltip>
                    </q-btn>
                  </can>
                </div>
              </q-chip>
            </div>

            <q-tab-panels v-model="tab" animated class="">
              <q-tab-panel name="detalle" class="q-pa-sm">
                <q-table
                  class="my-sticky-header-table"
                  style="background: white"
                  :data="detallado"
                  :columns="coldetalle"
                  row-key="name"
                  flat
                  dense
                  bordered
                  :hide-bottom="true"
                  :rows-per-page-options="[0]"
                  :pagination.sync="pagination"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th class="bg-primary">Número</q-th>
                      <q-th class="bg-primary">Fecha</q-th>
                      <q-th class="bg-primary">Código</q-th>
                      <q-th class="bg-primary">Nombre</q-th>
                      <q-th class="bg-primary">Documento</q-th>
                      <q-th class="bg-primary">Nombre Completo</q-th>
                      <q-th class="bg-primary">Nombre</q-th>
                      <q-th class="bg-primary">Detalle</q-th>
                      <q-th class="bg-primary">Débitos</q-th>
                      <q-th class="bg-primary">Créditos</q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr
                      :props="props"
                      :style="colorTable(props.row.encabezado, props.row.estado)"
                    >
                      <q-td key="numero" :props="props">
                        <span class="cursor-pointer" @click="verdocumentos(props.row.numero, props.row.tipodocumento, props.row.id, false)">
                          {{ props.row.numero }}
                          <q-tooltip>Ver documento</q-tooltip>
                        </span>
                      </q-td>
                      <q-td key="fecha" :props="props">
                        {{ props.row.fecha }}
                      </q-td>
                      <q-td key="codigol" :props="props">
                        {{ props.row.codigol }}
                      </q-td>
                      <q-td key="nombrel" :props="props">
                        {{ props.row.nombrel }}
                      </q-td>
                      <q-td key="documento" :props="props">
                        {{ props.row.documento }}
                      </q-td>
                      <q-td key="nombrecompleto" :props="props">
                        {{ props.row.nombrecompleto }}
                      </q-td>
                      <q-td key="nombre" :props="props">
                        {{ props.row.nombre }}
                      </q-td>
                      <q-td key="detalle" :props="props">
                        {{ props.row.detalle }}
                      </q-td>
                      <q-td key="valor_db" :props="props">
                        {{ formatTable(2, props.row.valor_db) }}
                      </q-td>
                      <q-td key="valor_cr" :props="props">
                        {{ formatTable(2, props.row.valor_cr) }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <div class="row q-pr-md q-mt-sm q-pl-sm">
                  <div
                    class="col-1 q-pl-lg"
                    style="
                      border-top: 1px solid #6bb7e0;
                      border-bottom: 1px solid #6bb7e0;
                      border-left: 1px solid #6bb7e0;
                      border-radius: 10px 0px 0px 10px;
                    "
                  >
                    <div class="text-weight-bold" style="color: #194880">Estados</div>
                    <div class="" style="color: #194880">Abiertos</div>
                    <div class="" style="color: #194880">Cerrados</div>
                    <div class="" style="color: #194880">Anulados</div>
                    <div class="" style="color: #194880">Total</div>
                  </div>

                  <div
                    class="col-1"
                    style="
                      border-top: 1px solid #6bb7e0;
                      border-bottom: 1px solid #6bb7e0;
                    "
                  >
                    <div class="text-weight-bold" style="color: #194880">RC</div>
                    <div style="color: #484848">
                      {{ abiertos.recibos_caja }}
                    </div>
                    <div style="color: #484848">
                      {{ cerrados.recibos_caja }}
                    </div>
                    <div style="color: #484848">
                      {{ anulados.recibos_caja }}
                    </div>
                    <div style="color: #484848">{{ totalrecibos_caja }}</div>
                  </div>

                  <div
                    class="col-1"
                    style="
                      border-top: 1px solid #6bb7e0;
                      border-bottom: 1px solid #6bb7e0;
                    "
                  >
                    <div class="text-weight-bold" style="color: #194880">CE</div>
                    <div style="color: #484848">{{ abiertos.egresos }}</div>
                    <div style="color: #484848">{{ cerrados.egresos }}</div>
                    <div style="color: #484848">{{ anulados.egresos }}</div>
                    <div style="color: #484848">{{ totalegresos }}</div>
                  </div>

                  <div
                    class="col-1"
                    style="
                      border-top: 1px solid #6bb7e0;
                      border-bottom: 1px solid #6bb7e0;
                    "
                  >
                    <div class="text-weight-bold" style="color: #194880">NC</div>
                    <div style="color: #484848">{{ abiertos.notas }}</div>
                    <div style="color: #484848">{{ cerrados.notas }}</div>
                    <div style="color: #484848">{{ anulados.notas }}</div>
                    <div style="color: #484848">{{ totalnotas }}</div>
                  </div>

                  <div
                    class=""
                    style="
                      width: 50px;
                      border-top: 1px solid #6bb7e0;
                      border-bottom: 1px solid #6bb7e0;
                      border-right: 1px solid #6bb7e0;
                      border-radius: 0px 10px 10px 0px;
                    "
                  >
                    <div class="text-weight-bold" style="color: #194880">FC</div>
                    <div style="color: #484848">{{ abiertos.facturas }}</div>
                    <div style="color: #484848">{{ cerrados.facturas }}</div>
                    <div style="color: #484848">{{ anulados.facturas }}</div>
                    <div style="color: #484848">{{ totalfacturas }}</div>
                  </div>

                  <q-space />

                  <!-- <span class="text-weight-bold">TOTALES:</span> -->
                  <div class="text-weight-bold">
                    <div
                      class="q-mx-xl row"
                      style="border: 1px solid #d4e8f8; border-radius: 16px"
                    >
                      <div
                        class="col-6"
                        style="
                          color: #194880;
                          background: #42a5f540;
                          border-radius: 15px 0px 0px 15px;
                          padding: 5px;
                        "
                      >
                        Total Débito:
                      </div>

                      <div class="col-6 q-my-auto" style="color: #194880; padding: 10px">
                        {{ formatTable(2, totalesdetallado.db) }}
                      </div>
                    </div>
                  </div>

                  <div class="text-right text-weight-bold">
                    <div
                      class="row"
                      style="border: 1px solid #d4e8f8; border-radius: 16px"
                    >
                      <div
                        class="col-6 text-left"
                        style="
                          color: #194880;
                          background: #42a5f540;
                          border-radius: 15px 0px 0px 15px;
                          padding: 5px;
                        "
                      >
                        Total Crédito:
                      </div>

                      <div class="col-6 q-my-auto" style="color: #194880; padding: 10px">
                        {{ formatTable(2, totalesdetallado.cr) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="totales" class="q-pa-sm">
                <q-table
                  class="my-sticky-header-table"
                  :data="totales"
                  :columns="coltotales"
                  row-key="name"
                  flat
                  dense
                  bordered
                  :hide-bottom="true"
                  :rows-per-page-options="[0]"
                  :pagination.sync="pagination"
                  ref="qtabletotales"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th class="bg-primary thtotales">Código</q-th>
                      <q-th class="bg-primary thtotales">Nombre</q-th>
                      <q-th class="bg-primary thtotales">Débito</q-th>
                      <q-th class="bg-primary thtotales">Crédito</q-th>
                      <q-th class="bg-primary thtotales">Total</q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props" style="background-color: #ffecb3">
                      <q-td key="codigol" :props="props">
                        {{ props.row.codigol }}
                      </q-td>
                      <q-td key="nombrel" :props="props">
                        {{ props.row.nombrel }}
                      </q-td>
                      <q-td key="valor_db" :props="props">
                        {{ formatTable(2, props.row.valor_db) }}
                      </q-td>
                      <q-td key="valor_cr" :props="props">
                        {{ formatTable(2, props.row.valor_cr) }}
                      </q-td>
                      <q-td key="total" :props="props">
                        {{ formatTable(2, props.row.total) }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <div class="row q-py-sm">
                  <div :style="`width: ${width.width1}px;`" class="text-right">
                    TOTALES:
                  </div>
                  <div
                    :style="`width: ${width.widthdb}px;`"
                    class="text-right q-px-sm text-weight-bold"
                  >
                    {{ formatTable(2, totaldb) }}
                  </div>
                  <div
                    :style="`width: ${width.widthcr}px;`"
                    class="text-right q-px-sm text-weight-bold"
                  >
                    {{ formatTable(2, totalcr) }}
                  </div>
                  <div
                    :style="`width: ${width.widthtotal}px;`"
                    class="text-right q-pl-sm q-pr-md text-weight-bold"
                  >
                    {{ formatTable(2, grantotal) }}
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <filtro ref="modalfiltro" @filtrado="consultar" />
    <verdocumentos ref="verdocumentos" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import imprimirconsulta from "./partial/imprimir";
import fileDownload from "js-file-download";
import filtro from "./partial/filtro";
import verdocumentos from "pages/contabilidad/procesos/documentos/partial/crear.vue"
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
    filtro,
    verdocumentos,
  },
  props: {
    // value: {
    //   type: Object,
    // },
  },
  data() {
    return {
      refs: "",
      shape: null,
      tab: "detalle",
      pagination: {
        rowsPerPage: 0,
      },
      fechas: {
        finicio: moment().format("YYYY/MM/DD"),
        ffin: moment().format("YYYY/MM/DD"),
      },
      model: {
        tipodoc: [],
        todas: 1,
        tipo: 1,
        finicio: moment().format("YYYY/MM/DD"),
        ffin: moment().format("YYYY/MM/DD"),
        estado: {
          abiertos: false,
          anulados: false,
          cerrados: false,
        },
      },
      pdfs: { path: null },
      detallado: [],
      totales: [],
      totaldb: 0,
      totalcr: 0,
      grantotal: 0,
      width: {
        width1: 0,
        widthdb: 0,
        widthcr: 0,
        widthtotal: 0,
      },
      coldetalle: [
        {
          name: "numero",
          label: "NÚMERO",
          align: "left",
          headerClasses: "bg-primary",
          field: "numero",
        },
        {
          name: "fecha",
          label: "FECHA",
          align: "left",
          headerClasses: "bg-primary",
          field: "fecha",
        },
        {
          name: "codigol",
          label: "CÓDIGO",
          headerClasses: "bg-primary",
          field: "codigol",
        },
        {
          name: "nombrel",
          label: "NOMBRE",
          headerClasses: "bg-primary",
          field: "nombrel",
        },
        {
          name: "documento",
          label: "DOCUMENTO",
          headerClasses: "bg-primary",
          field: "documento",
        },
        {
          name: "nombrecompleto",
          label: "NOMBRE COMPLETO",
          headerClasses: "bg-primary",
          field: "nombrecompleto",
        },
        {
          name: "nombre",
          label: "NOMBRE",
          headerClasses: "bg-primary",
          field: "nombre",
        },
        {
          name: "detalle",
          label: "DETALLE",
          field: "detalle",
          headerClasses: "bg-primary",
        },
        {
          name: "valor_db",
          label: "VALOR_DB",
          field: "valor_db",
          headerClasses: "bg-primary",
        },
        {
          name: "valor_cr",
          label: "VALOR_CR",
          headerClasses: "bg-primary",
          field: "valor_cr",
        },
      ],
      coltotales: [
        {
          name: "codigol",
          label: "CÓDIGO",
          headerClasses: "bg-primary",
          field: "codigol",
        },
        {
          name: "nombrel",
          label: "NOMBRE",
          headerClasses: "bg-primary",
          field: "nombrel",
        },
        {
          name: "valor_db",
          label: "VALOR_DB",
          field: "valor_db",
          headerClasses: "bg-primary",
        },
        {
          name: "valor_cr",
          label: "VALOR_CR",
          headerClasses: "bg-primary",
          field: "valor_cr",
        },
        {
          name: "total",
          label: "TOTAL",
          headerClasses: "bg-primary",
          field: "total",
        },
      ],
      totalesdetallado: {
        db: 0,
        cr: 0,
      },
      anulados: {
        recibos_caja: 0,
        egresos: 0,
        notas: 0,
        facturas: 0,
      },
      abiertos: {
        recibos_caja: 0,
        egresos: 0,
        notas: 0,
        facturas: 0,
      },
      cerrados: {
        recibos_caja: 0,
        egresos: 0,
        notas: 0,
        facturas: 0,
      },
      totalegresos: 0,
      totalfacturas: 0,
      totalrecibos_caja: 0,
      totalnotas: 0,
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    ...mapState("contabilidad", ["tipodocumentofuente"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("contabilidad", ["getTipodocumentoFuente"]),
    abrirVentanaFiltro() {
      this.$refs.modalfiltro.abrirventanafiltro(this.model);
    },
    async exportarexcel() {
      var data = null;
      if (this.tab == "detalle") {
        data = {
          model: this.detallado,
          tab: this.tab,
          finicio: this.model.finicio,
          ffin: this.model.ffin,
          namefile: "consulta_comprobrante_diario_detallada.xlsx",
        };
      } else {
        data = {
          model: this.totales,
          tab: this.tab,
          namefile: "consulta_comprobrante_diario_totales.xlsx",
        };
      }
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_comprobrante_diario",
        data
      ).then((resp) => {
        fileDownload(resp, data.namefile);
      });
    },
    selectTipodocumento(tipo) {
      this.getTipodocumentoFuente({ id: tipo, mostrar: false });
    },
    async consultar(model = null) {
      
      this.totalesdetallado = {
        db: 0,
        cr: 0,
      };
      this.refs = true;
      if (model !== null) {
        this.model = model.data;
        this.refs = await model.ref;
      }

      if (this.model.tipodoc.length == 0) {
        this.model.tipodoc.push(1, 2, 3, 4);
      }
      /*   if (this.fechas.finicio != null && this.fechas.finicio != "") {
        this.model.finicio = moment(this.fechas.finicio, ["DD/MM/YYYY","DD-MM-YYYY",]).format("YYYY-MM-DD");
      }
      if (this.fechas.ffin != null && this.fechas.ffin != "") {
        this.model.ffin = moment(this.fechas.ffin, ["DD/MM/YYYY","DD-MM-YYYY",]).format("YYYY-MM-DD");
      } */

      // return
      var params = {
        model: this.model,
      };

      try {
        // const validate = await ref;
        // const validate = await this.$refs.Formconsulta.validate();
        const validate = this.refs;
        if (validate) {
          this.totaldb = 0;
          this.totalcr = 0;
          this.grantotal = 0;
          this.cambiartabs();
          await this.Post({
            api: "contabilidad/consultas/consulta_comprobrante_diario",
            model: params,
          }).then((data) => {
            if (data.length == 0) {
              this.LInfo("info", "No hay información para mostrar");
            } else {
              this.detallado = data[0];
              this.totales = data[1];
              this.totales.forEach((element) => {
                this.totaldb = this.totaldb + element.valor_db;
                this.totalcr = this.totalcr + element.valor_cr;
                this.grantotal = this.grantotal + element.total;
              });

              this.resetdocumentos();
              
              // creo el array documentos para guardar el numero del documento y contar solo por documento y no los movimientos.
              let documentos = []
              this.detallado.forEach((element) => {
                element.valor_db = 0 ? element.valor_db == null : element.valor_db;
                element.valor_cr = 0 ? element.valor_cr == null : element.valor_cr;

                // TOTALES DOCUMENTOS
                if (!documentos.includes(element.numero)) {
                  documentos.push(element.numero)
                  if (element.tipodocumento == 1) {
                    if (element.estado == 3) {
                      this.anulados.recibos_caja = this.anulados.recibos_caja + 1;
                    } else if (element.estado == 1) {
                      this.abiertos.recibos_caja = this.abiertos.recibos_caja + 1;
                    } else if (element.estado == 2) {
                      this.cerrados.recibos_caja = this.cerrados.recibos_caja + 1;
                    }
                    if (element.estado != 4) {
                      this.totalrecibos_caja = this.totalrecibos_caja + 1;
                    }
                  }
                  if (element.tipodocumento == 2) {
                    if (element.estado == 3) {
                      this.anulados.egresos = this.anulados.egresos + 1;
                    } else if (element.estado == 1) {
                      this.abiertos.egresos = this.abiertos.egresos + 1;
                    } else if (element.estado == 2) {
                      this.cerrados.egresos = this.cerrados.egresos + 1;
                    }
                    if (element.estado != 4) {
                      this.totalegresos = this.totalegresos + 1;
                    }
                  }
                  if (element.tipodocumento == 3) {
                    if (element.estado == 3) {
                      this.anulados.notas = this.anulados.notas + 1;
                    } else if (element.estado == 1) {
                      this.abiertos.notas = this.abiertos.notas + 1;
                    } else if (element.estado == 2) {
                      this.cerrados.notas = this.cerrados.notas + 1;
                    }
                    if (element.estado != 4) {
                      this.totalnotas = this.totalnotas + 1;
                    }
                  }
                  if (element.tipodocumento == 4) {
                    if (element.estado == 3) {
                      this.anulados.facturas = this.anulados.facturas + 1;
                    } else if (element.estado == 1) {
                      this.abiertos.facturas = this.abiertos.facturas + 1;
                    } else if (element.estado == 2) {
                      this.cerrados.facturas = this.cerrados.facturas + 1;
                    }
                    if (element.estado != 4) {
                      this.totalfacturas = this.totalfacturas + 1;
                    }
                  }
                }
                // ---------solo sumar el valor que trae en sumas iguales 
                if (element.nombrecompleto == 'SUMAS IGUALES' ){
                  this.totalesdetallado.db += element.valor_db;
                  this.totalesdetallado.cr += element.valor_cr;
                }
              });
            }
          });
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    formatTable(caso, val, detalle = null) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      switch (caso) {
        case 1:
          if (val != null) {
            return moment(val, "YYYY-MM-DD").format("DD/MM/YYYY");
          }
          break;
        case 2:
          return formatterPeso.format(val);
        case 3:
          if (detalle != null) {
            var det = detalle.split(" ");
            if (det[0] == "SALDO") {
              return formatterPeso.format(val);
            }
          }
          break;
      }
    },
    colorTable(encabezado, estado) {
      if (estado == 1 || estado == 4) {
        if (encabezado == 1) {
          return "background-color: gray; color: white;";
        } else if (encabezado == 3) {
          return "background-color: #ffecb3; font-weight: bold;";
        } else {
          return "background-color: #ffecb3";
        }
      } else if (estado == 2) {
        if (encabezado == 1) {
          return "background-color: gray; color: white;";
        } else if (encabezado == 3) {
          return "background-color: #b3e5fc; font-weight: bold;";
        } else {
          return "background-color: #b3e5fc";
        }
      } else if (estado == 3) {
        if (encabezado == 1) {
          return "background-color: gray; color: white;";
        } else if (encabezado == 3) {
          return "background-color: lightgray; font-weight: bold;";
        } else {
          return "background-color: lightgray";
        }
      }
    },
    async imprimirConsulta() {
      if (this.tab == "detalle") {
        this.model["imprimir"] = 1;
      } else if (this.tab == "totales") {
        this.model["imprimir"] = 2;
      }
      this.model["fechas"] = this.fechas;
      var params = {
        model: this.model,
        anulados: this.anulados,
        abiertos: this.abiertos,
        cerrados: this.cerrados,
      };
      try {
        // const validate = await this.$refs.Formconsulta.validate();
        const validate = await this.refs;
        if (validate) {
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_comprobrante_diario",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(this.pdfs, "COMPROBANTE DIARIO");
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    cambiartabs() {
      if (this.tab == "totales") {
        setTimeout(() => {
          this.width.width1 =
            this.$el.querySelectorAll(".thtotales")[0].clientWidth +
            this.$el.querySelectorAll(".thtotales")[1].clientWidth;
          this.width.widthdb = this.$el.querySelectorAll(".thtotales")[2].clientWidth;
          this.width.widthcr = this.$el.querySelectorAll(".thtotales")[3].clientWidth;
          this.width.widthtotal = this.$el.querySelectorAll(".thtotales")[4].clientWidth;
        }, 700);
      }
    },
    onReset() {
      this.model.codigo = null;
      this.model.nommayor = null;
      this.model.codigonom.nombre1 = null;
    },
    resetdocumentos() {
      (this.anulados = {
        recibos_caja: 0,
        egresos: 0,
        notas: 0,
        facturas: 0,
      }),
        (this.abiertos = {
          recibos_caja: 0,
          egresos: 0,
          notas: 0,
          facturas: 0,
        }),
        (this.cerrados = {
          recibos_caja: 0,
          egresos: 0,
          notas: 0,
          facturas: 0,
        }),
        (this.totalegresos = 0);
      this.totalfacturas = 0;
      this.totalrecibos_caja = 0;
      this.totalnotas = 0;
    },
    async verdocumentos(documento, tipo_documento, id_doc, editar) {
      this.$refs.verdocumentos.abrirmodal(
        documento,
        tipo_documento,
        id_doc,
        editar
      );
    }
  },
  watch: {
    "model.tipodoc"(val) {
      this.getTipodocumentoFuente({ id: val, mostrar: false });
      this.model.tipo = 1;
      this.model.todas = 0;
      this.detallado = [];
      this.totales = [];
      this.totalesdetallado = {
        db: 0,
        cr: 0,
      };
    },
    "model.tipo"() {
      if (this.model.tipo != null) {
        this.model.todas = null;
      }
    },
    "model.todas"() {
      if (this.model.todas != null) {
        this.model.tipo = null;
      }
      this.detallado = [];
      this.totales = [];
      this.totalesdetallado = {
        db: 0,
        cr: 0,
      };
    },
  },
  mounted() {},
  created() {
    this.consultar();
    this.getTipodocumentoFuente({ id: 1, mostrar: false });
  },
};
</script>

<style>
.divfil {
  border: 1px solid lightgray;
  border-radius: 5px;
}
.q-field--with-bottom {
  padding-bottom: 5px !important;
}
.q-field__bottom.row.items-start.q-field__bottom--animated {
  display: none !important;
}
div.abiertos {
  margin: 3px;
  padding: 3px;
  height: 25px;
  background-color: #ffecb3;
}
div.anulados {
  margin: 3px;
  padding: 3px;
  height: 25px;
  background-color: #e0e0e0;
}
div.cerrados {
  margin: 3px;
  padding: 3px;
  height: 25px;
  background-color: #b3e5fc;
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
</style>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 380px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
