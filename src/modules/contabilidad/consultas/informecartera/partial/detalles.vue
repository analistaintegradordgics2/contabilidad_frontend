<template>
  <div>
    <q-table
        class="my-sticky-header-table qtablecon"
        :data="data_detalles"
        :columns="columnas"
        row-key="name"
        flat
        dense
        bordered
        :hide-bottom="true"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
    >
       <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="4" class="text-right texttotales text-weight-bold"><span>Totales:</span></q-td>
          <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(data_detalles.reduce((accumulator, item) => accumulator + parseFloat(item.valor_db), 0))}}</span></q-td>
          <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(data_detalles.reduce((accumulator, item) => accumulator + parseFloat(item.valor_cr), 0))}}</span></q-td>
        </q-tr>
         <q-tr>
          <q-td colspan="5" class="text-right texttotales text-weight-bold"><span>Diferencia:</span></q-td>
          <q-td class="text-right texttotales text-weight-bold"><span>{{ formatMoney(data_detalles.reduce((accumulator, item) => accumulator + parseFloat(item.valor_db), 0) - data_detalles.reduce((accumulator, item) => accumulator + parseFloat(item.valor_cr), 0))}}</span></q-td>
        </q-tr>
      </template>
    </q-table>
    <div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detallesCartera',
  components: {},
  props: {
    data_detalles: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
        datos: [],
        columnas:[
            {
                name: "fecha",
                label: "FECHA",
                align: "center",
                headerClasses: "bg-primary",
                field: "fecha",
            },
            {
                name: "conc",
                label: "CONC",
                align: "center",
                headerClasses: "bg-primary",
                field: "concepto",
            },
            {
                name: "descripcion",
                label: "DESCRIPCÓN",
                headerClasses: "bg-primary",
                field: "detalle",
            },
            {
                name: "doc_ref",
                label: "DOC REF",
                headerClasses: "bg-primary",
                field: "docref",
            },
            {
                name: "valor_db",
                label: "VALOR DB",
                headerClasses: "bg-primary",
                field: (row) => this.formatMoney(row.valor_db)
            },
            {
                name: "valor_cr",
                label: "VALOR CR",
                headerClasses: "bg-primary",
                field: (row) => this.formatMoney(row.valor_cr)
            },
        ],
        pagination: {
            rowsPerPage: 0,
        },
    };
  },
  methods: {
    formatMoney (val) {
      if (val == null) {
        val = 0
      }
      const formatterPeso = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      })
      return formatterPeso.format(val)
    }
  }
}
</script>

<style>
</style>
