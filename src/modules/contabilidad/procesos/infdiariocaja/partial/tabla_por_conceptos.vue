<template>
  <q-table
    style="padding: 0"
    flat
    dense
    class="my-sticky-header-table_caja q-pa-xl"
    row-key="name"
    :data="value"
    :columns="columns"
    :pagination.sync="pagination"
    :filter="filter"
  >
    <template v-slot:body="props">
      <q-tr :props="props" :style="colorTable(props.row.color)">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>
    <template v-slot:no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon size="2em" name="warning" color="red" />
        <label>Sin datos disponibles</label>
      </div>
    </template>
  </q-table>
</template>

<script>
export default {
  name: "concepto",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: null,
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "descripcion",
          field: "descripcion",
          label: "Descripción",
          align: "left",
        },
        {
          name: "efectivo",
          field: "efectivo",
          label: "Efectivo",
          align: "right",
          format: (val, row) => this.formatMoney(val, row),
        },
        // {
        //   name: "cheques",
        //   field: "cheques",
        //   label: "Cheques",
        //   align: "right",
        //   format: (val) => this.formatMoney(val, row),
        // },
        {
          name: "consignacion",
          field: "consignacion",
          label: "Consignación",
          align: "right",
          format: (val, row) => this.formatMoney(val, row),
        },
        {
          name: "tarjetas",
          field: "tarjeta",
          label: "Tarjetas",
          align: "right",
          format: (val, row) => this.formatMoney(val, row),
        },
        {
          name: "total",
          field: "total",
          label: "Total",
          align: "right",
          format: (val, row) => this.formatMoney(val, row),
        },
      ],
    };
  },
  methods: {
    formatMoney(val, row) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      if (row.descripcion != "") {
        return formatterPeso.format(val);
      } else {
        return null;
      }
    },
    colorTable(caso) {
      switch (caso) {
         case 1:
          return "background: #29C16017 padding-box;opacity: 1; color: #008000";
        case 2:
          return "background-color: #6BB7E017;opacity: 1; color: #826431";
        case 3:
          return "background-color:#F5B21D17; opacity: 1;color: darkslateblue";
        case 22:
          return "background-color: lightgoldenrodyellow; color: black;";
        default:
          return "background-color: white; color: white;";
      }
    },
  },
};
</script>

<style lang="sass">
.my-sticky-header-table_caja
  max-height: 650px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: white

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    &.q-table--loading thead tr:last-child th
      top: 48px
</style>