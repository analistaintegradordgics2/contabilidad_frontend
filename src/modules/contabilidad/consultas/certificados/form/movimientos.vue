<template>
  <div>
    <div class="row">
      <div class="flex items-center">
        <label class="text-weight-bold">{{ persona }}</label>
      </div>
      <q-space />
      <l-select
        col="3 text-black q-mt-md"
        v-model="select_conc"
        :options="conceptos_conta"
        value="id"
        option-label="codigo_nombre"
        label="Filtrar por concepto"
        @selected="selectConcepto"
      />
      <l-input 
        col="3 q-mt-md"
        v-model="filter"
        placeholder="Búsqueda"
      />
    </div>
    <q-table
      class="table_movi"
      flat
      bordered
      dense
      :data="value"
      :columns="colmovi"
      :hide-bottom="true"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination_mov"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props">
          <q-btn
            dense
            unelevated
            size="md"
            @click="editarConcepto(props.row)"
          >
            <q-tooltip>Editar Concepto</q-tooltip>
            <q-icon name="edit" />
          </q-btn>
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-tr>
          <q-td class="text-right text-weight-bold" colspan="5">TOTALES:</q-td>
          <q-td class="text-right text-weight-bold">{{ formatMoney(totales.total_debito) }}</q-td>
          <q-td class="text-right text-weight-bold">{{ formatMoney(totales.total_credito) }}</q-td>
          <q-td class="text-right text-weight-bold">{{ formatMoney(totales.total_base) }}</q-td>
          <q-td></q-td>
        </q-tr>
      </template>
    </q-table>
    <editarconcepto ref="editarconcepto" :tipo_consulta="tipo_consulta" @actualizar="$emit('actualizar')" />
  </div>
</template>

<script>
import moment from "moment";
import editarconcepto from "./editarconcepto.vue";
import { mapState } from "vuex";
export default {
  name: "movimientos",
  components: {
    editarconcepto,
  },
  props: {
    value: {
      type: Array,
      default: [],
    },
    persona: {
      type: String,
      default: "",
    },
    tipo_consulta: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      select_conc: null,
      filter: null,
      pagination_mov: {
        rowsPerPage: 0,
      },
      index: null,
      colmovi: [
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha",
          format: (val) => this.formatFecha(val),
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "documento",
          label: "Documento",
          align: "left",
          field: "documento",
          headerStyle: "height: 40px",
        },
        {
          name: "inmueble",
          label: "ID Inmueble",
          align: "left",
          field: "inmueble",
          headerStyle: "height: 40px",
        },
        {
          name: "concepto",
          label: "Concepto",
          align: "left",
          field: "concepto",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "left",
          field: "detalle",
          headerStyle: "height: 40px",
        },
        {
          name: "debito",
          label: "Valor débito",
          align: "left",
          field: "debito",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
          classes: 'text-right',
        },
        {
          name: "credito",
          label: "Valor crédito",
          align: "left",
          field: "credito",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
          classes: 'text-right',
        },
        {
          name: "base",
          label: "Valor base",
          align: "left",
          field: "base",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
          classes: 'text-right',
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center",
          headerStyle: "height: 40px",
        },
      ],
    };
  },
  computed: {
    ...mapState("contabilidad", ["conceptos_conta"]),
    totales() {
      let total_debito = 0;
      let total_credito = 0;
      let total_base = 0;
      for (let i = 0; i < this.value.length; i++) {
        total_debito += this.value[i].debito;
        total_credito += this.value[i].credito;
        total_base += this.value[i].base;
      }

      return {
        total_debito,
        total_credito,
        total_base
      }
    }
  },
  methods: {
    editarConcepto(model, index) {
      this.index = index;
      this.$refs.editarconcepto.abrirModal(model);
    },
    formatFecha(fecha) {
      if (fecha != null) {
        return moment(fecha).format("DD/MM/YYYY");
      } else {
        return null;
      }
    },
    formatMoney(val) {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      return formatterPeso.format(val);
    },
    selectConcepto(model) {
      this.$emit("filtro-concepto", model);
    }
  },
};
</script>

<style lang="sass">
.table_movi
  /* height or max-height is important */
  max-height: 480px

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

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>