<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-end">
        <l-input col="3" placeholder="Búsqueda" v-model="filter" />
      </div>
    </div>
    <div class="col-12">
      <q-table
        flat
        bordered
        :data="value"
        :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
        row-key="name"
      >
        <template v-slot:bottom-row>
          <q-tr class="bg-grey-3">
            <q-td colspan="7" class="text-right"
              ><strong>TOTALES:</strong></q-td
            >
            <q-td class="text-right"
              ><strong>{{ formatMoney(totales.db) }}</strong></q-td
            >
            <q-td class="text-right"
              ><strong>{{ formatMoney(totales.cr) }}</strong></q-td
            >
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "no_conciliados",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: null,
      totales: {
        db: 0,
        cr: 0,
        pl: 0,
      },
      columns: [
        // {
        //   name: "codigo",
        //   label: "Código",
        //   align: "left",
        //   field: "codigo",
        // },
        {
          name: "tipo_documento",
          label: "Tipo Doc",
          align: "left",
          field: "tipo_documento",
        },
        {
          name: "documento",
          label: "Documento",
          align: "left",
          field: "numero",
        },
        {
          name: "cheque",
          label: "Cheque",
          align: "left",
          field: "num_cheque",
        },
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha",
        },
        {
          name: "persona",
          label: "Persona",
          align: "left",
          field: "persona",
        },
        {
          name: "fecha_conciliacion",
          label: "Fecha conciliación",
          align: "left",
          field: "fecha_conciliacion",
        },
        {
          name: "user_conciliacion",
          label: "Usuario que concilió",
          align: "left",
          field: "user_conciliacion",
        },
        {
          name: "valor_db",
          label: "Valor Débito",
          align: "right",
          field: (row) => this.formatMoney(row.valor_db),
        },
        {
          name: "valor_cr",
          label: "Valor Crédito",
          align: "right",
          field: (row) => this.formatMoney(row.valor_cr),
        },
        // {
        //   name: "valor_plano",
        //   label: "Valor Plano",
        //   align: "left",
        //   field: (row) => this.formatMoney(row.valor_plano),
        // },
        // {
        //   name: "acciones",
        //   align: "center",
        // },
      ],
      pagination: {
        rowsPerPage: 50,
      },
    };
  },
  computed: {
    selectall: {
      get() {
        if (this.value.length > 0) {
          if (
            this.value.filter((f) => f.select == true).length ==
            this.value.length
          ) {
            return true;
          }
        }
        return false;
      },
      set(val) {
        for (let i = 0; i < this.value.length; i++) {
          this.value[i].select = val;
        }
      },
    },
  },
  methods: {
    getTotales() {
      this.totales.db = 0;
      this.totales.cr = 0;
      this.totales.pl = 0;

      for (let i = 0; i < this.value.length; i++) {
        this.totales.db += this.value[i].valor_db;
        this.totales.cr += this.value[i].valor_cr;
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
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.totales.db = 0;
        this.totales.cr = 0;
        this.totales.pl = 0;

        for (let i = 0; i < this.value.length; i++) {
          this.totales.db += this.value[i].valor_db;
          this.totales.cr += this.value[i].valor_cr;
        }
      },
    },
  },
};
</script>

<style>
</style>