<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <l-select
        col="3"
        label="Tipo de informe *"
        v-model="model.tipo"
        :options="tipo_informe"
        :clearable="false"
      />
      <l-input
        col="2"
        type="number"
        v-model="model.año"
        label="Año *"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-model="model.mesini"
        label="Mes *"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select-api
        col="3"
        url="contabilidad/mayor/selectctacartera"
        option-value="id"
        option-label="codigo_nombre"
        v-model="model.codigo"
        :rules="[$rules.required($t('validator.required'))]"
        label="Buscar Cuenta *"
      />
      <div class="q-ml-sm">
        <q-btn dense round color="primary" icon="search" @click="consultar" />
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <div class="col" v-if="tab == 'seguimientos'">
            <q-btn
              round
              dense
              unelevated
              color="white"
              @click="crearSeguimiento"
            >
              <q-icon name="mdi-plus" style="color: #42a5f5" />
              <q-tooltip>Crear Seguimiento</q-tooltip>
            </q-btn>
          </div>
          <can
            class="col"
            permiso="view_menu_contabilidad_consultas_informe_de_cartera_acciones_imprimir"
          >
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="imprimirConsulta"
              :disable="
                (infmes.length > 0 && tab == 'total') ||
                (infedades.length > 0 && tab == 'total')
                  ? false
                  : true
              "
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
          <div class="col">
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="exportarexcel"
              :disable="
                (infmes.length > 0 && tab == 'total') ||
                (infedades.length > 0 && tab == 'total')
                  ? false
                  : true
              "
            >
              <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
              <q-tooltip>Exportar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-chip>
      <div class="col-12 q-mt-md">
        <!-- INFORME DE CARTERA POR MES -->
        <q-table
          class="my-sticky-header-table qtablecon"
          :data="infmes"
          :columns="columnsmes"
          row-key="name"
          flat
          dense
          bordered
          :hide-bottom="true"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
          v-if="model.tipo == 1"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th class="text-left">Nombre</q-th>
              <q-th class="text-left">Documento</q-th>
              <q-th class="text-right">Saldo</q-th>
              <q-th class="text-right">Ene</q-th>
              <q-th class="text-right">Feb</q-th>
              <q-th class="text-right">Mar</q-th>
              <q-th class="text-right">Abr</q-th>
              <q-th class="text-right">May</q-th>
              <q-th class="text-right">Jun</q-th>
              <q-th class="text-right">Jul</q-th>
              <q-th class="text-right">Ago</q-th>
              <q-th class="text-right">Sep</q-th>
              <q-th class="text-right">Oct</q-th>
              <q-th class="text-right">Nov</q-th>
              <q-th class="text-right">Dic</q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" style="background-color: white !important">
              <q-td key="documento" :props="props">
                {{ props.row.documento }}
              </q-td>
              <q-td key="nombre" :props="props">
                {{ props.row.nombre }}
              </q-td>
              <q-td key="saldo" :props="props">
                {{ formatTable(2, props.row.saldo) }}
              </q-td>
              <q-td key="enero" :props="props">
                {{ formatTable(2, props.row.enero) }}
              </q-td>
              <q-td key="febrero" :props="props">
                {{ formatTable(2, props.row.febrero) }}
              </q-td>
              <q-td key="marzo" :props="props">
                {{ formatTable(2, props.row.marzo) }}
              </q-td>
              <q-td key="abril" :props="props">
                {{ formatTable(2, props.row.abril) }}
              </q-td>
              <q-td key="mayo" :props="props">
                {{ formatTable(2, props.row.mayo) }}
              </q-td>
              <q-td key="junio" :props="props">
                {{ formatTable(2, props.row.junio) }}
              </q-td>
              <q-td key="julio" :props="props">
                {{ formatTable(2, props.row.julio) }}
              </q-td>
              <q-td key="agosto" :props="props">
                {{ formatTable(2, props.row.agosto) }}
              </q-td>
              <q-td key="septiembre" :props="props">
                {{ formatTable(2, props.row.septiembre) }}
              </q-td>
              <q-td key="octubre" :props="props">
                {{ formatTable(2, props.row.octubre) }}
              </q-td>
              <q-td key="noviembre" :props="props">
                {{ formatTable(2, props.row.noviembre) }}
              </q-td>
              <q-td key="diciembre" :props="props">
                {{ formatTable(2, props.row.diciembre) }}
              </q-td>
            </q-tr>
          </template>
           <template v-slot:bottom-row>
              <q-tr v-if="infmes.length > 0">
                <q-td colspan="2" class="text-right texttotales text-weight-bold"><span> Totales: </span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_inicial) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_enero) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_febrero) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_marzo) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_abril) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_mayo) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_junio) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_julio) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_agosto) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_septiembre) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_octubre ) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_noviembre) }}</span></q-td>
                <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(totales_cartera.total_diciembre) }}</span></q-td>
              </q-tr>
            </template>
        </q-table>
        <!-- FIN INFORME DE CARTERA POR MES -->
      </div>
      <!-- INFORME DE CARTERA POR EDADES -->
      <div class="col-12 q-mt-md" v-if="model.tipo == 2">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="total" label="Cartera por edades"></q-tab>
          <q-tab name="detalles" label="Detalles"></q-tab>
          <q-tab name="seguimientos" label="Seguimientos"></q-tab>
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="total">

            <q-table
              class="my-sticky-header-table-edades qtablecon"
              :data="infedades"
              :columns="columnsedades"
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
                  <q-th class="bg-primary text-left">
                    <q-radio disable v-model="chec_cabecera" :val="null" />
                  </q-th>
                  <q-th class="bg-primary text-left">Documento</q-th>
                  <q-th class="bg-primary text-left">Nombre</q-th>
                  <q-th class="bg-primary text-left">Saldo</q-th>
                  <q-th class="bg-primary text-right">0 - 30 Días</q-th>
                  <q-th class="bg-primary text-right">31 - 60 Días</q-th>
                  <q-th class="bg-primary text-right">61 - 90 Días</q-th>
                  <q-th class="bg-primary text-right">91 - 120 Días</q-th>
                  <q-th class="bg-primary text-right">121 - 150 Días</q-th>
                  <q-th class="bg-primary text-right">151 - 180 Días</q-th>
                  <q-th class="bg-primary text-right">180 Días</q-th>
<!--                  <q-th class="bg-primary text-right">Total</q-th>-->
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" style="background-color: white !important">
                  <q-td key="check" :props="props">
                    <q-radio v-model="selected_check" :val="props.row" />
                  </q-td>

                  <q-td key="documento" :props="props">
                    {{ props.row.documento }}
                  </q-td>

                  <q-td key="nombre" :props="props">
                    {{ props.row.nombre }}
                  </q-td>
                  <q-td key="saldof" :props="props">
                    {{ formatTable(2, props.row.saldof) }}
                  </q-td>
                  <q-td key="v030" :props="props">
                    {{ formatTable(2, props.row.v030) }}
                  </q-td>
                  <q-td key="v3160" :props="props">
                    {{ formatTable(2, props.row.v3160) }}
                  </q-td>
                  <q-td key="v6190" :props="props">
                    {{ formatTable(2, props.row.v6190) }}
                  </q-td>
                  <q-td key="v91120" :props="props">
                    {{ formatTable(2, props.row.v91120) }}
                  </q-td>
                  <q-td key="v121150" :props="props">
                    {{ formatTable(2, props.row.v121150) }}
                  </q-td>
                  <q-td key="v151180" :props="props">
                    {{ formatTable(2, props.row.v151180) }}
                  </q-td>
                  <q-td key="v181" :props="props">
                    {{ formatTable(2, props.row.v181) }}
                  </q-td>
<!--                  <q-td key="total" :props="props">-->
<!--                    {{ formatTable(2, props.row.total) }}-->
<!--                  </q-td>-->
                </q-tr>
              </template>
            </q-table>
              <div class="flex justify-end q-pt-lg">
                {{ `${ infedades.length <= model.limite ? infedades.length + (model.limite * (current - 1)) :  infedades.length} De un total de registros: ${totalRegistros}` }}
              </div>
              <q-card
                flat
                class="text-black"
                v-if="model.tipo == 2"
                >
                <q-toolbar>
                  <q-toolbar-title>
                    <div class="row q-ma-md">
                      <div class="col" v-for="(item, index) in totales" :key="index" style="font-size: 12px;">
                        <span>
                          <l-money
                            v-model="item.total"
                            :label="item.label"
                            disable
                            prefijo="$ "
                            sufijo
                            icon="monetization_on"
                            readonly
                          />
                        </span>
                      </div>
                    </div>
                  </q-toolbar-title>
                </q-toolbar>
              </q-card>
              <template>
                <div class="q-pa-lg flex flex-center">
                  <q-pagination
                    v-model="current"
                    :max="count"
                    @click="consultar"
                  />
                </div>
              </template>
          </q-tab-panel>

          <q-tab-panel name="detalles">
            <detallesCartera :data_detalles="data_detalles" />
          </q-tab-panel>

          <q-tab-panel name="seguimientos">
            <seguimientosCartera
              ref="seguimientoCartera"
              @actualizar_tabla="segumientos(selected_check)"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <!-- FIN INFORME DE CARTERA POR EDADES -->
    </q-form>
    <imprimirconsulta ref="imprimirconsulta" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import imprimirconsulta from "./partial/imprimir";
import detallesCartera from "./partial/detalles";
import seguimientosCartera from "./partial/segumientos";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
    detallesCartera,
    seguimientosCartera,
  },
  props: {},
  data() {
    return {
      current: 1,
      count: 1,
      totalRegistros: 0,
      totales_cartera: {},
      chec_cabecera: false,
      selected_check: '',
      tab: 'total',
      data_detalles: [],
      data_segumientos: [],
      tipo_informe: [
        { id: 1, nombre: "Informe de cartera por mes" },
        { id: 2, nombre: "Informe de cartera por edades" },
      ],
      shape: null,
      pagination: {
        rowsPerPage: 0,
      },
      model: {
        tipo: 1,
        año: null,
        mesini: null,
        codigo: null,
        limite: 100,
        cortePag: 0
      },
      pdfs: { path: null },
      infmes: [],
      infedades: [],
      columnsmes: [
        {
          name: "documento",
          label: "DOCUMENTO",
          align: "left",
          headerClasses: "bg-primary",
          field: "documento",
        },
        {
          name: "nombre",
          label: "NOMBRE",
          align: "left",
          headerClasses: "bg-primary",
          field: "nombre",
        },
        {
          name: "saldo",
          label: "SALDO",
          headerClasses: "bg-primary",
          field: "saldo",
        },
        {
          name: "enero",
          label: "ENERO",
          headerClasses: "bg-primary",
          field: "enero",
        },
        {
          name: "febrero",
          label: "FEBRERO",
          headerClasses: "bg-primary",
          field: "febrero",
        },
        {
          name: "marzo",
          label: "MARZO",
          headerClasses: "bg-primary",
          field: "marzo",
        },
        {
          name: "abril",
          label: "ABRIL",
          headerClasses: "bg-primary",
          field: "abril",
        },
        {
          name: "mayo",
          label: "MAYO",
          headerClasses: "bg-primary",
          field: "mayo",
        },
        {
          name: "junio",
          label: "JUNIO",
          headerClasses: "bg-primary",
          field: "junio",
        },
        {
          name: "julio",
          label: "JULIO",
          headerClasses: "bg-primary",
          field: "julio",
        },
        {
          name: "agosto",
          label: "AGOSTO",
          headerClasses: "bg-primary",
          field: "agosto",
        },
        {
          name: "septiembre",
          label: "SEPTIEMBRE",
          headerClasses: "bg-primary",
          field: "septiembre",
        },
        {
          name: "octubre",
          label: "OCTUBRE",
          headerClasses: "bg-primary",
          field: "octubre",
        },
        {
          name: "noviembre",
          label: "NOVIEMBRE",
          headerClasses: "bg-primary",
          field: "noviembre",
        },
        {
          name: "diciembre",
          label: "DICIEMBRE",
          headerClasses: "bg-primary",
          field: "diciembre",
        },
        {
          name: "total",
          label: "TOTAL",
          headerClasses: "bg-primary",
          field: "total",
        },
      ],
      columnsedades: [
        {
          name: "check",
          label: "",
          align: "left",
          headerClasses: "bg-primary",
          field: "check",
        },
        {
          name: "documento",
          label: "DOCUMENTO",
          align: "left",
          headerClasses: "bg-primary",
          field: "documento",
        },
        {
          name: "nombre",
          label: "NOMBRE",
          align: "left",
          headerClasses: "bg-primary",
          field: "nombre",
        },
        {
          name: "saldof",
          label: "SALDO",
          align: "left",
          headerClasses: "bg-primary",
          field: "saldof",
			  },
        {
          name: "v030",
          label: "0 - 30 DÍAS",
          headerClasses: "bg-primary",
          field: "v030",
        },
        {
          name: "v3160",
          label: "31 - 60 DÍAS",
          headerClasses: "bg-primary",
          field: "v3160",
        },
        {
          name: "v6190",
          label: "61 - 90 DÍAS",
          headerClasses: "bg-primary",
          field: "v6190",
        },
        {
          name: "v91120",
          label: "91 - 120 DÍAS",
          headerClasses: "bg-primary",
          field: "v91120",
        },
        {
          name: "v121150",
          label: "121 - 150 DÍAS",
          headerClasses: "bg-primary",
          field: "v121150",
        },
        {
          name: "v151180",
          label: "151 - 180 DÍAS",
          headerClasses: "bg-primary",
          field: "v151180",
        },
        {
          name: "v181",
          label: ">180 DÍAS",
          headerClasses: "bg-primary",
          field: "v181",
        },
        {
          name: "total",
          label: "TOTAL",
          headerClasses: "bg-primary",
          field: "total",
        },
      ],
      totales: [
        {
          label: "Saldo",
          total: 0,
        },
        {
          label: "Total 0 a 30 Días",
          total: 0,
        },
        {
          label: "Total 31 a 60 Días",
          total: 0,
        },
        {
          label: "Total 61 a 90 Días",
          total: 0,
        },
        {
          label: "Total 91 a 120 Días",
          total: 0,
        },
        {
          label: "Total 121 a 150 Días",
          total: 0,
        },
        {
          label: "Total 151 a 180 Días",
          total: 0,
        },
        {
          label: "Total > 180 Días",
          total: 0,
        },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    crearSeguimiento() {
      this.$refs.seguimientoCartera.abrir_modal(this.selected_check);
    },
    async verDetalles(data) {
      try {
        const datos = await this.Post({
          api: "contabilidad/consultas/consulta_detalles",
          model: {'id_persona':data.id_persona, 'codigo': this.model.codigo}
        });
        this.data_detalles = datos;
      } catch (error) {
        console.error(error);
      }
    },
    async segumientos(data) {
      try {
        // setTimeout(() => {
          let datos = await this.Post({
            api: "contabilidad/consultas/consulta_seguimientos",
            model: {'documento': data.documento}
          });
          // this.data_segumientos = datos
          setTimeout(() => {
            this.$refs.seguimientoCartera.carga_datos(datos)
          }, 100);
        // }, );
      } catch (error) {
        console.error(error);
      }
    },

    async exportarexcel() {
      let nombrefile = "";
      let data = {
        model: this.model,
        data: null,
      };
      if (this.model.tipo == 1) {
        data.data = this.infmes;
        nombrefile = "exportar_consulta_info_cartera_por_meses.xlsx";
      } else {
        data.data = this.infedades;
        nombrefile = "exportar_consulta_info_cartera_por_edades.xlsx";
      }
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_info_cartera",
        data
      ).then((resp) => {
        fileDownload(resp, nombrefile);
      });
    },
    async consultar() {
      // if (this.current === 1) {
      //   this.model.cortePag = 0
      // } else {
      //   this.model.cortePag = ((this.current -1) * 100)
      // }
      let params = {
        model: this.model
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          const data = await this.Post({
            api: "contabilidad/consultas/consulta_info_cartera",
            model: params,
          });
          if (this.model.tipo == 1) {
            this.infmes = data.data
            this.totales_cartera = data.totales
            this.totales_cartera.total_enero = this.totales_cartera.reduce((acumulador, val) => acumulador + val.enero, 0)
            this.totales_cartera.total_febrero = this.totales_cartera.reduce((acumulador, val) => acumulador + val.febrero, 0)
            this.totales_cartera.total_marzo = this.totales_cartera.reduce((acumulador, val) => acumulador + val.marzo, 0)
            this.totales_cartera.total_abril = this.totales_cartera.reduce((acumulador, val) => acumulador + val.abril, 0)
            this.totales_cartera.total_mayo = this.totales_cartera.reduce((acumulador, val) => acumulador + val.mayo, 0)
            this.totales_cartera.total_junio = this.totales_cartera.reduce((acumulador, val) => acumulador + val.junio, 0)
            this.totales_cartera.total_julio = this.totales_cartera.reduce((acumulador, val) => acumulador + val.julio, 0)
            this.totales_cartera.total_agosto = this.totales_cartera.reduce((acumulador, val) => acumulador + val.agosto, 0)
            this.totales_cartera.total_septiembre = this.totales_cartera.reduce((acumulador, val) => acumulador + val.septiembre, 0)
            this.totales_cartera.total_octubre = this.totales_cartera.reduce((acumulador, val) => acumulador + val.octubre, 0)
            this.totales_cartera.total_noviembre = this.totales_cartera.reduce((acumulador, val) => acumulador + val.noviembre, 0)
            this.totales_cartera.total_diciembre = this.totales_cartera.reduce((acumulador, val) => acumulador + val.diciembre, 0)
          } else if (this.model.tipo == 2) {
            this.infedades = data.data;
            this.count = Math.ceil(data.count.count / this.model.limite);
            this.totalRegistros = data.count.count
            this.totales[0].total = this.infedades.reduce((acumulador, val) => acumulador + val.saldof, 0)
            this.totales[1].total = this.infedades.reduce((acumulador, val) => acumulador + val.v030, 0)
            this.totales[2].total = this.infedades.reduce((acumulador, val) => acumulador + val.v3160, 0)
            this.totales[3].total = this.infedades.reduce((acumulador, val) => acumulador + val.v6190, 0)
            this.totales[4].total = this.infedades.reduce((acumulador, val) => acumulador + val.v91120, 0)
            this.totales[5].total = this.infedades.reduce((acumulador, val) => acumulador + val.v121150, 0)
            this.totales[6].total = this.infedades.reduce((acumulador, val) => acumulador + val.v151180, 0)
            this.totales[7].total = this.infedades.reduce((acumulador, val) => acumulador + val.v181, 0)
          }
          if (data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    fechaActual() {
      let fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = fecha.getMonth() + 1;
    },
    formatTable(caso, val, detalle = null) {
      let formatterPeso = new Intl.NumberFormat("es-CO", {
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
      }
    },
    colorTable(caso) {
      switch (caso) {
        case 1:
          return "background-color:#F5B21D17; color: darkslateblue; font-weight: bold;";
        case 11:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 12:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 2:
          return "background: #29C16017 padding-box; color: #008000; font-weight: bold;";
        case 21:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 22:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 3:
          return "background-color: #6BB7E017; color: #826431; font-weight: bold;";
        case 31:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 32:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        default:
          return "background-color: rgb(2520, 250, 210, 0.5); color: white;";
      }
    },
    async imprimirConsulta() {
      let params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_info_cartera",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(
            this.pdfs,
            "INFORME DE CARTERA"
          );
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.tipo = 12;
    },
     formatMoney (val) {
      if (val == null) {
        val = 0
      }
      const formatterPeso = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })
      return formatterPeso.format(val)
    }
  },
  watch: {
    tab(vald) {
      if (this.selected_check == "") {
        this.tab = "total";
        this.LInfo("info", "Debe seleccionar un registro para continuar.");
      } else {
        if (vald == "detalles") {
          this.verDetalles(this.selected_check);
        }
        if (vald == "seguimientos") {
          // setTimeout(() => {
          this.segumientos(this.selected_check);
          // }, 1000);
        }
      }
    },
    "model.tipo"(val) {
      if (val == 1) {
        this.infedades = [];
        this.model.tipo == 1 ? (this.tab = "total") : this.tab;
      } else {
        this.infmes = [];
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fechaActual();
      }, 500);
    });
  },
  created() {
    this.getConfMes();
  },
};
</script>
<style lang="scss">
.btnAcciones {
  border: 1px solid #42a5f5 !important;
  &:hover {
    color: #194880 !important;
    border: 1px solid #194880 !important;
    & i {
      color: #194880 !important;
    }
  }
}

.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>
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
.my-sticky-header-table {
  max-height: 700px !important;
}
.my-sticky-header-table-edades {
  max-height: 452px !important;  
}
</style>
