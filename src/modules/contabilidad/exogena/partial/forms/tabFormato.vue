<template>
    <q-tab-panel name="tabFormato">
          <q-table
            flat
            bordered
            dense
            row-key="name"
            :data="datos"
            :columns="columns"
            :filter="filter"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
          >
<!--            <template v-slot:header="props">-->
<!--              <q-tr :props="props">-->
<!--                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>-->
<!--              </q-tr>-->
<!--            </template>-->
<!--            <template v-slot:body="props">-->
<!--              <q-tr>-->
<!--                <q-td auto-width>{{ props.row.concepto_dian }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.tipo_doc }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.documento }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.p_apellido }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.s_apellido }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.p_nombre }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.s_nombre }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.razonsocial }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.direccion_res }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.cod_dpto }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.cod_mun }}</q-td>-->
<!--                <q-td auto-width>{{ props.row.cod_pais }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.pago_deducible) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.pago_nodeducible) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.iva_deducible) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.iva_nodeducible) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.retefte_practicada) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.retefte_asumida) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.reteiva_regcomun) }}</q-td>-->
<!--                <q-td auto-width>{{ formatMoney(props.row.reteiva_nodimici) }}</q-td>-->
<!--              </q-tr>-->
<!--            </template>-->
          </q-table>
      </q-tab-panel>
</template>

<script>
export default {
  layout: 'main',
  name: 'tabFormato',
  props: {
    columns: {
      type: Array
    },
    datos: {
      type: Array
    }
  },
  data () {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 100
      }
    }
  },
  computed: {},
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
