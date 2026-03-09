<template>
  <div class="row q-pa-md">
    <div class="col-9">
      <q-form ref="forminforme" class="row">
        <l-input
          col="md-3 text-black"
          v-model="model.fecha_desde"
          label="FECHA DESDE *"
          type="date"
          :rules="[$rules.required($t('validator.required')), fechaDesdeRule]"
        />
        <l-input
          col="md-3 text-black"
          v-model="model.fecha_hasta"
          label="FECHA HASTA *"
          type="date"
          :rules="[$rules.required($t('validator.required'))]"
        />
        <l-select
          col="md-3"
          label="Prefijo"
          v-model="model.prefijo"
          optionValue="id"
          optionLabel="tipo_nombre"
          :options="tipodocumentofuente"
        />
        <l-select
          col="md-3"
          label="Tipo*"
          v-model="model.tipo_fact"
          optionValue="nombre"
          optionLabel="nombre"
          :options="opts_tipo_fact"
          :rules="[$rules.required($t('validator.required'))]"
        />
      </q-form>
    </div>
    <div class="col-3 q-mb-md">
      <div class="flex justify-end">
        <q-chip class="botones_acciones" size="22px">
          <div class="row q-col-gutter-x-sm">
            <div class="col">
              <q-btn
                round
                dense
                unelevated
                color="primary"
                @click="getFacturas"
              >
                <q-icon name="search" />
                <q-tooltip>Consultar</q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="exportarexcel"
                :disable="facturas.length <= 0"
              >
                <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
                <q-tooltip>Exportar Excel</q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="imprimir_informe"
                :disable="facturas.length <= 0"
              >
                <q-icon name="print" style="color: #42a5f5" />
                <q-tooltip>Imprimir</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-chip>
      </div>
    </div>
    <div class="col-12">
      <div class="row">
        <div class="col-12 flex justify-end">
          <div class="row">
            <q-input
              style="width: 300px"
              borderless
              dense
              outlined
              debounce="300"
              v-model="filter"
              placeholder="Búsqueda"
              rounded
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table
        :data="facturas"
        :columns="columns"
        row-key="name"
        flat
        bordered
        :pagination.sync="pagination"
        :filter="filter"
      />
    </div>
    <imprimirDocumento ref="imprirmir_informe_dian" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import fileDownload from "js-file-download";
import imprimirDocumento from "./imprimir.vue";
import moment from "moment";

export default {
  layout: "main",
  name: "informe_dian",
  components: {
    imprimirDocumento,
  },
  computed: {
    ...mapState("contabilidad", ["tipodocumentofuente"]),
    fechaDesdeRule () {
      return val => {
        if (!val || !this.model.fecha_hasta) return true
        return val <= this.model.fecha_hasta
          || 'La fecha desde no puede ser mayor a la fecha hasta'
      }
    },
  },
  data() {
    return {
      filter: null,
      pagination: {
        rowsPerPage: 10,
      },
      model: {
        fecha_desde: moment().format("YYYY-MM-DD"),
        fecha_hasta: moment().format("YYYY-MM-DD"),
        prefijo: null,
        tipo_fact: "todos",
      },
      facturas: [],
      sumas_facturas: [],
      tipo_facturas: [],
      page: 1,
      columns: [
        {
          name: "nro_factura",
          required: true,
          label: "NRO FACT",
          align: "left",
          sortable: true,
          field: "nro_factura",
        },
        {
          name: "fecha_doc",
          label: "FECHA",
          align: "left",
          sortable: true,
          field: "fecha_doc",
        },
        {
          name: "nit",
          label: "NIT",
          align: "left",
          sortable: true,
          field: "nit",
        },
        {
          name: "cliente",
          label: "CLIENTE",
          align: "left",
          sortable: true,
          field: "cliente",
        },
        {
          name: "gravada",
          label: "gravada",
          align: "left",
          sortable: true,
          field: (row) => this.formatMoney(row.gravada),
        },
        {
          name: "vlr_iva",
          label: "vlr iva",
          align: "left",
          sortable: true,
          field: (row) => this.formatMoney(row.vlr_iva),
        },
        {
          name: "total_factura",
          label: "total factura",
          align: "left",
          sortable: true,
          field: (row) => this.formatMoney(row.total_factura),
        },
      ],
      pdfs: { path: null },
      opts_tipo_fact: [
        { "nombre": "todos" }, { "nombre": "propietarios" }, { "nombre": "arrendatarios" }, { "nombre": "otros" },
      ]
    };
  },
  methods: {
    ...mapActions("contabilidad", ["getTipodocumentoFuente"]),
    async getFacturas() {
      const validate = await this.$refs.forminforme.validate();
      if (validate) {
        let parametros = { ...this.model };
        const data = await this.Post(
          "contabilidad/consultas/informe_diario_dian",
          parametros
        );
        if (data.length > 0) {
          this.facturas = data[0].detalles;
          this.tipo_facturas = data[0].tipo_facturas;
          this.sumas_facturas = data[0].total_facturas;
        } else {
          this.facturas = [];
          this.tipo_facturas = [];
          this.sumas_facturas = [];
        }
      }
    },
    async exportarexcel() {
      let data = {
        facturas: this.facturas,
        fecha_desde: this.model.fecha_desde,
        fecha_hasta: this.model.fecha_hasta,
        sumas_facturas: this.sumas_facturas,
        tipo_facturas: this.tipo_facturas,
      };
      await this.PostDownload(
        "contabilidad/consultas/exportarexcel",
        data
      ).then((resp) => {
        fileDownload(resp, `informe_diario_dian_${this.model.fecha_desde}-${this.model.fecha_hasta}.xlsx`);
      });
    },
    async imprimir_informe() {
      let params = {
        facturas: this.facturas,
        fecha_desde: this.model.fecha_desde,
        fecha_hasta: this.model.fecha_hasta,
        sumas_facturas: this.sumas_facturas,
        tipo_facturas: this.tipo_facturas,
      };
      let data = await this.Post(
        "contabilidad/consultas/imprimir_informe_dian",
        params
      );
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprirmir_informe_dian.abrirmodal(this.pdfs);
    },
    formatMoney(val) {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });

      return formatterPeso.format(val);
    },
  },
  mounted() {
    this.getTipodocumentoFuente({ filtros: {'prefijo__isnull': false}, tipo_filtro: 'personalizado' });
    this.getFacturas();
  },
};
</script>
