<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <l-money
          col="3"
          v-model="valor_extracto_conciliacion.valor"
          label="Valor total del extracto *"
          prefijo="$ "
          sufijo=""
          :precision="centabos_plataforma == true ? 2 : 0"
          :rules="[
            $rules.required($t('validator.required')),
            (val) => val > 0 || 'Ingrese valor',
          ]"
          :disable="estado"
        />
        <can permiso="view_menu_contabilidad_procesos_conciliacion_bancaria_acciones_cambiar_valor_extracto" class="flex items-center q-pb-xs q-pl-sm">
          <q-btn
            unelevated
            round
            dense
            color="green"
            icon="save"
            @click="guardarValorExtracto"
            :disable="estado"
          >
            <q-tooltip>Guardar valor</q-tooltip>
          </q-btn>
        </can>
        <q-space />
        <l-input col="3 q-pt-lg" placeholder="Búsqueda" v-model="filter" />
      </div>
    </div>
    <div class="col-12 q-py-sm">
      <strong>Movimientos no conciliados del {{ in_mes }}/{{ in_anio }} para la cuenta consultada</strong>
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
        <template v-slot:header-cell-select="props">
          <q-th :props="props">
            <q-checkbox v-model="selectall" color="amber" :disable="estado" />
          </q-th>
        </template>
        <template v-slot:body-cell-select="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.select" color="amber" :disable="estado" />
          </q-td>
        </template>
        <template v-slot:bottom-row>
          <q-tr class="bg-grey-3">
            <q-td colspan="6" class="text-right"
              ><strong>TOTALES:</strong></q-td
            >
            <q-td class="text-right"
              ><strong>{{ formatMoney(totales.db) }}</strong></q-td
            >
            <q-td class="text-right"
              ><strong>{{ formatMoney(totales.cr) }}</strong></q-td
            >
            <!-- <q-td class="text-right"
              ><strong>{{ formatMoney(totales.pl) }}</strong></q-td
            >
            <q-td></q-td> -->
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="col-12 q-pt-md">
      <div class="row q-px-md" style="font-size: 16px">
        <div class="col-6">
          <label
            >Total seleccionados:
            <strong>{{
              value.filter((f) => f.select == true).length
            }}</strong></label
          >
        </div>
        <div class="col-6 text-right">
          TOTAL: <strong>{{ total_select }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "no_conciliados",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    in_mes: {
      type: String,
      default: undefined,
    },
    in_anio: {
      type: Number,
      default: undefined,
    },
    in_cuenta: {
      type: Number,
      default: undefined,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    cuentas_bancarias: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      valor_extracto_conciliacion: {
        id: null,
        parametro: "valor_extracto_conciliacion",
        valor: 0,
        mes: null,
        anio: null,
        cuenta: null,
      },
      filter: null,
      totales: {
        db: 0,
        cr: 0,
        pl: 0,
      },
      columns: [
        {
          name: "select",
          align: "center",
        },
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
        //   align: "right",
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
    ...mapState("parametros", ["centabos_plataforma"]),
    ...mapState("generales", ["meses", "anio"]),
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
    total_select() {
      let total = 0;
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i].select == true) {
          total += this.value[i].valor_cr + this.value[i].valor_db;
        }
      }
      return this.formatMoney(total);
    },
  },
  methods: {
    searchValorExtracto() {
      return parseInt(this.valor_extracto_conciliacion.valor);
    },
    async guardarValorExtracto() {
      if (this.in_mes == null) {
        this.LInfo("warning", "Por favor seleccione un mes.");
        return;
      }
      if (this.in_anio == null) {
        this.LInfo("warning", "Por favor seleccione un año.");
        return;
      }
      if (this.in_cuenta == null) {
        this.LInfo("warning", "Por favor seleccione una cuenta.");
        return;
      }
      if (this.valor_extracto_conciliacion.valor == 0) {
        this.LInfo(
          "warning",
          "El valor total del extracto de ser mayor que cero."
        );
        return;
      }
      this.LConfim(
        `Está seguro de guardar este valor de extracto para la cuenta ${this.cuentas_bancarias.find((f) => f.id == this.in_cuenta).cuenta_nombre} del mes ${this.in_mes} del año ${this.in_anio}`,
        async () => {
          this.valor_extracto_conciliacion.mes = this.meses.find(
            (f) => f.numero == this.in_mes
          ).id;
          this.valor_extracto_conciliacion.anio = this.anio.find(
            (f) => f.nombre == this.in_anio
          ).id;
          this.valor_extracto_conciliacion.cuenta = this.in_cuenta;
          this.valor_extracto_conciliacion["valor2"] = this.in_cuenta;
          await this.Post("parametrizacion/mes_anio", {
            filtros: {
              parametro: this.valor_extracto_conciliacion.parametro,
              mes: this.valor_extracto_conciliacion.mes,
              anio: this.valor_extracto_conciliacion.anio,
              valor2: this.valor_extracto_conciliacion.cuenta,
            },
            data: this.valor_extracto_conciliacion,
          }).then((resp) => {
            this.LInfo(
              "success",
              `Valor total del extracto ${
                this.valor_extracto_conciliacion.id == null
                  ? "guardado"
                  : "modificado"
              } correctamente.`
            );
            this.valor_extracto_conciliacion = resp;
          });
        },
        () => {}
      );
    },
    async getValorExtracto() {
      this.valor_extracto_conciliacion.mes = this.meses.find(
        (f) => f.numero == this.in_mes
      ).id;
      this.valor_extracto_conciliacion.anio = this.anio.find(
        (f) => f.nombre == this.in_anio
      ).id;
      this.valor_extracto_conciliacion.cuenta = this.in_cuenta;
      await this.Get("parametrizacion/mes_anio", {
        filtros: {
          parametro: this.valor_extracto_conciliacion.parametro,
          mes: this.valor_extracto_conciliacion.mes,
          anio: this.valor_extracto_conciliacion.anio,
          valor2: this.valor_extracto_conciliacion.cuenta,
        },
      }).then((resp) => {
        if (resp.data != null) {
          this.valor_extracto_conciliacion = resp.data;
        } else {
          this.valor_extracto_conciliacion = {
            id: null,
            parametro: "valor_extracto_conciliacion",
            valor: 0,
            mes: null,
            anio: null,
            cuenta: null,
          };
        }
      });
    },
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
    in_mes(val) {
      if (val != null) {
        this.getValorExtracto();
      }
    },
    in_anio(val) {
      if (val != null) {
        this.getValorExtracto();
      }
    },
    in_cuenta(val) {
      if (val != null) {
        this.getValorExtracto();
      }
    },
  },
  created() {},
};
</script>

<style>
</style>