<template>
  <div class="q-ml-md q-mr-md">
    <q-card flat>
      <q-card-section>
        <div class="row">
          <div class="col-4 items-center justify-end" style="padding-top: 15px">
            <q-input
              dense
              outlined
              rounded
              v-model="filter"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="flex items-center q-mt-md">
            <q-radio v-model="estado" val="Activo" label="Activo" />
            <q-radio v-model="estado" val="Inactivo" label="Inactivo" />
          </div>
          <q-space />
          <div class="col-4 flex items-center justify-end">
            <div class="q-pa-sm divopciones">
              <can
                permiso="view_menu_gestion_contable_directorio_contable_centro_costos_acciones_crear_centro_costos"
              >
                <q-btn
                  round
                  dense
                  style="background: #42a5f5 !important"
                  @click="nuevocentrocosto()"
                >
                  <q-icon name="add" color="white" />
                  <q-tooltip> Nuevo </q-tooltip>
                </q-btn>
              </can>
              <can
                permiso="view_menu_gestion_contable_directorio_contable_centro_costos_acciones_imprimir_centro_costos"
              >
                <q-btn
                  round
                  dense
                  color="white"
                  @click="imprimir_centro_costo"
                  class="q-ml-sm"
                >
                  <q-icon name="print" style="color: #42a5f5 !important" />
                  <q-tooltip> Imprimir </q-tooltip>
                </q-btn>
              </can>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div class="q-pa-sm">
          <q-table
            :data="centrocostos"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="name"
            flat
            bordered
            :filter="filter"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td auto-width>{{ props.row.codigo }}</q-td>
                <q-td auto-width>{{ props.row.nombre }}</q-td>
                <q-td auto-width :class="props.row.estado.toLowerCase() == 'activo' ? 'text-green' : 'text-red'">{{ props.row.estado }}</q-td>
                <q-td auto-width class="text-center">
                  <can
                    permiso="view_menu_gestion_contable_directorio_contable_centro_costos_acciones_editar_centro_costos"
                  >
                    <q-btn
                      class="q-mr-sm"
                      dense
                      unelevated
                      icon="edit"
                      @click="editarCuenta(props.rowIndex)"
                    >
                      <q-tooltip>Editar centro de costo</q-tooltip>
                    </q-btn>
                  </can>
                  <can
                    permiso="view_menu_gestion_contable_directorio_contable_centro_costos_acciones_bitacora"
                  >
                    <q-btn
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
                <q-icon size="24px" name="mdi-alert" color="red" /><span
                  class="q-ml-xs"
                >
                  Sin Datos Disponibles
                </span>
              </div>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
    <showcentroscostos ref="showcentroscostos" @recargar="recargar" />
    <crearcentrocosto ref="crearcentrocosto" @recargar="recargar" />
    <imprimircentroscostos ref="imprimircentroscostos" />
    <l-bitacoras ref="bitacoras" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import showcentroscostos from "./partial/form/show";
import crearcentrocosto from "./partial/crear";
import imprimircentroscostos from "./partial/form/imprimir";
export default {
  layout: "main",
  name: "index",
  components: {
    showcentroscostos,
    imprimircentroscostos,
    crearcentrocosto,
  },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      centrocostos: [],
      tempcentrocostos: [],
      estado: "Activo",
      filter: null,
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "codigo",
          required: true,
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
    async bitacora(history) {
      this.$refs.bitacoras.abrirmodal(history);
    },
    nuevocentrocosto() {
      setTimeout(() => {
        this.$refs.crearcentrocosto.abrirmodal();
      }, 500);
    },
    async GetCentrosCostos() {
      try {
        const data = await this.Get("contabilidad/centrocostos/all", {
          tipo: "C",
        });
        this.tempcentrocostos = data;
        this.centrocostos = data.filter((f) => f.estado == this.estado);
      } catch ({ message }) {
        console.error(message);
      }
    },
    async editarCuenta(index) {
      await this.Get(
        "contabilidad/centrocostos/" + this.centrocostos[index].id
      ).then((resp) => {
        this.$refs.showcentroscostos.abrirmodal(resp);
      });
    },
    async imprimir_centro_costo() {
      let data = await this.Get(
        "contabilidad/centrocostos/imprimir_centros_costos",
        { tipo: "C", estado: this.estado}
      );
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      this.pdfs.path = url;
      this.$refs.imprimircentroscostos.abrirmodal(this.pdfs);
    },
    recargar() {
      this.GetCentrosCostos();
    },
  },
  watch: {
    estado(val) {
      this.centrocostos = [...this.tempcentrocostos];
      this.centrocostos = this.centrocostos.filter((f) => f.estado == val);
    },
  },
  created() {
    this.GetCentrosCostos();
  },
  mounted() {},
};
</script>
<style scoped>
</style>
