<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <div class="col">
        <div class="row">
          <l-select
            col="2"
            label="Tipo de informe *"
            v-model="model.tipoinf"
            :options="tipo_informe"
            :clearable="false"
          />
          <l-input
            col="2"
            type="number"
            v-model="model.año1"
            label="Año 1 *"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-select
            col="2"
            v-model="model.mesini1"
            label="Mes 1 *"
            option-value="id"
            option-label="nombre"
            :options="meses"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-input
            col="2"
            type="number"
            v-model="model.año2"
            label="Año 2 *"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-select
            col="2"
            v-model="model.mesini2"
            label="Mes 2 *"
            option-value="id"
            option-label="nombre"
            :options="meses"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <div class="q-ml-sm">
            <q-btn
              dense
              round
              color="primary"
              icon="search"
              @click="consultar"
            />
          </div>
          <div class="row q-gutter-md">
            <q-radio
              v-model="model.tipoview"
              :val="1"
              label="Parcial"
            />
            <q-radio
              v-model="model.tipoview"
              :val="2"
              label="Acumulado"
            />
            <q-checkbox v-model="model.ver_nits" label="Ver Nits" />
          </div>
        </div>
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_gestion_contable_informes_informes_comparativos_acciones_imprimir"
          >
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="imprimirConsulta"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
          <div>
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="exportarexcel"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
              <q-tooltip>Exportar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-chip>
      <div class="col-12 q-mt-md">
        <q-table
          class="my-sticky-header-table2 qtablecon"
          :data="data"
          :columns="columns"
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
              <q-th class="bg-primary">Código</q-th>
              <q-th class="bg-primary">Cuenta</q-th>
              <q-th class="bg-primary text-right">
                {{ cambiarmese.mes1 }}
              </q-th>
              <q-th class="bg-primary text-right">
                {{ cambiarmese.mes2 }}
              </q-th>
              <q-th class="bg-primary text-right">Diferencia</q-th>
              <q-th class="bg-primary text-right">% Dif</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :style="colorTable(props.row.color)"
              :class="props.row.tipo == 'General' ? 'text-weight-bold' : ''"
            >
              <q-td key="codigo" :props="props">
                {{ props.row.codigo }}
              </q-td>
              <q-td
                key="nombre"
                :props="props"
                class="white-space"
                style="with: 500px"
              >
                {{ props.row.nombre }}
              </q-td>
              <q-td key="mes1" :props="props">
                {{ formatTable(2, props.row.mes1) }}
              </q-td>
              <q-td key="mes2" :props="props">
                {{ formatTable(2, props.row.mes2) }}
              </q-td>
              <q-td key="diferencia" :props="props">
                {{ formatTable(2, props.row.diferencia) }}
              </q-td>
              <q-td key="porc" :props="props"> {{ props.row.porc }} % </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-form>
    <imprimirconsulta ref="imprimirconsulta" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import imprimirconsulta from "./partial/imprimir";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
  },
  props: {
    // value: {
    //   type: Object,
    // },
  },
  data() {
    return {
      shape: null,
      arraytipo: [1, 2, 4, 6, 8, 10, 12],
      tipo_informe: [
        { id: 1, nombre: "Balance general" },
        { id: 2, nombre: "Estado de resultados" },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      model: {
        tipoinf: 1,
        tipo: 12,
        año1: null,
        mesini1: null,
        año2: null,
        mesini2: null,
        tipoview: 1,
        ver_nits: false,
      },
      mayor: [],
      mayor_banco: [],
      pdfs: { path: null },
      cambiarmese: {
        mes1: "MES 1",
        mes2: null,
      },
      data: [],
      columns: [
        {
          name: "codigo",
          label: "Código",
          align: "left",
          headerClasses: "bg-primary",
          field: "codigo",
        },
        {
          name: "nombre",
          label: "Nombre Cuenta",
          align: "left",
          headerClasses: "bg-primary",
          field: "nombre",
        },
        {
          name: "mes1",
          label: "Mes 1",
          headerClasses: "bg-primary",
          field: "mes1",
        },
        {
          name: "mes2",
          label: "Mes 2",
          headerClasses: "bg-primary",
          field: "mes2",
        },
        {
          name: "diferencia",
          label: "Diferencia",
          headerClasses: "bg-primary",
          field: "diferencia",
        },
        {
          name: "porc",
          label: "% Dif.",
          headerClasses: "bg-primary",
          field: "porc",
        },
      ],
      list_meses: [
        { id: 1, mes: "Enero" },
        { id: 2, mes: "Febrero" },
        { id: 3, mes: "Marzo" },
        { id: 4, mes: "Abril" },
        { id: 5, mes: "Mayo" },
        { id: 6, mes: "Junio" },
        { id: 7, mes: "Julio" },
        { id: 8, mes: "Agosto" },
        { id: 9, mes: "Septiembre" },
        { id: 10, mes: "Octubre" },
        { id: 11, mes: "Noviembre" },
        { id: 12, mes: "Diciembre" },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async exportarexcel() {
      let params = {
        model: this.model,
        data: this.data,
      };
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_informe_comparativo",
        params
      ).then((resp) => {
        fileDownload(resp, "consulta_informe_comparativo.xlsx");
      });
    },
    async consultar() {
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          this.data = await this.Post({
            api: "contabilidad/consultas/consulta_informe_comparativo",
            model: params,
          });
          if (this.data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async fechaActual() {
      var fecha = new Date(Date.now());
      this.model.año1 = fecha.getFullYear();
      this.model.mesini1 = fecha.getMonth() + 1;
      this.model.año2 = fecha.getFullYear();
      this.model.mesini2 = fecha.getMonth() + 1;
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
        case 99:
          return "background-color: rgb(248, 249, 250, 0.5); color: black;";
        default:
          return "background-color: rgb(2520, 250, 210, 0.5); color: white;";
      }
    },
    async imprimirConsulta() {
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_inf_comparativo",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(
            this.pdfs,
            "INFORME COMPARATIVO"
          );
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.tipo = 12;
    },
    cambiarMes1(mes) {
      this.list_meses.forEach((element) => {
        if (element.id == mes) {
          let mes = element.mes.toLowerCase();
          this.cambiarmese.mes1 = `Mes 1: ${
            mes[0].toUpperCase() + mes.slice(1)
          }`;
        }
      });
    },
    cambiarMes2(mes) {
      this.list_meses.forEach((element) => {
        if (element.id == mes) {
          let mes = element.mes.toLowerCase();
          this.cambiarmese.mes2 = `Mes 2: ${
            mes[0].toUpperCase() + mes.slice(1)
          }`;
        }
      });
    },
  },
  watch: {
    "model.mesini1"(val) {
      if (val != null) {
        this.cambiarMes1(val);
        this.consultar();
      } else {
        this.cambiarmese.mes1 = "Mes 1";
      }
    },
    "model.mesini2"(val) {
      if (val != null) {
        this.cambiarMes2(val);
        this.consultar();
      } else {
        this.cambiarmese.mes1 = "Mes 2";
      }
    },
    "model.tipo"() {
      this.consultar();
    },
    model: {
      handler(val) {
        this.data = [];
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fechaActual().then(() => {
          this.consultar();
        });
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
.q-table td.white-space {
  white-space: normal !important;
}
</style>
<style lang="sass">
.my-sticky-header-table2
  /* height or max-height is important */
  min-height: 10vh
  max-height: 70vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

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