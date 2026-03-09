<template>
  <q-page class="q-ma-lg q-ml-lg">
    <q-table
            class="q-mt-md"
            flat
            bordered
            dense
            row-key="name"
            :data="value"
            :columns="columns"
            :filter="filter"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
          >
            <!-- <template v-slot:header="props">
              <q-tr :props="props">
                <q-th>
                  <q-checkbox v-model="seltodos" @input="selectAll($event)" />
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                  col.label
                }}</q-th>
              </q-tr>
            </template> -->
            <template v-slot:body="props">
              <q-tr>
                <q-td class="white-space" auto-width>{{ props.row.vigencia }}</q-td>
                <q-td class="white-space" auto-width>{{ props.row.tipo_doc }}</q-td>
                <q-td class="white-space" auto-width>{{ props.row.documento }}</q-td>
                <q-td class="white-space" auto-width>
                  <div style="width: 300px">
                  {{ props.row.n_completo }}
                  </div>
                </q-td>
                <q-td style="white-space: normal" >
                  <div style="width: 300px">
                    {{ props.row.direccion_inmuebles }}
                  </div>
                </q-td>
                <q-td class="white-space" auto-width>{{ formatMoney(props.row.valor_total) }}</q-td>
                <!-- <q-td class="white-space" auto-width>{{ props.row.email }}</q-td> -->
                <q-td style="white-space: normal" >
                  <div style="width: 300px">
                    {{ props.row.direccion }}
                  </div>
                </q-td>
                <q-td class="white-space" auto-width>{{ props.row.codigo_municipio }}</q-td>
                <q-td class="white-space" auto-width>{{ props.row.codigo_dpto }}</q-td>
                <q-td class="white-space" auto-width>{{ props.row.email }}</q-td>
                <q-td class="white-space" auto-width>{{ props.row.telefono }}</q-td>
                <!-- <q-td class="white-space" auto-width>{{ props.row.monto_retenido_anualmente }}</q-td> -->
              </q-tr>
            </template>
          </q-table>
  </q-page>
</template>

<script>
export default {

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },


  data() {
    return {
      columns: [
        { name: "vigencia", label: "Vigencia", align: "left", field: "vigencia" },
        { name: "tipo_doc", label: "Tipo Doc", align: "left", field: "tipo_doc"},
        { name: "documento", label: "Documento", align: "left", field: "documento"},
        { name: "n_completo", label: "Propietario", align: "left", field: "n_completo", headerStyle: "white-space: normal; width: 200px; text-align:left;", },
        { name: "direccion_inmuebles", label: "Dir. inmueble", align: "left", field: "direccion_inmuebles",headerStyle: "white-space: normal; width: 200px; text-align:left;",},
        { name: "valor_total", label: "Valor Bruto", align: "left", field: "valor_total"},
        { name: "direccion_notificacion", label: "Dir. notificacion", align: "left", field: "direccion_notificacion", headerStyle: "white-space: normal; width: 500px; text-align:left;", },
        { name: "codigo_municipio", label: "Cod. Ciudad", align: "left", field: "codigo_municipiocodigo_municipio" },
        { name: "codigo_dpto", label: "Cod. Depto", align: "left", field: "codigo_dpto" },
        { name: "email", label: "Email", align: "left", field: "email"},
        { name: "telefono", label: "Teléfono", align: "left", field: "telefono" }
      ],
      filter: "",
      pagination: {
        rowsPerPage: 50,
      },
    };
  },
  methods: {
    formatMoney(val) {
      if (val == null) {
        val = 0;
      }
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      return formatterPeso.format(val);
    },
    },
    created() {
    },
};
</script>
