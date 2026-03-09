<template>
  <div class="row q-pa-lg">
    <showpuc ref="showpuc" @recargar="recargar" />
    <imprimirpuc ref="imprimirpuc" />
    <crearcuenta ref="crearcuenta" @recargar="recargar" />
    <l-bitacoras ref="bitacoras" />
    <div class="col-12">
      <div class="row">
        <l-input col="3" v-model="filter" label="Buscar" icon="search" />
        <div class="col-4">
          <q-radio v-model="tipocuenta" :val="1" label="Activa" />
          <q-radio v-model="tipocuenta" :val="2" label="Inactiva" />
        </div>
        <q-space />
        <q-chip class="botones_acciones q-ma-none" size="22px">
          <div class="row q-col-gutter-x-md">
            <can class="col" permiso="view_menu_gestion_contable_directorio_contable_plan_unico_de_cuentas_acciones_crear_cuenta">
              <q-btn
                round
                dense
                unelevated
                color="primary"
                icon="add"
                @click="nuevacuenta()"
              >
                <q-tooltip>Nuevo</q-tooltip>
              </q-btn>
            </can>
            <can class="col" permiso="view_menu_gestion_contable_directorio_contable_plan_unico_de_cuentas_acciones_imprimir_puc">
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="imprimir_puc"
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
                @click="exportarexcel()"
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
        flat
        bordered
        :rows-per-page-options="[0]"
        :data="cuentas"
        :columns="columnas"
        :filter="filter"
        :pagination.sync="pagination"
        row-key="name"
      >
        <template v-slot:body-cell="props">
          <q-td
            :props="props"
            :class="props.row.tipo == 'General' ? 'text-weight-bold' : ''"
          >
            <div v-if="props.col.name != 'tipo'">{{ props.value }}</div>
            <div v-if="props.col.name == 'tipo'">
              <span
                :class="
                  props.row.tipo == 'General'
                    ? 'classtipocuenta'
                    : 'class_cuentaaux'
                "
                >{{ props.value }}</span
              >
            </div>
            <div v-if="props.col.name == 'acciones'">
              <can
                permiso="view_menu_gestion_contable_directorio_contable_plan_unico_de_cuentas_acciones_editar_cuenta"
              >
                <q-btn
                  class="q-mr-sm"
                  dense
                  unelevated
                  icon="edit"
                  @click="editarCuenta(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
              </can>
              <can
                permiso="view_menu_gestion_contable_directorio_contable_plan_unico_de_cuentas_acciones_bitacora"
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
            </div>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <div>
              <label class="text-black">
                <q-icon name="warning" color="red" size="20px" />
                Sin datos disponibles
              </label>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showpuc from "./partial/form/show";
import imprimirpuc from "./partial/form/imprimir";
import crearcuenta from "./partial/crear";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    showpuc,
    imprimirpuc,
    crearcuenta,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      spinners: true,
      tipocuenta: 1,
      mayor: [],
      cuentas: [],
      temp_cuentas: [],
      filter: null,
      pdfs: { path: null },
      pagination: {
        rowsPerPage: 10,
      },
      columnas: [
        {
          name: "codigo",
          label: "Código",
          align: "left",
          field: "codigol",
          sortable: true,
        },
        {
          name: "nombre",
          label: "Nombre",
          align: "left",
          field: "nombrel",
          sortable: true,
          format: (val) => val,
        },
        {
          name: "tipo",
          label: "Tipo",
          align: "left",
          field: "tipo",
          sortable: true,
        },
        {
          name: "naturaleza",
          label: "Naturaleza",
          align: "left",
          field: "naturaleza",
          sortable: true,
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
          field: "estado",
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center",
        },
      ],
    };
  },
  computed: {
    ...mapState("inmueble", ["inmueble_store"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    nuevacuenta() {
      this.$refs.crearcuenta.abrirmodal();
    },
    async exportarexcel() {
      let namefile =
        this.tipocuenta == 1 ? "puc_activas.xlsx" : "puc_inactivas.xlsx";
      await this.PostDownload("contabilidad/mayor/exportarexcel", {
        tipo: this.tipocuenta == 1 ? "activas" : "inactivas",
      }).then((resp) => {
        fileDownload(resp, namefile);
      });
    },
    async bitacora(id) {
      this.Get({
        api: "contabilidad/mayor/history/" + id,
      }).then((resp) => {
        this.$refs.bitacoras.abrirmodal(resp.history);
      });
    },
    async editarCuenta(model) {
      await this.Get({ api: "contabilidad/mayor/" + model.id }).then((resp) => {
        this.$refs.showpuc.abrirmodal(resp);
      });
    },
    async getMayor() {
      try {
        this.Get({ api: "contabilidad/mayor/arbolpuc" }).then((resp) => {
          this.temp_cuentas = resp;
          if (this.tipocuenta == 1) {
            this.cuentas = resp.activas;
          } else {
            this.cuentas = resp.inactivas;
          }
        });
      } catch ({ message }) {
        console.error(message);
      }
    },
    async imprimir_puc() {
      let data = await this.Get({
        api: "contabilidad/mayor/imprimir_puc",
        params: { tipo: this.tipocuenta == 1 ? "activas" : "inactivas" },
      });
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimirpuc.abrirmodal(this.pdfs);
    },
    recargar() {
      this.getMayor();
    },
  },
  watch: {
    tipocuenta(val) {
      if (val == 1) {
        this.cuentas = [...this.temp_cuentas.activas];
      } else {
        this.cuentas = [...this.temp_cuentas.inactivas];
      }
    },
  },
  created() {
    this.getMayor();
  },
  mounted() {},
};
</script>
<style lang="scss">
div.q-tree__node.relative-position.q-tree__node--child:hover {
  background-color: #f0f0f0 !important;
}

.classtipocuenta {
  background: #42a5f529 0% 0% no-repeat padding-box;
  opacity: 1;
  width: 100px;
  height: 25px;
  text-align: center;
  letter-spacing: 0px;
  border-radius: 16px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
  color: #42a5f5;
}
.class_cuentaaux {
  background: #f1f1f1 0% 0% no-repeat padding-box;
  opacity: 1;
  width: 100px;
  height: 25px;
  text-align: center;
  letter-spacing: 0px;
  border-radius: 16px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
  color: #484848;
}
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
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  min-height: 600px

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