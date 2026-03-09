<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <div class="col">
        <div class="row">
          <l-select-rest
            col="3"
            url="contabilidad/mayor/selectnewall"
            v-model="model.codigo"
            :rules="[true]"
            label="Buscar Cuenta desde"
            @emitselecte="asignarValor($event, 1)"
          />
          <l-select-rest
            col="3"
            url="contabilidad/mayor/selectnewall"
            v-model="model.codigo2"
            :rules="[true]"
            label="Buscar Cuenta Hasta"
            @emitselecte="asignarValor($event, 2)"
          />
          <l-input
            col="1"
            type="number"
            v-model="model.año"
            :rules="[$rules.required($t('validator.required'))]"
            label="Año"
          />
          <l-select
            col="2"
            v-model="model.mesini"
            option-value="id"
            option-label="nombre"
            :options="meses"
            :rules="[$rules.required($t('validator.required'))]"
            label="Mes Inicio"
          />

          <l-select
            v-show="model.consolidado"
            col="2 text-black q-mb-xs"
            v-model="model.mesfin"
            option-value="id"
            option-label="nombre"
            :options="meses"
            label="Mes Final"
            :rules="[$rules.required($t('validator.required'))]"
          />
           
          <div>
            <q-btn dense round color="primary" icon="search" @click="consultar" />
          </div>
        </div>
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none q-ml-xl" size="22px">
        <div class="row q-col-gutter-x-md">
          <can
            class="col"
            permiso="view_menu_gestion_contable_consultas_consulta_de_auxiliares_acciones_imprimir"
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
          <div class="col">
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
      <div class="col-12 q-my-md">
        <div class="row">
          <l-select
            col="3"
            label="Consulta por niveles *"
            v-model="model.tipo"
            :options="select_tipo_consulta"
            :clearable="false"
          />

          <div class="q-gutter-sm">
            <q-checkbox v-model="model.vernit" label="Ver nits" />
            <q-checkbox v-model="model.vercusinmov" label="Ver cuentas sin movimientos" />
            <q-checkbox v-model="model.consolidado" label="Consolidado"/>
            <q-checkbox v-model="model.niif" label="Niif"/>
          </div>

          <q-space />
          <l-select-rest
            col="3"
            url="contabilidad/mayor/selectnewall"
            v-model="filter"
            @keyup-enter="localizar"
            :disable="data.length == 0"
            label="Buscar Cuenta"
            @emitselecte="localizar"
          />
        </div>
      </div>
      <div class="col-12">
        <q-table
          class="my-sticky-header-table qtablecon"
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
              <q-th class="text-left">Nombre</q-th>
              <q-th class="text-right">Saldo Inicial</q-th>
              <q-th class="text-right">Débito</q-th>
              <q-th class="text-right">Crédito</q-th>
              <q-th class="text-right">Saldo Final</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :style="colorTable(props.row.color)">
              <q-td key="codigo" :props="props" ref="trtbody">
                {{ props.row.codigo }}
              </q-td>
              <q-td key="nombre" :props="props">
                {{ props.row.nombre }}
              </q-td>
              <q-td key="saldoi" :props="props">
                {{ formatTable(2, props.row.saldoi) }}
              </q-td>
              <q-td key="debitos" :props="props">
                {{ formatTable(2, props.row.debitos) }}
              </q-td>
              <q-td key="creditos" :props="props">
                {{ formatTable(2, props.row.creditos) }}
              </q-td>
              <q-td key="saldof" :props="props">
                {{ formatTable(2, props.row.saldof) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <table class="full-width q-mt-sm">
          <tbody>
            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[1]}px`" class="text-right text-weight-bold">
                Totales
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, totales.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, totales.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, totales.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, totales.final) }}
              </td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td colspan="5">
                <q-separator />
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Ingresos
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, ingresos.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, ingresos.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, ingresos.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, ingresos.final) }}
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Gastos
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, gastos.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, gastos.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, gastos.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, gastos.final) }}
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Resultado
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultados_uno.ingr_gast_sin) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultados_uno.ingr_gast_deb) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultados_uno.ingr_gast_cr) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, resultados_uno.ingr_gast_sfi) }}
              </td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td colspan="5">
                <q-separator />
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Total Activo
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, activos.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, activos.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, activos.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, activos.final) }}
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Total Pasivo + Patrimonio
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, total_pasivo_patrimonio.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, total_pasivo_patrimonio.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, total_pasivo_patrimonio.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, total_pasivo_patrimonio.final) }}
              </td>
            </tr>

            <tr>
              <td :width="`${widthceltotales[0]}px`" class=""></td>
              <td :width="`${widthceltotales[0]}px`" class="text-right text-weight-bold">
                Resultado
              </td>

              <td
                :width="`${widthceltotales[2]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultado_dos.inicial) }}
              </td>

              <td
                :width="`${widthceltotales[3]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultado_dos.debito) }}
              </td>

              <td
                :width="`${widthceltotales[4]}px`"
                class="text-right q-pr-xs text-weight-bold"
              >
                {{ formatTable(2, resultado_dos.credito) }}
              </td>

              <td
                :width="`${widthceltotales[5]}px`"
                class="text-right text-weight-bold q-px-md"
              >
                {{ formatTable(2, resultado_dos.final) }}
              </td>
            </tr>
          </tbody>
        </table>
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
import headers from "../../procesos/infdiariocaja/partial/headers.vue";

export default {
  layout: "main",
  name: "index",
  components: {
    headers,
    imprimirconsulta,
  },
  props: {
    // value: {
    //   type: Object,
    // },
  },
  data() {
    return {
      modelito: true,
      ingresos: {
        inicial: 0,
        debito: 0,
        final: 0,
        credito: 0,
      },
      gastos: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },

      resultados_uno: {
        ingr_gast_sin: 0, //ingreso gastos saldo inicial
        ingr_gast_cr: 0, // ingreso gastos creditos
        ingr_gast_deb: 0, // ingreso gastos debito
        ingr_gast_sfi: 0, // ingreso gastos saldo final
      },

      pasivo: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },
      patrimonio: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },

      activos: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },
      total_pasivo_patrimonio: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },
      resultado_dos: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },

      filter: null,
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
        codigo: null,
        codigo2: null,
        año: null,
        mesini: null,
        mesfin: null,
        vernit: false,
        consolidado: false,
        niif: false,
        vercusinmov: false,
        codigonom: {
          codigo1: null,
          codigo2: null,
        },
      },
      mayor: [],
      mayor_banco: [],
      pdfs: { path: null },
      data: [],
      columns: [
        {
          name: "codigo",
          label: "CÓDIGO",
          align: "left",
          headerClasses: "bg-primary",
          field: "codigo",
        },
        {
          name: "nombre",
          label: "NOMBRE",
          align: "left",
          headerClasses: "bg-primary",
          field: "nombre",
        },
        {
          name: "saldoi",
          label: "SALDO INICIAL",
          headerClasses: "bg-primary",
          field: "saldoi",
        },
        {
          name: "debitos",
          label: "DÉBITO",
          headerClasses: "bg-primary",
          field: "debitos",
        },
        {
          name: "creditos",
          label: "CRÉDITO",
          headerClasses: "bg-primary",
          field: "creditos",
        },
        {
          name: "saldof",
          label: "SALDO FINAL",
          headerClasses: "bg-primary",
          field: "saldof",
        },
      ],
      totales: {
        inicial: 0,
        debito: 0,
        credito: 0,
        final: 0,
      },
      widthceltotales: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async exportarexcel() {
      let datos = {
        datos: this.data,
        mes_ini: this.model.mesini,
        mes_fin: this.model.mesfin,
        anio: this.model.año,
        totales: {
          totales: this.totales,
          ingresos: this.ingresos,
          gastos: this.gastos,
          resultados_uno: this.resultados_uno,
          activos: this.activos,
          total_pasivo_patrimonio: this.total_pasivo_patrimonio,
          resultado_dos: this.resultado_dos,
        },
      };
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_balance_prueba",
        datos
      ).then((resp) => {
        fileDownload(resp, "consulta_balance_prueba.xlsx");
      });
    },
    localizar(model) {
      if (model != null) {
        const result = this.data.filter((f) => f.codigo_id == model.value);
        if (result.length > 0) {
          var scroltr = null;
          this.$refs.table.$children.forEach((element) => {
            element.$el.className = "q-tr ";
            if (result[0].codigo == element.$el.firstChild.innerText) {
              element.$el.className = "q-tr bg-primary text-black";
              var container = element.$el;
              scroltr = container.offsetTop;
              if (scroltr < 100) {
                scroltr = 0;
              } else {
                scroltr = scroltr - 80;
              }
            }
          });
          this.$refs.table.$el.firstChild.scrollTop = scroltr;
        } else {
          // this.resetLocalizar();
          this.LInfo("info", "Dato no encontrado");
        }
      }
    },
    async consultar() {
      this.data = [];
      this.filter = null;
      var params = {
        model: this.model,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (this.model.mesini == null || this.model.mesfin == null  ){
          return this.LInfo('warning', 'Seleccionar un mes valido.')
        }else if( (this.model.mesini > this.model.mesfin) && this.model.consolidado ){
          return this.LInfo('warning', 'Seleccionar mes inicial menor o igual al mes final.')
        }
        
        if (validate) {
          this.data = await this.Post(
            "contabilidad/consultas/consulta_balance_prueba",
            params
          );
          if (this.data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          } else {
            this.totales = {
              inicial: 0,
              debito: 0,
              credito: 0,
              final: 0,
            };

            let sumador_sin = 0; //sumador total saldo inicial
            let sumador_deb = 0; //sumador total debitos
            let sumador_cre = 0; //sumador total creditos
            let sumador_fin = 0; //sumador total creditos
            this.data.forEach((element) => {
              switch (element.codigo) {
                case "1":
                  sumador_sin = sumador_sin + element.saldoi;
                  sumador_deb = sumador_deb + element.debitos;
                  sumador_cre = sumador_cre + element.creditos;
                  sumador_fin = sumador_fin + element.saldof;

                  this.activos.inicial = element.saldoi;
                  this.activos.debito = element.debitos;
                  this.activos.credito = element.creditos;
                  this.activos.final = element.saldof;
                  break;

                case "2":
                  sumador_sin = sumador_sin + element.saldoi * -1;
                  sumador_deb = sumador_deb + element.debitos;
                  sumador_cre = sumador_cre + element.creditos;
                  sumador_fin = sumador_fin + element.saldof * -1;

                  this.pasivo.inicial = element.saldoi;
                  this.pasivo.debito = element.debitos;
                  this.pasivo.credito = element.creditos;
                  this.pasivo.final = element.saldof;
                  break;

                case "3":
                  sumador_sin = sumador_sin + element.saldoi * -1;
                  sumador_deb = sumador_deb + element.debitos;
                  sumador_cre = sumador_cre + element.creditos;
                  sumador_fin = sumador_fin + element.saldof * -1;

                  this.patrimonio.inicial = element.saldoi;
                  this.patrimonio.debito = element.debitos;
                  this.patrimonio.credito = element.creditos;
                  this.patrimonio.final = element.saldof;
                  break;

                case "4":
                  sumador_sin = sumador_sin + element.saldoi * -1;
                  sumador_deb = sumador_deb + element.debitos;
                  sumador_cre = sumador_cre + element.creditos;
                  sumador_fin = sumador_fin + element.saldof * -1;

                  this.ingresos.inicial = element.saldoi;
                  this.ingresos.debito = element.debitos;
                  this.ingresos.credito = element.creditos;
                  this.ingresos.final = element.saldof;
                  break;

                case "5":
                  sumador_sin = sumador_sin + element.saldoi * -1;
                  sumador_deb = sumador_deb + element.debitos;
                  sumador_cre = sumador_cre + element.creditos;
                  sumador_fin = sumador_fin + element.saldof;

                  this.gastos.inicial = element.saldoi;
                  this.gastos.debito = element.debitos;
                  this.gastos.creditos = element.creditos;
                  this.gastos.final = element.saldof;
                  break;

                default:
                  break;
              }
            });
            /* fila totales */
            this.totales.inicial = sumador_sin;
            this.totales.debito = sumador_deb;
            this.totales.credito = sumador_cre;
            this.totales.final = sumador_fin;

            this.resultados_uno.ingr_gast_sin =
              this.ingresos.inicial * -1 - this.gastos.inicial;
            this.resultados_uno.ingr_gast_cr =
              this.ingresos.credito - this.gastos.credito;
            this.resultados_uno.ingr_gast_sfi =
              this.ingresos.final * -1 - this.gastos.final;
            this.resultados_uno.ingr_gast_deb =
              this.ingresos.debito * -1 - this.gastos.debito;

            this.total_pasivo_patrimonio.inicial =
              Math.abs(this.pasivo.inicial) + Math.abs(this.patrimonio.inicial);
            this.total_pasivo_patrimonio.debito =
              Math.abs(this.pasivo.debito) + Math.abs(this.patrimonio.debito);
            this.total_pasivo_patrimonio.credito =
              Math.abs(this.pasivo.credito) + Math.abs(this.patrimonio.credito);
            this.total_pasivo_patrimonio.final =
              Math.abs(this.pasivo.final) + Math.abs(this.patrimonio.final);

            this.resultado_dos.inicial =
              Math.abs(this.activos.inicial) -
              Math.abs(this.total_pasivo_patrimonio.inicial);
            this.resultado_dos.debito =
              Math.abs(this.activos.debito) -
              Math.abs(this.total_pasivo_patrimonio.debito);
            this.resultado_dos.credito =
              Math.abs(this.activos.credito) -
              Math.abs(this.total_pasivo_patrimonio.credito);
            this.resultado_dos.final =
              Math.abs(this.activos.final) - Math.abs(this.total_pasivo_patrimonio.final);

            try {
              setTimeout(() => {
                this.$refs.table.$children[0].$el.childNodes.forEach((element, i) => {
                  Object.keys(this.widthceltotales).forEach((key) => {
                    if (i == key) {
                      this.widthceltotales[`${key}`] = element.offsetWidth;
                    }
                  });
                });
              }, 1000);
            } catch (error) {}
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    // async asignarValor(caso, valor, opcion = null) {
    async asignarValor(model, opcion) {
      if (model != null) {
        // para filtrar por codigo se toma del label el valor del codigo
        if (opcion == 1) {
          let codigonombre = model.label.split(" ");
          this.model.codigonom.codigo1 =  model.model.codigol;
        } else {
          let codigonombre = model.label.split(" ");
          this.model.codigonom.codigo2 =  model.model.codigol;
        }
          console.log("acaa",this.model,model.model.codigol);
      }
    },
    async fechaActual() {
      var fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = fecha.getMonth() + 1;
      this.model.mesfin = fecha.getMonth() + 1;
    },
    formatTable(caso, val, detalle = null) {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
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
          var valor = val;
          // if (valor < 0) {
          //   valor = valor * -1;
          // }
          return formatterPeso.format(valor);
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
          return "background-color: rgb(2520, 250, 210, 0.5); color: black;";
      }
    },
    async imprimirConsulta() {
      var params = {
        model: this.model,
        totales: {
          totales: this.totales,
          ingresos: this.ingresos,
          gastos: this.gastos,
          resultados_uno: this.resultados_uno,
          activos: this.activos,
          total_pasivo_patrimonio: this.total_pasivo_patrimonio,
          resultado_dos: this.resultado_dos,
        },
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post(
            "contabilidad/consultas/imprimir_consulta_balance_prueba",
            params
          );
          const url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimirconsulta.abrirmodal(this.pdfs, "BALANCE DE PRUEBA");
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
    "model.codigo"(val) {
      this.model.codigonom.codigo1 = val == null ? null : this.model.codigonom.codigo1;
    },
    "model.codigo2"(val) {
      this.model.codigonom.codigo2 = val == null ? null : this.model.codigonom.codigo2;
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fechaActual().then(() => {});
      }, 500);
    });
    setTimeout(() => {
      this.consultar();
    }, 1000);
  },
  async created() {
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
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0% 0%
    no-repeat padding-box !important;
}
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
  height: 480px

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
