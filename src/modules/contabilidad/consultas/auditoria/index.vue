<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-lg">
      <l-select
        col="3"
        label="Tipo de auditoria*"
        option-value="id"
        option-label="label"
        v-model="model.tipo"
        :options="tipos_consultas"
        :clearable="false"
      />
      <q-space />
      <l-input
        col="2"
        type="number"
        label="Año *"
        v-model="model.año"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-model="model.mesini"
        label="Mes Inicial *"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-model="model.mesfin"
        label="Mes Final"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <div class="q-ml-sm q-mt-xs">
        <q-btn dense round color="primary" icon="search" @click="consultar" />
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_contabilidad_consultas_auditorias_acciones_imprimir"
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
          <div class="col">
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
              <q-tooltip>Exportar excel</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-chip>
      <div class="col-12 q-mt-md">
        <q-table
          class="my-sticky-header-table3"
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
              <q-th class="text-left">Tipo</q-th>
              <q-th class="text-left">Documento</q-th>
              <q-th class="text-left">Fecha</q-th>
              <q-th class="text-right">Débito</q-th>
              <q-th class="text-right">Crédito</q-th>
              <q-th class="text-right">Diferencia</q-th>
              <q-th class="text-left">Observaciones</q-th>
              <q-th class="text-center">Acciones</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" class="bg-white">
              <q-td
                key="tipo"
                :props="props"
                style="text-align: left !important"
              >
                {{ props.row.tipo }}
              </q-td>
              <q-td
                key="documento"
                :props="props"
                style="text-align: left !important"
              >
                {{ props.row.documento }}
              </q-td>
              <q-td
                key="fecha"
                :props="props"
                style="text-align: left !important"
              >
                {{ props.row.fecha }}
              </q-td>
              <q-td
                key="debito"
                :props="props"
                style="text-align: right !important"
              >
                {{ formatTable(2, props.row.debito) }}
              </q-td>
              <q-td
                key="credito"
                :props="props"
                style="text-align: right !important"
              >
                {{ formatTable(2, props.row.credito) }}
              </q-td>
              <q-td
                key="diferencia"
                :props="props"
                style="text-align: right !important"
              >
                {{ formatTable(2, props.row.diferencia) }}
              </q-td>
              <q-td
                key="observacion"
                :props="props"
                class="white-space"
                style="text-align: left !important"
              >
                <div style="max-width: 100%">
                  {{ props.row.observacion }}
                </div>
              </q-td>
              <q-td
                key="acciones"
                :props="props"
              >
                <div class="text-center q-py-xs">
                  <q-btn dense unelevated icon="mdi-eye" @click="verDocumento(props.row)">
                    <q-tooltip>Ver documento</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-form>
    <imprimirconsulta ref="imprimirconsulta" />
    <verdocumentos ref="verdocumentos" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import imprimirconsulta from "./partial/imprimir";
import fileDownload from "js-file-download";
import verdocumentos from "./procesos/documentos/partial/crear.vue"
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
    verdocumentos
  },
  props: {},
  data() {
    return {
      shape: null,
      pagination: {
        rowsPerPage: 0,
      },
      model: {
        tipo: 1,
        año: null,
        mesini: null,
        mesfin: null,
      },
      pdfs: { path: null },
      data: [],
      columns: [
        {
          name: "tipo",
          label: "TIPO",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "tipo",
        },
        {
          name: "documento",
          label: "DOCUMENTO",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "documento",
        },
        {
          name: "fecha",
          label: "FECHA",
          headerClasses: "bg-primary text-white",
          field: "fecha",
        },
        {
          name: "debito",
          label: "DÉBITO",
          headerClasses: "bg-primary text-white",
          field: "debito",
        },
        {
          name: "credito",
          label: "CRÉDITO",
          headerClasses: "bg-primary text-white",
          field: "credito",
        },
        {
          name: "diferencia",
          label: "DIFERENCIA",
          headerClasses: "bg-primary text-white",
          field: "diferencia",
        },
        {
          name: "observacion",
          label: "OBSERVACIÓN",
          headerClasses: "bg-primary text-white",
          field: "observacion",
        },
        {
          name: "acciones",
          label: "Acciones",
          headerClasses: "bg-primary text-white",
        },
      ],
      tipos_consultas: [
        {
          id: 1,
          label: "Documentos descuadrados",
        },
        {
          id: 4,
          label: "Movimiento con cuentas mayores",
        },
        {
          id: 5,
          label: "Movimientos sin centros de costos",
        },
        {
          id: 6,
          label: "Documentos abiertos",
        },
        {
          id: 7,
          label: "Movimientos sin id de inmueble",
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
    async consultar() {
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          this.data = await this.Post({
            api: "contabilidad/consultas/consulta_aux_auditorias",
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
    fechaActual() {
      var fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = 1;
      this.model.mesfin = fecha.getMonth() + 1;
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
      }
    },
    colorTable(caso) {
      switch (caso) {
        case 1:
          // return "background-color: #A0B8DA; color: #004080; font-weight: bold;";
          return "background-color: #FFDF80; color: #826431; font-weight: bold;";
        case 11:
          // return "color: #004080; font-weight: bold;";
          return "background-color: lightgoldenrodyellow; color: black;";
        case 12:
          // return "color: #004080;";
          return "background-color: lightgoldenrodyellow; color: black; font-weight: bold;";
        case 2:
          // return "background-color: #F3B8BB; color: #800000; font-weight: bold;";
          return "background-color: #FFDF80; color: #826431; font-weight: bold;";
        case 21:
          // return "color: #800000; font-weight: bold;";
          return "background-color: lightgoldenrodyellow; color: black;";
        case 22:
          // return "color: #800000;";
          return "background-color: lightgoldenrodyellow; color: black; font-weight: bold;";
        case 3:
          // return "background-color: #BBCEA4; color: #008000; font-weight: bold;";
          return "background-color: #FFDF80; color: #826431; font-weight: bold;";
        case 31:
          // return "color: #008000; font-weight: bold;";
          return "background-color: lightgoldenrodyellow; color: black;";
        case 32:
          // return "color: #008000;";
          return "background-color: lightgoldenrodyellow; color: black; font-weight: bold;";
        default:
          return "background-color: white; color: white;";
      }
    },
    async imprimirConsulta() {
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let tipo = this.tipos_consultas.filter(
            (f) => f.id == this.model.tipo
          )[0].label;
          params.model.tipo_nombre = tipo;
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_aux_auditorias",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(this.pdfs, tipo);
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async exportarexcel() {
      let params = {
        data: this.data,
        model: this.model,
      };
      let tipo = this.tipos_consultas.filter((f) => f.id == this.model.tipo)[0]
        .label;
      params.model.tipo_nombre = tipo;
      await this.PostDownload(
        "contabilidad/consultas/exportar_aux_auditorias",
        params
      ).then((resp) => {
        fileDownload(resp, "auditoria.xlsx");
      });
    },
    onReset() {
      this.model.tipo = 12;
    },
    verDocumento(doc) {
      this.$refs.verdocumentos.abrirmodal(doc.documento, doc.fuentes_id, doc.id, false)
    }
  },
  watch: {},
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
.q-table td.white-space {
  white-space: normal !important;
}
</style>
<style lang="sass">
.my-sticky-header-table3
  /* height or max-height is important */
  max-height: 500px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

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