<template>
  <div class="row q-pa-lg">
    <showbancos ref="showbancos" @recargar="recargar" />
    <imprimirtipodocumento ref="imprimirtipodocumento" />
    <l-bitacoras ref="bitacoras" />
    <div class="col-12">
      <div class="row">
        <l-input col="3" v-model="filter" label="Buscar" icon="search" />
        <div class="q-gutter-sm">
          <q-radio v-model="estado" :val="true" label="Activo" />
          <q-radio v-model="estado" :val="false" label="Inactivo" />
        </div>
        <q-space />
        <q-chip class="botones_acciones q-ma-none" size="22px">
          <div class="row q-col-gutter-x-md">
            <can class="col" permiso="view_menu_gestion_contable_directorio_contable_bancos_acciones_crear_bancos">
              <q-btn
                round
                dense
                unelevated
                color="primary"
                icon="add"
                @click="acciones(null)"
              >
                <q-tooltip>Nuevo</q-tooltip>
              </q-btn>
            </can>
            <can class="col" permiso="view_menu_gestion_contable_directorio_contable_bancos_acciones_imprimir_bancos">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="imprimir_bancos"
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
                @click="exportar_banco"
              >
                <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
                <q-tooltip>Exportar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-chip>
      </div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table
        :data="bancos"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="name"
        flat
        bordered
        :filter="filter"
      >
        <template v-slot:body-cell-accion="props">
          <q-td :props="props">
            <can
              permiso="view_menu_gestion_contable_directorio_contable_bancos_acciones_editar_bancos"
              class="q-mr-sm"
            >
              <q-btn dense unelevated icon="edit" @click="acciones(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </can>
            <can
              permiso="view_menu_gestion_contable_directorio_contable_bancos_acciones_bitacora"
            >
              <q-btn
                dense
                unelevated
                icon="mdi-message-bulleted"
                @click="bitacora(props.row.id)"
              >
                <q-tooltip>Bitácora</q-tooltip>
              </q-btn>
            </can>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width flex justify-center items-center">
            <q-icon size="24px" name="mdi-alert" color="red" /><span
              class="q-ml-xs"
            >
              Sin datos disponibles
            </span>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showbancos from "./partial/form/show";
import imprimirtipodocumento from "./partial/form/imprimir";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    showbancos,
    imprimirtipodocumento,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      bancos: [],
      history_bancos:[],
      temp_bancos: [],
      filter: null,
      estado: true,
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "codigo",
          label: "Código",
          field: "codigo",
          align: "left",
          sortable: true,
        },
        {
          name: "nombre",
          label: "Nombre",
          align: "left",
          field: "nombre",
          sortable: true,
        },
        {
          name: "codigo_ach",
          label: "Código ACH",
          align: "left",
          field: "codigo_ach",
          sortable: true,
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
          sortable: true,
          field: (row) => (row.estado == true ? "Activo" : "Inactivo"),
        },
        {
          name: "accion",
          label: "Acciones",
          align: "center",
          field: "accion",
        },
      ],
      pdfs: { path: null },
    };
  },
  computed: {
    ...mapState("inmueble", ["inmueble_store"]),
  },
  methods: {
    async exportar_banco() {
      await this.PostDownload("parametrizacion/bancos/exportar_bancos", {
        tab: this.estado ? "activos" : "inactivos",
      }).then((resp) => {
        fileDownload(
          resp,
          `bancos_${this.estado ? "activos" : "inactivos"}.xlsx`
        );
      });
    },
    async bitacora(idbanco) {
      const data = await this.Get(
        "parametrizacion/bancos/history/" + idbanco,
      );
      this.$refs.bitacoras.abrirmodal(data.history);
    },
    async GetBancos() {
      await this.Get("parametrizacion/bancos/listar").then((resp) => {
        this.temp_bancos = resp;
        this.bancos = resp.filter((f) => f.estado == this.estado);
      });
    },
    async acciones(model = null) {
      this.$refs.showbancos.abrirmodal(model);
    },
    async imprimir_bancos() {
      let data = await this.Get("parametrizacion/bancos/imprimir", {
        estado: this.estado ? "activos" : "inactivos",
      });
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimirtipodocumento.abrirmodal(this.pdfs);
    },
    recargar() {
      this.GetBancos();
    },
  },
  watch: {
    estado(val) {
      this.bancos = this.temp_bancos;
      this.bancos = this.bancos.filter((f) => f.estado == val);
    },
  },
  created() {
    this.GetBancos();
  },
  mounted() {},
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
