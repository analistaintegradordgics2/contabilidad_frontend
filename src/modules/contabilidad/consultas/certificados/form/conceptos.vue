<template>
  <div>
    <label class="text-weight-bold">{{ persona }}</label>
    <q-table
      class="q-mt-md"
      flat
      bordered
      dense
      :data="value"
      :columns="colconcepto"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
    persona: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      colconcepto: [
        {
          name: "codigo",
          label: "Código",
          align: "left",
          field: "codigo",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "nombre",
          label: "Concepto",
          align: "left",
          field: "nombre",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "debito",
          label: "Valor débito",
          align: "left",
          field: "debito",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
        },
        {
          name: "credito",
          label: "Valor crédito",
          align: "left",
          field: "credito",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
        },
        {
          name: "base",
          label: "Valor base",
          align: "left",
          field: "base",
          format: (val) => this.formatMoney(val),
          headerStyle: "height: 40px",
        },
      ],
    };
  },
  methods: {
    formatMoney(val) {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      return formatterPeso.format(val);
    },
  },
};
</script>

<style>
</style>