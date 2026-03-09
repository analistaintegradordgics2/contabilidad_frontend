<template>
  <div class="q-pa-lg">
    <showbancos ref="showbancos" @recargar="recargar" />
    <imprimirtipodocumento ref="imprimirtipodocumento" />
    <l-bitacoras ref="bitacoras" />
    <div class="col-12">
      <div class="row">
        <l-input col="3" v-model="filter" label="Buscar" icon="search" />
        <q-space />
        <q-chip class="botones_acciones q-ma-none" size="22px">
          <div class="row q-col-gutter-x-md">
            <can
              class="col"
              permiso="view_menu_gestion_contable_directorio_contable_bancarias_acciones_crear_cuentas_bancarias"
            >
              <q-btn
                round
                dense
                unelevated
                color="primary"
                icon="add"
                @click="crearCuentaBancaria()"
              >
                <q-tooltip>Nuevo</q-tooltip>
              </q-btn>
            </can>
            <can
              class="col"
              permiso="view_menu_gestion_contable_directorio_contable_bancarias_acciones_imprimir_cuentas_bancarias"
            >
              <q-btn
                class="btnAcciones"
                round
                dense
                unelevated
                color="white"
                @click="imprimir_cuentas_bancarias"
              >
                <q-icon name="print" style="color: #42a5f5" />
                <q-tooltip>Imprimir</q-tooltip>
              </q-btn>
            </can>
          </div>
        </q-chip>
      </div>
    </div>
    <q-table
      class="q-mt-md"
      :data="bancos"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="name"
      flat
      bordered
      :filter="filter"
    >
      <template v-slot:body="props">
        <q-tr>
          <q-td auto-width>{{ props.row.nombre }}</q-td>
          <q-td auto-width>{{ props.row.nrocuenta }}</q-td>
          <q-td auto-width>{{ props.row.banco_nombre }}</q-td>
          <q-td auto-width>{{ props.row.cuenta_nombre }}</q-td>
          <q-td auto-width>{{ props.row.tipo_cuenta }}</q-td>
          <q-td auto-width>{{ props.row.activo ? "Activo" : "Inactivo" }}</q-td>
          <q-td auto-width class="text-center">
            <can
              permiso="view_menu_gestion_contable_directorio_contable_bancarias_acciones_editar_cuentas_bancarias"
            >
              <q-btn
                dense
                unelevated
                icon="edit"
                @click="editarCuentaBancaria(props.row)"
              >
                <q-tooltip>Editar tipo de documento</q-tooltip>
              </q-btn>
            </can>
            <can
              permiso="view_menu_gestion_contable_directorio_contable_bancarias_acciones_bitacora"
            >
              <q-btn
                class="q-ml-sm"
                dense
                unelevated
                icon="mdi-message-bulleted"
                @click="bitacora(props.row.history)"
              >
                <q-tooltip>Bitácora</q-tooltip>
              </q-btn>
            </can>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data>
        <div class="full-width flex justify-center items-center">
          <q-icon size="24px" name="mdi-alert" color="black" />
          <span class="q-ml-xs">Sin Datos Disponibles</span>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showbancos from "./partial/form/show";
import imprimirtipodocumento from "./partial/form/imprimir";
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
      filter: null,
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "nombre",
          label: "Nombre de Cuenta",
          align: "left",
          field: "nombre",
        },
        {
          name: "nrocuenta",
          label: "Nùmero de Cuenta",
          align: "left",
          field: "nrocuenta",
        },
        {
          name: "banco_nombre",
          label: "Banco",
          align: "left",
          field: "banco_nombre",
        },
        {
          name: "cuenta_nombre",
          label: "Cuenta",
          align: "left",
          field: "cuenta_nombre",
        },
        {
          name: "tipo_cuenta",
          label: "Tipo de Cuenta",
          align: "left",
          field: "tipo_cuenta",
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
          field: (row) => (row.activo ? "Activo" : "Inactivo"),
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
    async bitacora(history) {
      this.$refs.bitacoras.abrirmodal(history);
    },
    async getCuentasBancarias() {
      try {
        await this.Get("contabilidad/ctabanco/all").then((resp) => {
          this.bancos = resp;
        });
      } catch ({ message }) {
        console.error(message);
      }
    },
    async editarCuentaBancaria(model) {
      this.$refs.showbancos.abrirmodal({ ...model });
    },
    crearCuentaBancaria() {
      this.$refs.showbancos.abrirmodal();
    },
    async imprimir_cuentas_bancarias() {
      let data = await this.Get("contabilidad/ctabanco/imprimir");
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimirtipodocumento.abrirmodal(this.pdfs);
    },
    recargar() {
      this.getCuentasBancarias();
    },
  },
  created() {
    this.getCuentasBancarias();
  },
  mounted() {},
};
</script>
<style scoped>
</style>
