<template>
  <l-newmodal 
  ref="modal" 
  :validar_salir="false" 
  width="1500px" 
  :titulo="'Inmuebles Asociados'"
  :footer="true">

    <template slot="body">
      <div>
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
              <q-td auto-width class="text-right">
                <div class="q-px-sm" style="width: auto">
                  <l-money 
                    :outlined="true" 
                    v-model="props.row.retroactivo_admon" 
                    col="12 inputheight" 
                    prefijo="$ "
                    sufijo="" 
                    class_input="text-weight-bold text-red" 
                    :readonly="props.row.id > 0" />
                </div>
              </q-td>
              <q-td auto-width class="text-right">
                <div class="q-px-sm" style="width: 130px">
                  <l-money
                    :outlined="true"
                    v-model="props.row.admon_neta"
                    col="12 inputheight"
                    prefijo="$ "
                    sufijo=""
                    class_input="text-weight-bold text-red"
                    :readonly="validateDate(props.row.fecha_retroactivo_admon)"
                  />
                </div>
              </q-td>
              <q-td auto-width class="text-right">
                <div class="q-px-sm" style="width: 130px">
                  <l-money
                    :outlined="true"
                    v-model="props.row.reajuste_admon"
                    col="12 inputheight"
                    prefijo="$ "
                    sufijo=""
                    class_input="text-weight-bold text-red"
                    :readonly="validateDate(props.row.fecha_retroactivo_admon)"
                  />
                </div>
              </q-td>
              <q-td auto-width class="text-right">
                <div class="q-px-sm" style="width: 130px">
                  <l-money
                    :outlined="true"
                    v-model="props.row.admon_pronto_pago"
                    col="12 inputheight"
                    prefijo="$ "
                    sufijo=""
                    class_input="text-weight-bold text-red"
                    :readonly="validateDate(props.row.fecha_retroactivo_admon)"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </template>

    <template slot="footer">
      <div class="row justify-center footer_class ">
        <q-btn  rounded class="btnlisto" @click="continuar()">
          <label>Confirmar</label>
        </q-btn>
      </div>
    </template>
  </l-newmodal>
</template>

<script>
import moment from "moment";
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
          name: "retroactivo_admon",
          label: "Valor Retroactivo",
          field: "retroactivo_admon",
          align: "left",
        },
        {
          name: "admon_neta",
          label: "V. Admon. Neta",
          field: "admon_neta",
          align: "left",
        },
        {
          name: "reajuste_admon",
          label: "Reajuste Admon.",
          field: "reajuste_admon",
          align: "left",
        },
        {
          name: "admon_pronto_pago",
          label: "V. Admon. Pronto Pago",
          field: "admon_pronto_pago",
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
      this.seltodos = false
      this.seleccionar = inmuebles_asociados.filter((x) => inmueble_id.includes(x.value))
      this.persona_id = id
      this.$refs.modal.open();
    },
    continuar() {
      if (!this.seleccionar.every((x) => x.retroactivo_admon > 0)) {
        this.LInfo('warning', 'Alguno de los registros seleccionados no tiene un valor para el retroactivo, por favor revisar.');
        return;
      }
      const dataTemp = this.seleccionar.map((x) => {
        return {
          'id': x.value,
          'label': x.label
        }
      })
      this.LConfim(`¿Está seguro?, desea seleccionar los inmuebles ${[...new Set(dataTemp.map((item) => item.id))]} para retroactivo de administración?`, async () => {
        this.$emit('pushearIds', dataTemp,this.persona_id, this.seleccionar)
        this.$refs.modal.close();
      })
    },
    validateDate(date) {
        if (!date) {
          return false;
        }
        return moment().format("YY") === moment(date).format("YY");
      },
    seleccionartodos() {
      if (this.seltodos == true) {
        this.seleccionar = this.data.filter((x) => !this.validateDate(x.fecha_retroactivo_admon))
      } else {
        this.seleccionar = [];
      }
    },
    onSelectRow() {
      this.seleccionar.forEach((el) => {
        el.seleccionado = true
      });
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
.my-table-details {
  max-width: auto;
  font-size: 11px;
  white-space: normal;
  margin-top: 4px;
}

.inputheight{
  margin-top: 14px;
}
</style>