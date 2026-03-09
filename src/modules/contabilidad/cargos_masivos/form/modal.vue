<template>
  <l-newmodal 
    ref="modal" 
    :validar_salir="false" 
    width="1400px" 
    :titulo="'Inmuebles Asociados'"
    :footer="true">

    <template slot="body" >
      <q-table flat bordered :data="data" :columns="columns" row-key="name" :pagination.sync="pagination">

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>
              <q-checkbox v-model="seltodos" @input="seleccionartodos" />
            </q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr>
            <q-td class="text-center">
              <q-checkbox v-model="seleccionar" :val="props.row" />
            </q-td>
            <q-td class="my-table-details"> {{ props.row.inmueble }}</q-td>
            <q-td auto-width>
              <q-badge :style="`background-color: rgb(${props.row.estado.color})`" :label="props.row.estado.nombre" />
            </q-td>
            <q-td auto-width>{{ formatMoney(props.row.canon) }}</q-td>
            <q-td auto-width>{{ formatMoney(props.row.admon) }}</q-td>
            <q-td auto-width>{{ props.row.tipo }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </template>

    <template slot="footer">

      <div class="row justify-center footer_class">
        <q-btn rounded class="btnlisto" @click="continuar()">
          <label>Confirmar</label>
        </q-btn>
      </div>

    </template>
  </l-newmodal>
</template>

<script>
export default {
  name: "inmueblesasociados",
  data() {
    return {
      seltodos: false,
      persona_id: null,
      data: [],
      seleccionar: [],
      columns: [
        {
          name: "inmueble",
          label: "Inmueble",
          field: "label",
          align: "left",
          classes: "white-space",
        },
        {
          name: "estado",
          label: "Estado",
          field: (row) => row.estado.nombre,
          align: "left",
        },
        {
          name: "canon",
          label: "Canon",
          field: "canon",
          format: (val) => this.formatMoney(val),
          align: "left",
        },
        {
          name: "admon",
          label: "Admon",
          field: "admon",
          format: (val) => this.formatMoney(val),
          align: "left",
        },
        {
          name: "tipo",
          label: "Tipo de relación",
          field: "tipo",
          align: "left",
        },
      ],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  methods: {
    abrirModal({ inmuebles_asociados, id, inmueble_id }) {
      this.data = inmuebles_asociados;
      this.seleccionar = []
      this.seleccionar = inmuebles_asociados.filter((x) => inmueble_id.includes(x.value))
      this.persona_id = id
      this.$refs.modal.open();
    },
    continuar() {
      const dataTemp = this.seleccionar.map((x) => {
        return {
          'id': x.value,
          'label': x.label
        }
      })
      this.LConfim(`¿Está seguro?, desea seleccionar los inmuebles ${[...new Set(dataTemp.map((item) => item.id))]} para cargos masivos?`, async () => {
        this.$emit('pushearIds', dataTemp, this.persona_id)
      })
    },
    seleccionartodos() {
      if (this.seltodos == true) {
        this.seleccionar = this.data
      } else {
        this.seleccionar = [];
      }
    },
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
    cerrarModal() {
      this.$refs.modal.close();
    }
  },
};
</script>

<style>
.q-table td.white-space {
  white-space: normal !important;
}
</style>