<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <l-select
        col="2"
        label="Nivel *"
        v-model="model.tipo"
        :options="arraytipo"
        :clearable="false"
      />
      <div class="q-gutter-md">
        <q-checkbox
          v-model="model.ver_nits"
          :val="true"
          label="Ver Nits"
        />
        <q-checkbox
          v-model="model.mesacu"
          :val="true"
          label="Mes - acumulado"
        />
        <q-checkbox
          v-model="model.ccosto"
          :val="true"
          label="Centro de costos"
        />
        <q-checkbox
          v-model="model.niif"
          :val="true"
          label="Niif"
        />
      </div>
      <q-space />
      <l-input
        col="2"
        type="number"
        label="Año *"
        v-model="model.año"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-model="model.mesini"
        label="Mes *"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
        ref="mesini"
      />
      <div>
        <q-btn dense round color="primary" icon="search" @click="consultar" />
      </div>
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_gestion_contable_informes_estado_de_resultados_acciones_imprimir"
          >
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="imprimirConsulta"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
          <div>
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="exportarexcel"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
              <q-tooltip>Exportar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-chip>
      <div class="col-12 q-mt-md">
        <q-table
          class="my-sticky-header-table"
          :data="data"
          :columns="columns"
          row-key="name"
          flat
          dense
          bordered
          :hide-bottom="true"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th class="text-left">Código</q-th>
              <q-th class="text-left">Cuenta</q-th>
              <q-th class="text-left" v-for="item in centrocc" :key="item">{{
                item
              }}</q-th>
              <q-th class="text-right">
                {{
                  model.mesacu == true ? `Parcial ${mestd}` : "Parcial Acumulado"
                }}
              </q-th>
              <q-th class="text-right"> Total Acumulado </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :style="colorTable(props.row.color)">
              <q-td key="codigo" :props="props">
                {{ props.row.codigo }}
              </q-td>
              <q-td key="nombre" :props="props">
                {{ props.row.nombre }}
              </q-td>
              <q-td v-for="item in centrocc" :key="item">
                {{ formatTable(2, valorcc(props.row, item)) }}
              </q-td>
              <q-td key="parcial" :props="props">
                {{ formatTable(2, props.row.parcial) }}
              </q-td>
              <q-td key="total" :props="props">
                {{ formatTable(2, props.row.total) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-form>
    <imprimirconsulta ref="imprimirconsulta" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import imprimirconsulta from "./partial/imprimir";
import fileDownload from "js-file-download";
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
  },
  props: {},
  data() {
    return {
      shape: null,
      arraytipo: [
        { id: 1, nombre: "1" },
        { id: 2, nombre: "2" },
        { id: 4, nombre: "4" },
        { id: 6, nombre: "6" },
        { id: 8, nombre: "8" },
        { id: 10, nombre: "10" },
        { id: 12, nombre: "12" },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      centrocc: [],
      model: {
        tipo: 12,
        año: null,
        mesini: null,
        ver_nits: false,
        mesacu: false,
        ccosto: false,
        niif: false,
      },
      mayor: [],
      mayor_banco: [],
      pdfs: { path: null },
      data: [],
      mestd: "",
      columns: [
        {
          name: "codigo",
          label: "CÓDIGO",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "codigo",
        },
        {
          name: "nombre",
          label: "NOMBRE DE LA CUENTA",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "nombre",
        },
        {
          name: "parcial",
          label: "PARCIAL",
          headerClasses: "bg-primary text-white",
          field: "parcial",
        },
        {
          name: "prueba",
          label: "centro costo",
          headerClasses: "bg-primary text-white",
          field: "prueba",
        },
        {
          name: "total",
          label: "TOTAL",
          headerClasses: "bg-primary text-white",
          field: "total",
        },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio", "centros_costo"]),
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async exportarexcel() {
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_estado_resultados",
        { data: this.data, model: this.model }
      ).then((resp) => {
        fileDownload(resp, "consulta_estado_resultados.xlsx");
      });
    },
    async consultar() {
      const validate = await this.$refs.Formconsulta.validate();
      if (validate) {
        var params = {
          model: this.model,
        };
        var resul = {
          sumsaldos: [],
          summov: [],
        };
        try {
          const validate = await this.$refs.Formconsulta.validate();
          if (validate) {
            this.data = await this.Post(
              "contabilidad/consultas/consulta_estado_resultados",
              params
            );
            if (this.data.length == 0) {
              this.LInfo("info", "No hay información para mostrar");
            }
          }
        } catch ({ message }) {
          console.error(message);
        }
      }
    },
    fechaActual() {
      var fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = fecha.getMonth() + 1;
      this.model.mesfin = fecha.getMonth() + 1;
    },
    formatTable(caso, val, detalle = null) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      switch (caso) {
        case 1:
          if (val != null) {
            return moment(val, "YYYY-MM-DD").format("DD/MM/YYYY");
          }
          break;
        case 2:
          if (val != null) {
            return formatterPeso.format(val);
          } else {
            return "";
          }
        case 3:
          if (detalle != null) {
            var det = detalle.split(" ");
            if (det[0] == "SALDO") {
              return formatterPeso.format(val);
            }
          }
          break;
      }
    },
    async GetCentrosCostos() {
      try {
        const data = await this.Get("contabilidad/centrocostos/all", {
          tipo: "C",
        });
        this.centrocostos = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    prueba(index, item) {
      let prueba = [];
      prueba.push(index.row);

      const result = prueba.find((elemento) => `${elemento}.${item}` == item);
      prueba.forEach((element) => {});
    },
    colorTable(caso) {
      switch (caso) {
        case 1:
          return "background-color: #ffb00029; color: darkslateblue; font-weight: bold;";
        case 11:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 12:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 2:
          return "background: #29C16017 padding-box; color: #008000; font-weight: bold;";
        case 21:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 22:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 3:
          return "background-color: #6BB7E017; color: #826431; font-weight: bold;";
        case 31:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 32:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 4:
          return "background-color: antiquewhite; color: #826431; font-weight: bold;";
        case 41:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 42:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 5:
          return "background-color: lightgray; color: #826431; font-weight: bold;";
        case 51:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black; font-weight: bold;";
        case 52:
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
        case 99:
          return "background-color: rgb(248, 249, 250, 0.5); color: black;";
      }
    },
    valorcc(data, item) {
      for (var [key, value] of Object.entries(data)) {
        if (key == item) {
          return value;
        }
      }
    },
    async imprimirConsulta() {
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post(
            "contabilidad/consultas/imprimir_consulta_estado_resultados",
            params
          );
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(
            this.pdfs,
            "ESTADO DE RESULTADOS"
          );
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.tipo = 12;
    },
  },
  created() {
    this.GetCentrosCostos();
  },
  watch: {
    "model.mesini"(val) {
      if (val != null) {
        const result = this.$refs.mesini.options.filter(
          (filter) => filter.id == val
        );
        this.mestd = result[0].nombre;
      }
      this.data = [];
    },
    "model.mesacu"(val) {
      if (val == true) {
        if (this.model.mesini != null) {
          const result = this.$refs.mesini.options.filter(
            (filter) => filter.id == this.$refs.mesini.value
          );
          this.mestd = result[0].nombre;
        }
      }
    },
    "model.ccosto"(val) {
      if (val == true) {
        this.centrocc = this.data[0].CC;
      } else {
        this.centrocc = [];
      }
    },

    "model.tipo"(val) {
      if (this.data.length > 0) {
        this.consultar();
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fechaActual();
      setTimeout(() => {
        this.consultar();
      }, 500);
    });
  },
  created() {
    this.getConfMes();
  },
};
</script>
<style lang="scss">
.btnAcciones {
  border: 1px solid #42a5f5 !important;
  &:hover {
    color: #194880 !important;
    border: 1px solid #194880 !important;
    & i {
      color: #194880 !important;
    }
  }
}

.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>
<style>
.divfil {
  border: 1px solid lightgray;
  border-radius: 5px;
}
.q-field--with-bottom {
  padding-bottom: 5px !important;
}
.q-field__bottom.row.items-start.q-field__bottom--animated {
  display: none !important;
}
</style>
<style lang="sass">
.my-sticky-header-table
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
</style>