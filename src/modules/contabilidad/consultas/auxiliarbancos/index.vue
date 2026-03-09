<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <l-select-api
        url="contabilidad/mayor/select_solo_cutabanco"
        col="4"
        label="Codigo *"
        option-value="id"
        option-label="codigo_nombre"
        v-model="model.codigo"
        @focus="extraerCuenta(model.codigo)"
        :rules="[
          (val) => asignarValor(1, model.codigo, 1),
          $rules.required($t('validator.required')),
        ]"
      />
      <l-input
        col="2"
        label="Año *"
        type="number"
        v-model="model.año"
        icon="calendar_today"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        label="Mes Inical *"
        v-model="model.mesini"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-model="model.mesfin"
        label="Mes Final *"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <div class="flex items-center">
        <q-btn color="primary" round dense icon="search" @click="consultar" />
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_gestion_contable_consultas_consulta_de_auxiliares_acciones_imprimir"
          >
            <q-btn
              class="btnAcciones q-mr-sm"
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
        </div>
      </q-chip>
      <div class="col-12 q-mt-md">
        <q-table
          class="my-sticky-header-table2 qtablecon"
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
              <q-th class="text-left">Tipo</q-th>
              <q-th class="text-left">Número</q-th>
              <q-th class="text-left">Fecha</q-th>
              <q-th class="text-left">Fecha cg</q-th>
              <q-th class="text-left">Nro cg</q-th>
              <q-th class="text-left">Doc Ref</q-th>
              <q-th class="text-left">Detalle</q-th>
              <q-th class="text-left">Nit</q-th>
              <q-th class="text-left">Persona</q-th>
              <q-th class="text-left">Débito</q-th>
              <q-th class="text-left">Crédito</q-th>
              <q-th class="text-left">Saldo</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :style="colorTable(props.row.color)">
              <q-td key="tipo" :props="props">
                {{ props.row.tipo }}
              </q-td>
              <q-td key="numero" :props="props">
                <span class="cursor-pointer" @click="verdocumentos(props.row.numero, props.row.fuentes_id, props.row.id, false)">
                  {{ props.row.numero }}
                  <q-tooltip>Ver documento</q-tooltip>
                </span>
              </q-td>
              <q-td key="fecha" :props="props">
                {{ props.row.fecha }}
              </q-td>
              <q-td key="fechac" :props="props">
                {{ props.row.fechac }}
              </q-td>
              <q-td key="nrocg" :props="props">
                {{ props.row.nrocg != "NULL" ? props.row.nrocg : "" }}
              </q-td>
              <q-td key="docref" :props="props">
                {{ props.row.docref }}
              </q-td>
              <q-td key="detalle" :props="props" class="white-space" style="width: 500px">
                {{ remplazarmes(props.row.detalle) }}
              </q-td>
              <q-td key="cedula" :props="props">
                {{ props.row.cedula }}
              </q-td>
              <q-td key="persona" :props="props" class="white-space" style="width: 500px">
                {{ props.row.persona }}
              </q-td>
              <q-td key="valor_db" :props="props">
                {{
                  props.row.tipo != null &&
                  props.row.numero != null &&
                  props.row.fecha != null
                    ? formatTable(2, props.row.valor_db)
                    : formatTable(3, props.row.valor_db, props.row.detalle)
                }}
              </q-td>
              <q-td key="valor_cr" :props="props">
                {{
                  props.row.tipo != null &&
                  props.row.numero != null &&
                  props.row.fecha != null
                    ? formatTable(2, props.row.valor_cr)
                    : formatTable(3, props.row.valor_cr, props.row.detalle)
                }}
              </q-td>
              <q-td key="saldo" :props="props">
                {{ props.row.saldo != null ? formatTable(2,props.row.saldo) : null }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-form>
    <div style="background-color: #f1f7fc">
      <div class="row q-pa-md q-py-lg">
        <div class="col-6">
          <div class="row">
            <l-input
              col="md-4 text-black bold"
              v-model="detalle.general"
              :readonly="true"
            />
            <l-input
              col="md-8 text-black bold"
              v-model="detalle.genenom"
              :readonly="true"
            />
            <l-input col="md-4 text-black bold" v-model="detalle.aux1" :readonly="true" />
            <l-input
              col="md-8 text-black bold"
              v-model="detalle.aux1nom"
              :readonly="true"
            />
            <l-input col="md-4 text-black bold" v-model="detalle.aux2" :readonly="true" />
            <l-input
              col="md-8 text-black bold"
              v-model="detalle.aux2nom"
              :readonly="true"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-1"></div>
            <div class="col-3" style="align-self: center">
              <label class="text-weight-bold">Saldo Anterior</label>
            </div>
            <l-money
              v-model="detalle.saldoinidb"
              col="md-4 q-mb-xs bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
            <l-money
              v-model="detalle.saldoinicr"
              col="md-4 q-mb-xs bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
            <div class="col-1"></div>
            <div class="col-3" style="align-self: center">
              <label class="text-weight-bold">Movimientos</label>
            </div>
            <l-money
              v-model="detalle.summovdb"
              col="md-4 q-mb-xs bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
            <l-money
              v-model="detalle.summovcr"
              col="md-4 q-mb-xs bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
            <div class="col-1"></div>
            <div class="col-3" style="align-self: center">
              <label class="text-weight-bold">Nuevo Saldo</label>
            </div>
            <l-money
              v-model="detalle.saldofindb"
              col="md-4 bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
            <l-money
              v-model="detalle.saldofincr"
              col="md-4 bold"
              prefijo="$ "
              :precision="conta_centavos"
              :readonly="true"
            />
          </div>
        </div>
      </div>
    </div>
    <imprimirconsulta ref="imprimirconsulta" />
    <verdocumentos ref="verdocumentos" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment, { RFC_2822 } from "moment";
import imprimirconsulta from "./partial/imprimir";
import fileDownload from "js-file-download";
import verdocumentos from "pages/contabilidad/procesos/documentos/partial/crear.vue"
export default {
  layout: "main",
  name: "index",
  components: {
    imprimirconsulta,
    verdocumentos,
  },
  props: {
    // value: {
    //   type: Object,
    // },
  },
  data() {
    return {
      shape: null,
      pagination: {
        rowsPerPage: 0,
      },
      conta_centavos: 0,
      model: {
        año: null,
        mesini: null,
        mesfin: null,
        codigo: null,
        nommayor: null,
        codigonom: {
          nombre1: null,
        },
      },
      mayor: [],
      mayor_banco: [],
      detalle: {
        general: null,
        genenom: null,
        aux1: null,
        aux1nom: null,
        aux2: null,
        aux2nom: null,
        saldoinidb: 0,
        saldoinicr: 0,
        saldofindb: 0,
        saldofincr: 0,
        summovdb: 0,
        summovcr: 0,
      },
      pdfs: { path: null },
      data: [],
      columns: [
        {
          name: "tipo",
          label: "TIPO",
          align: "left",
          field: "tipo",
        },
        {
          name: "numero",
          label: "NUMERO",
          align: "left",
          field: "numero",
        },
        {
          name: "fecha",
          label: "FECHA",
          align: "left",
          field: "fecha",
        },
        {
          name: "fechac",
          label: "FECHACG",
          align: "left",
          field: "fechac",
        },
        {
          name: "docref",
          label: "DOC_REF",
          align: "left",
          field: "docref",
        },
        {
          name: "nrocg",
          label: "NRO. DOCU.",
          align: "left",
          field: "nrocg",
        },
        {
          name: "detalle",
          label: "DETALLE",
          align: "left",
          field: "detalle",
        },
        {
          name: "cedula",
          label: "NRO. DOCU.",
          field: "cedula",
          align: "left",
        },
        {
          name: "persona",
          label: "PERSONA",
          field: "persona",
          align: "left",
        },
        {
          name: "valor_db",
          label: "DÉBITO",
          align: "right",
          field: "valor_db",
        },
        {
          name: "valor_cr",
          label: "CRÉDITO",
          align: "right",
          field: "valor_cr",
        },
        {
          name: "fuentes_id",
          label: "CONC",
          align: "left",
          field: "fuentes_id",
        },
        {
          name: "saldo",
          label: "SALDO",
          align: "left",
          field: "saldo",
        },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    ...mapState("parametros", ["centavos_contabilidad"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async exportarexcel() {
      let params = {
        data: this.data,
        model: this.model,
        sumas: this.detalle,
      };
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_filtro_aux_banco",
        params
      ).then((resp) => {
        fileDownload(resp, "consulta_filtro_aux_banco.xlsx");
      });
    },
    remplazarmes(text) {
      var result = null;
      if (text != null) {
        result = text.replace("JANUARY", "ENERO");
        result = result.replace("FEBRUARY", "FEBRERO");
        result = result.replace("MARCH", "MARZO");
        result = result.replace("APRIL", "ABRIL");
        result = result.replace("MAY", "MAYO");
        result = result.replace("JUNE", "JUNIO");
        result = result.replace("JULY", "JULIO");
        result = result.replace("AUGUST", "AGOSTO");
        result = result.replace("SEPTEMBER", "SEPTIEMBRE");
        result = result.replace("OCTOBER", "OCTUBRE");
        result = result.replace("NOVEMBER", "NOVIEMBRE");
        result = result.replace("DECEMBER", "DICIEMBRE");
      }
      return result;
    },
    async consultar() {
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
          this.data = await this.Post({
            api: "contabilidad/consultas/consulta_filtro_aux_banco",
            model: params,
          });
          if (this.data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          }
          const filtro = this.data.filter((filter) => filter.color == 0);
          var sumdb = 0;
          var sumcr = 0;
          filtro.forEach((element) => {
            sumdb = sumdb + element.valor_db;
            sumcr = sumcr + element.valor_cr;
          });
          resul.summov.push(sumdb);
          resul.summov.push(sumcr);

          const data = await this.Post({
            api: "contabilidad/consultas/consulta_saldos_aux_banco",
            model: params,
          });

          resul.sumsaldos = data.sumsaldos;

          this.detalle.saldoinidb = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : 0;
          this.detalle.saldoinicr = resul.sumsaldos[0] < 0 ? resul.sumsaldos[0] * -1 : 0;
          this.detalle.saldofindb = resul.sumsaldos[1] > 0 ? resul.sumsaldos[1] : 0;
          this.detalle.saldofincr = resul.sumsaldos[1] < 0 ? resul.sumsaldos[1] * -1 : 0;
          this.detalle.summovdb = resul.summov[0];
          this.detalle.summovcr = resul.summov[1];
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    fechaActual() {
      var fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = fecha.getMonth() + 1;
      this.model.mesfin = fecha.getMonth() + 1;
    },
    async asignarValor(caso, valor, opcion = null) {
      switch (caso) {
        case 1:
          if (typeof valor == "number") {
            if (valor != null && valor != "") {
              const data = await this.Get({
                api: "contabilidad/mayor/" + valor,
              });
              if (opcion == 1) {
                this.model.nommayor = data.nombrel;
                this.model.codigonom.nombre1 = data.codigol;
              }
            }
          }
          break;
      }
      return true;
    },
    formatTable(caso, val, detalle = null) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: this.conta_centavos
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
          return "background-color:#F5B21D17; opacity: 1; color: darkslateblue; font-weight: bold;";
        case 2:
          return "background-color: white; color: white; font-weight: bold;";
        case 3:
          return "background: #29C16017 padding-box; color: #008000; font-weight: bold;";
        case 4:
          return "background-color: #6BB7E017; opacity: 1; color: #826431; font-weight: bold;";
        default:
          return "background-color: lightgoldenrodyellow; color: black;";
      }
    },
    extraerCuenta(id = null) {
      if (id != null && id != "") {
        var codigo = null;
        const result = this.mayor.filter((filter) => filter.id == id);
        codigo = result[0].codigol;
        var codigoPadre1 = 0;
        var codigoPadre2 = 0;
        var filtro1 = null;
        var filtro2 = null;
        var filtro3 = null;
        if (codigo.length > 2) {
          codigo = codigo.split("");
          codigo.splice(codigo.length - 2, 2);
          codigoPadre1 = codigo.join("");
          filtro1 = this.mayor.filter((filter) => filter.codigol == codigoPadre1);
          if (filtro1.length == 1) {
            if (codigoPadre1.length > 2) {
              codigo = codigoPadre1.split("");
              codigo.splice(codigoPadre1.length - 2, 2);
              codigoPadre2 = codigo.join("");
              filtro2 = this.mayor.filter((filter) => filter.codigol == codigoPadre2);
              if (filtro2.length == 1) {
                filtro3 = this.mayor.filter(
                  (filter) => filter.codigol == result[0].codigol
                );
                this.detalle.general = filtro2[0].codigol;
                this.detalle.genenom = filtro2[0].nombrel;
                this.detalle.aux1 = filtro1[0].codigol;
                this.detalle.aux1nom = filtro1[0].nombrel;
                this.detalle.aux2 = filtro3[0].codigol;
                this.detalle.aux2nom = filtro3[0].nombrel;
              }
            } else {
              codigo = codigoPadre1.split("");
              codigo.splice(codigoPadre1.length - 1, 2);
              codigoPadre2 = codigo.join("");
              filtro2 = this.mayor.filter((filter) => filter.codigol == codigoPadre2);
              if (filtro2.length == 1) {
                filtro3 = this.mayor.filter(
                  (filter) => filter.codigol == result[0].codigol
                );
                this.detalle.general = filtro2[0].codigol;
                this.detalle.genenom = filtro2[0].nombrel;
                this.detalle.aux1 = filtro1[0].codigol;
                this.detalle.aux1nom = filtro1[0].nombrel;
                this.detalle.aux2 = filtro3[0].codigol;
                this.detalle.aux2nom = filtro3[0].nombrel;
              }
            }
          }
        } else {
          codigo = codigo.split("");
          codigoPadre1 = codigo[0];
          filtro1 = this.mayor.filter((filter) => filter.codigol == codigoPadre1);
          filtro2 = this.mayor.filter((filter) => filter.codigol == result[0].codigol);
          this.detalle.general = filtro1[0].codigol;
          this.detalle.genenom = filtro1[0].nombrel;
          this.detalle.aux1 = filtro2[0].codigol;
          this.detalle.aux1nom = filtro2[0].nombrel;
        }
      }
    },
    async imprimirConsulta() {
      var params = {
        model: this.model,
        sumas: this.detalle,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post({
            api: "contabilidad/consultas/imprimir_consulta_aux_banco",
            model: params,
          });
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(this.pdfs, "AUXILIAR POR BANCOS");
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getMayor() {
      try {
        const data = await this.Get({ api: "contabilidad/mayor" });
        this.mayor = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getMayorBanco() {
      try {
        const data = await this.Get({
          api: "contabilidad/ctabanco/mayor_banco",
        });
        this.mayor_banco = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.codigo = null;
      this.model.nommayor = null;
      this.model.codigonom.nombre1 = null;
    },
    async verdocumentos(documento, tipo_documento, id_doc, editar) {
      this.$refs.verdocumentos.abrirmodal(
        documento,
        tipo_documento,
        id_doc,
        editar
      );
    }
  },
  watch: {
    "model.codigo"(val) {
      if (val == null) {
        this.model.nommayor = null;
        this.detalle.general = null;
        this.detalle.genenom = null;
        this.detalle.aux1 = null;
        this.detalle.aux1nom = null;
        this.detalle.aux2 = null;
        this.detalle.aux2nom = null;
        this.data = [];
      } else {
        if (typeof val == "number") {
          this.extraerCuenta(val);
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fechaActual();
      }, 500);
    });
  },
  created() {
    this.conta_centavos = this.centavos_contabilidad ? 2 : 0
    this.getConfMes();
    this.getMayor();
    this.getMayorBanco();
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
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0% 0%
    no-repeat padding-box !important;
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
.q-table td.white-space {
  white-space: normal !important;
}
.bold input {
  font-weight: bold;
}
</style>
<style lang="sass">
.my-sticky-header-table2
  /* height or max-height is important */
  min-height: 10vh
  max-height: 50vh

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
