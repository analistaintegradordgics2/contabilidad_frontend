<template>
  <div class="q-pa-lg">
    <div class="row">
      <l-input
        col="3 text-black"
        v-model="filter"
        label="Buscar"
        icon="search"
      />
      <div class="q-gutter-md">
        <q-radio v-model="estado" val="Activo" label="Activo" />
        <q-radio v-model="estado" val="Inactivo" label="Inactivo" />
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            permiso="view_menu_gestion_contable_directorio_contable_tipo_documentos_acciones_crear_tipo_documento"
          >
            <q-btn
              round
              dense
              unelevated
              style="background: #42a5f5 !important"
              @click="nuevotipodoc()"
            >
              <q-icon name="add" color="white" />
              <q-tooltip>Nuevo</q-tooltip>
            </q-btn>
          </can>
          <can
            permiso="view_menu_gestion_contable_directorio_contable_tipo_documentos_acciones_imprimir_tipo_documento"
          >
            <q-btn
              class="btnAcciones"
              unelevated
              round
              dense
              color="white"
              @click="imprimir_tipodocumento"
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
        </div>
      </q-chip>
    </div>
    <div class="q-mt-md">
      <q-table
        :data="tiposdocumentos"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="name"
        flat
        bordered
        :filter="filter"
      >
        <template v-slot:body="props">
          <q-tr>
            <q-td auto-width>{{ props.row.tipo }}</q-td>
            <q-td auto-width>{{ props.row.nombre }}</q-td>
            <q-td auto-width>{{ props.row.numero }}</q-td>
            <q-td auto-width>{{ props.row.prefijo }}</q-td>
            <q-td auto-width>{{ props.row.forma_pago_nombre }}</q-td>
            <q-td auto-width>{{ props.row.fuente_nombre }}</q-td>
            <q-td auto-width class="text-center">{{ props.row.dias_vencimiento !== 0 ? props.row.dias_vencimiento : '' }}</q-td>
            <q-td
              auto-width
              class="text-left"
              :style="
                props.row.estado == 'Activo'
                  ? 'color:#29C160 !important;'
                  : 'color:#E24242 !important;'
              "
              >{{ props.row.estado }}</q-td
            >
            <q-td auto-width class="text-center">
              <can
                permiso="view_menu_gestion_contable_directorio_contable_tipo_documentos_acciones_editar_tipo_documento"
              >
                <q-btn
                  class="q-mr-sm"
                  dense
                  unelevated
                  icon="edit"
                  @click="editarCuenta(props.row)"
                >
                  <q-tooltip>Editar tipo de documento</q-tooltip>
                </q-btn>
              </can>
              <can
                permiso="view_menu_gestion_contable_directorio_contable_tipo_documentos_acciones_bitacora"
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
          </q-tr>
        </template>
        <template v-slot:no-data>
          <div class="full-width flex justify-center items-center">
            <q-icon size="24px" name="mdi-alert" color="red" />
            <span class="q-ml-xs">Sin Datos Disponibles</span>
          </div>
        </template>
      </q-table>
    </div>
    <crear ref="creartipodoc" @recargar="recargar" />
    <showtipodocumento ref="showtipodocumento" @recargar="recargar" />
    <imprimirtipodocumento ref="imprimirtipodocumento" />
    <l-bitacoras ref="bitacoras" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showtipodocumento from "./partial/form/show";
import crear from "./partial/crear";
import imprimirtipodocumento from "./partial/form/imprimir";
import moment from "moment";
export default {
  layout: "main",
  name: "index",
  components: {
    showtipodocumento,
    imprimirtipodocumento,
    crear,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      tiposdocumentos: [],
      temptiposdocumentos: [],
      filter: null,
      pagination: {
        rowsPerPage: 10,
      },
      estado: "Activo",
      columns: [
        {
          name: "tipo",
          required: true,
          label: "Código",
          field: "tipo",
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
          name: "numero",
          label: "Número",
          align: "left",
          field: "numero",
          sortable: true,
        },
        {
          name: "prefijo",
          label: "Prefijo",
          align: "left",
          field: "prefijo",
          sortable: true,
        },
        {
          name: "forma_pago",
          label: "Forma de Pago",
          align: "left",
          field: "forma_pago_nombre",
          sortable: true,
        },
        {
          name: "fuente_nombre",
          label: "Fuente",
          align: "left",
          field: "fuente_nombre",
          sortable: true,
        },
        {
          name: "dias_vencimiento",
          label: "Dias de vencimiento",
          align: "center",
          field: "dias_vencimiento",
          sortable: true,
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
          field: "estado",
          sortable: true,
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
    // ...mapActions("http", ["Get", "Post"]),
    async bitacora(idtipodoc) {
      const data = await this.Get(
        "contabilidad/tiposdocumentos/history/" + idtipodoc
      );
      this.$refs.bitacoras.abrirmodal(data.history);
    },
    nuevotipodoc() {
      setTimeout(() => {
        this.$refs.creartipodoc.abrirmodal();
      }, 500);
    },
    async GetTiposdocumentos() {
      try {
        await this.Get("contabilidad/tiposdocumentos").then((resp) => {
          this.temptiposdocumentos = resp;
          this.tiposdocumentos = resp.filter((f) => f.estado == this.estado);
        });
      } catch ({ message }) {
        console.error(message);
      }
    },
    async editarCuenta(model) {
      await this.Get(
        "contabilidad/tiposdocumentos/" + model.id
      ).then((resp) => {
        if (resp.fecha_ini_resolucion != null) {
          resp.fecha_ini_resolucion = moment(resp.fecha_ini_resolucion).format(
            "DD/MM/YYYY"
          );
        }
        if (resp.fecha_fin_resolucion != null) {
          resp.fecha_fin_resolucion = moment(resp.fecha_fin_resolucion).format(
            "DD/MM/YYYY"
          );
        }
        this.$refs.showtipodocumento.abrirmodal(resp);
      });
    },
    async imprimir_tipodocumento() {
      let data = await this.Get(
        "contabilidad/tiposdocumentos/imprimir_tipodocumento",
        { estado: this.estado }
      );
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimirtipodocumento.abrirmodal(this.pdfs);
    },
    recargar() {
      this.GetTiposdocumentos();
    },
  },
  watch: {
    estado(val) {
      this.tiposdocumentos = [...this.temptiposdocumentos];
      this.tiposdocumentos = this.tiposdocumentos.filter(
        (f) => f.estado == val
      );
    },
  },
  created() {
    this.GetTiposdocumentos();
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
