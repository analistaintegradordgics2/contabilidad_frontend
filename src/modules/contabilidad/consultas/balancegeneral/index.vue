<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <l-select
        col="3"
        label="Consulta por niveles *"
        v-model="model.tipo"
        :options="select_tipo_consulta"
        :clearable="false"
      />
      <l-input
        col="2"
        label="Año *"
        type="number"
        v-model="model.año"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        label="Mes *"
        v-model="model.mesini"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <div>
        <q-btn dense round color="primary" icon="search" @click="consultar" />
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_gestion_contable_informes_balence_general_acciones_imprimir"
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
          ref="table"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th class="text-left">Código</q-th>
              <q-th class="text-left">Cuenta</q-th>
              <q-th class="text-right">Parcial</q-th>
              <q-th class="text-right">Total</q-th>
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
      select_tipo_consulta: [
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
      model: {
        tipo: 12,
        año: null,
        mesini: null,
      },
      mayor: [],
      mayor_banco: [],
      pdfs: { path: null },
      data: [],
      columns: [
        {
          name: "codigo",
          label: "Código",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "codigo",
        },
        {
          name: "nombre",
          label: "Cuenta",
          align: "left",
          headerClasses: "bg-primary text-white",
          field: "nombre",
        },
        {
          name: "parcial",
          label: "Parcial",
          headerClasses: "bg-primary text-white",
          field: "parcial",
        },
        {
          name: "total",
          label: "Total",
          headerClasses: "bg-primary text-white",
          field: "total",
        },
      ],
      totales: {
        parcial: 0,
        total: 0,
      },
      widthceltotales: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
      },
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async exportarexcel() {
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_balance_general",
        { data: this.data, model: this.model }
      ).then((resp) => {
        fileDownload(resp, "consulta_de_balance_general.xlsx");
      });
    },
    async consultar() {
      let params = { model: this.model };
      /* var resul = {
        sumsaldos: [],
        summov: [],
      }; */
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          this.data = await this.Post({
            api: "contabilidad/consultas/consulta_balance_general",
            model: params,
          });
          // setTimeout(() => {

          // }, 500);

          if (this.data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          } else {
            this.totales = {
              parcial: 0,
              total: 0,
            };
            this.data.forEach((element) => {
              this.totales.parcial += element.parcial;
              this.totales.total += element.total;
            });
            try {
              setTimeout(() => {
                this.$refs.table.$children[0].$el.childNodes.forEach(
                  (element, i) => {
                    Object.keys(this.widthceltotales).forEach((key) => {
                      if (i == key) {
                        this.widthceltotales[`${key}`] = element.offsetWidth;
                      }
                    });
                  }
                );
              }, 1000);
            } catch (error) {}
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async fechaActual() {
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
          return formatterPeso.format(val);
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
    colorTable(caso) {
      switch (caso) {
        case 1:
          return "background-color:#F5B21D17; color: darkslateblue; font-weight: bold;";
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
        default:
          return "background-color: white; color: white;";
      }
    },
    async imprimirConsulta() {
      var params = { model: this.model };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_balance_general",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(this.pdfs, "BALANCE GENERAL");
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.tipo = 12;
    },
  },
  watch: {
    "model.tipo"(val) {
      if (val == 12) {
        this.consultar();
        return;
      } else {
        this.consultar();
      }

      //LeidyB - Se comenta porque debe mostrar los registros menor o igual al filtro de codigo
      // let r = []
      // setTimeout(() => {
      //   this.data.map(function(item, x) {
      //     if(item.codigo != null){
      //       if(item.codigo.length == val || item.codigo == 'TOTAL' || item.codigo == ''){
      //         r.push(item)
      //       }
      //     }
      //   })

      //   this.data = r

      /*   this.data.filter((item) => {
          if(item.codigo != null){
            let x = item.codigo
            if(x.length == val || item.codigo == 'TOTAL'){
              r.push(item)
            }
          }
        }) */

      /*  if(r.length > 4){
          this.data = r
        }else{
          this.consultar()
        } */

      // }, 450);
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fechaActual().then(() => {
          this.consultar();
        });
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
  min-height: 520px

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