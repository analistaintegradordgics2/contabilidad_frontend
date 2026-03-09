<template>
  <div class="row q-pa-lg">
    <showconcepto ref="showconcepto" @recargar="recargar" />
    <crear ref="crearconcepto" @recargar="recargar" />
    <imprimirconcepto ref="imprimirconcepto" />
    <l-bitacoras ref="bitacoras" />
    <div class="col-12">
      <div class="row">
        <l-input col="3" v-model="filter" label="Buscar" icon="search" />
        <q-space />
        <q-chip class="botones_acciones q-ma-none" size="22px">
          <div class="row q-col-gutter-x-md">
            <can
              class="col"
              permiso="view_menu_gestion_contable_directorio_contable_conceptos_acciones_crear_concepto"
            >
              <q-btn
                round
                dense
                unelevated
                color="primary"
                icon="add"
                @click="nuevoconcepto()"
              >
                <q-tooltip>Nuevo</q-tooltip>
              </q-btn>
            </can>
            <can
              class="col"
              permiso="view_menu_gestion_contable_directorio_contable_conceptos_acciones_imprimir_concepto"
            >
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="imprimir_concepto"
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
                @click="exportar_concepto()"
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
        :data="concepto"
        :columns="columns"
        row-key="name"
        flat
        bordered
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:body-cell-accion="props">
          <q-td :props="props">
            <can
              permiso="view_menu_gestion_contable_directorio_contable_conceptos_acciones_editar_concepto"
            >
              <q-btn
                class="q-mr-sm"
                dense
                unelevated
                icon="edit"
                @click="editarCuenta(props.row.id)"
              >
                <q-tooltip>Editar concepto</q-tooltip>
              </q-btn>
            </can>
            <can
              permiso="view_menu_gestion_contable_directorio_contable_conceptos_acciones_bitacora"
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
      </q-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showconcepto from "./partial/form/show";
import crear from "./partial/crear";
import imprimirconcepto from "./partial/form/imprimir";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    showconcepto,
    imprimirconcepto,
    crear,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      filter: null,
      concepto: [],
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
          format: (val) => val,
        },
        {
          name: "retencion",
          label: "Retención",
          align: "left",
          field: (row) => (row.retencion == true ? "Sí" : null),
          sortable: true,
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "left",
          sortable: true,
          field: (row) => (!row.detalle ? '' : row.detalle),
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
    ...mapActions("http", ["Get", "Post"]),
    nuevoconcepto() {
      setTimeout(() => {
        this.$refs.crearconcepto.abrirmodal();
      }, 500);
    },
    async bitacora(id) {
      var idconcepto = id;
      const data = await this.Get({
        api: "contabilidad/concepto/history/" + idconcepto,
      });
      this.$refs.bitacoras.abrirmodal(data.history);
    },
    async getConcepto() {
      try {
        const data = await this.Get({ api: "contabilidad/concepto" });
        this.concepto = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async editarCuenta(id) {
      await this.Get({
        api: "contabilidad/concepto/" + id,
      }).then((resp) => {
        this.$refs.showconcepto.abrirmodal(resp);
      });
    },
    async imprimir_concepto() {
      let data = await this.Get({
        api: "contabilidad/concepto/imprimir_concepto",
      });
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimirconcepto.abrirmodal(this.pdfs);
    },
    async exportar_concepto() {
      await this.PostDownload("contabilidad/concepto/exportar_concepto").then(
        (resp) => {
          fileDownload(resp, "conceptos.xlsx");
        }
      );
    },
    recargar() {
      this.getConcepto();
    },
  },
  created() {
    this.getConcepto();
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
