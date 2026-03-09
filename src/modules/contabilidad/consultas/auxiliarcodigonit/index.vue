<template>
  <div>
    <q-form ref="Formconsulta" class="row q-pa-md">
      <l-select
        col="3"
        label="Auxiliares por *"
        v-model="model.tipo"
        :options="select_tipo_auxiliar"
        :clearable="false"
      />
      <l-input
        col="2"
        type="number"
        v-if="!model.rango_fecha"
        v-model="model.año"
        label="Año"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-if="!model.rango_fecha"
        v-model="model.mesini"
        label="Mes Inicio"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-select
        col="2"
        v-if="!model.rango_fecha"
        v-model="model.mesfin"
        label="Mes Fin"
        option-value="id"
        option-label="nombre"
        :options="meses"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-date
        v-if="model.rango_fecha"
        col="md-3"
        v-model="model.fechaini"
        label="Desde *"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <l-date
        v-if="model.rango_fecha"
        col="md-3"
        v-model="model.fechafin"
        label="Hasta *"
        :rules="[$rules.required($t('validator.required'))]"
      />
      <div class="q-mt-xs">
        <q-btn dense round color="primary" icon="search" @click="consultar">
          <q-tooltip>Buscar</q-tooltip>
        </q-btn>
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
              @click="imprimirConsulta(1, false)"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
          <div class="col" v-if="model.tipo == 2 || model.tipo == 6">
            <q-btn
              class="btnAcciones"
              round
              dense
              unelevated
              color="white"
              @click="imprimirConsulta(2, false)"
              :disable="data.length > 0 ? false : true"
            >
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir Extracto</q-tooltip>
            </q-btn>
          </div>
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
      <div class="col-12 q-mt-sm" v-if="model.tipo == 3">
        <div class="row">
          <div class="q-gutter-sm">
            <q-radio v-model="model.rango_fecha" :val="false" label="Por meses" />
            <q-radio v-model="model.rango_fecha" :val="true" label="Por rango de fecha" />
          </div>
        </div>
      </div>
      <div class="col-12 q-mt-sm" v-if="!mostrar_ocultar.cc">
        <div class="row">
          <q-checkbox
            v-model="model.ccosto"
            label="Centro de costos"
            :disable="mostrar_ocultar.cc"
          />
          <l-select
            label="Centro de costos *"
            v-model="model.idcc"
            col="2"
            option-value="id"
            option-label="codigo_nombre"
            :options="centro_costos"
            :rules="[$rules.required($t('validator.required'))]"
            @selected="asignarValor($event, 3)"
            v-if="!mostrar_ocultar.cc && model.ccosto == true"
          />
        </div>
      </div>
      <div class="col-12 q-mt-md" style="border-top: 2px solid lightgrey">
        <div class="row q-mt-md">
          <l-select-rest
            :url="(model.tipo == 3 || model.tipo == 7) ? 'contabilidad/mayor/selectnewall' : 'contabilidad/mayor/selectnew'"
            col="5"
            :label="(model.tipo == 3 || model.tipo == 7) ? 'Desde *' : 'Código'"
            v-model="model.codigo"
            ref="codigo"
            :rules="[
              model.tipo != 4 && model.tipo != 5
                ? $rules.required($t('validator.required'))
                : true,
            ]"
            @focus="extraerCuenta(model.codigo)"
            @emitselecte="asignarValor($event, 1, 1)"
            v-show="model.tipo != 4 && model.tipo != 5"
          />
          <l-select-rest
            col="5"
            url="tercero/personas/selectnew"
            label="Persona"
            v-model="model.persona"
            :rules="[
              (val) => asignarValor(2, val),
              model.tipo == 2 || model.tipo == 4 || model.tipo == 5 || model.tipo == 6
                ? $rules.required($t('validator.required'))
                : true,
            ]"
            v-show="
              model.tipo == 2 || model.tipo == 4 || model.tipo == 5 || model.tipo == 6 || model.tipo == 7
            "
            @emitselecte="asignarCorreos"
          />
          <l-select-rest
            :url="model.tipo == 3 ? 'contabilidad/mayor/selectnewall' : 'contabilidad/mayor/selectnew'"
            col="5"
            label="Hasta"
            v-model="model.codigo2"
            @focus="extraerCuenta(model.codigo2)"
            :rules="[true]"
            ref="codigo2"
            v-show="model.tipo == 3 || model.tipo == 7"
            @emitselecte="asignarValor($event, 1, 2)"
          />
          <l-select-rest
            url="contabilidad/concepto/selectnew"
            col="5"
            label="Concepto"
            v-model="model.concepto"
            :rules="[model.tipo == 7
                ? $rules.required($t('validator.required'))
                : true,]"
            ref="concepto"
            v-show="model.tipo == 7"

          />
          <l-select
            col="5 q-mt-md"
            label="Inmueble *"
            :clearable="true"
            v-model="model.inmueble_id"
            option-value="id"
            option-label="label"
            :options="inmuebles_asociados"
            :rules="[model.tipo == 6 ? $rules.required($t('validator.required')) : true]"
            v-show="model.tipo == 6"
          />
        </div>
      </div>
      <div class="col-12 q-mt-md">
        <q-table
          class="my-sticky-header-table2 qtablecon"
          :data="data"
          :columns="columns"
          row-key="nit"
          flat
          dense
          bordered
          virtual-scroll
          :hide-bottom="true"
          :rows-per-page-options="[0]"
          :pagination.sync="pagination"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th class="text-left">Tipo</q-th>
              <q-th class="text-left">Número</q-th>
              <q-th class="text-left">Fecha</q-th>
              <q-th class="text-left">Doc Ref</q-th>
              <q-th class="text-left">Concepto</q-th>
              <q-th class="text-left" v-if="model.tipo == 3">Nit</q-th>
              <q-th class="text-left" v-if="model.tipo == 3">Nombre</q-th>
              <q-th class="text-left">Detalle</q-th>
              <q-th class="text-right">Débito</q-th>
              <q-th class="text-right">Crédito</q-th>
              <q-th class="text-right">Saldo</q-th>
              <q-th class="text-right" v-if="filtro.incbase">Base</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :style="colorTable(props.row.color)">
              <q-td key="tipo" :props="props" style="text-align: left">
                {{ props.row.tipo }}
              </q-td>
              <q-td key="numero" :props="props" style="text-align: left">
                <span class="cursor-pointer" @click="verdocumentos(props.row.numero, props.row.fuentes_id, props.row.id, false)">
                  {{ props.row.numero }}
                  <q-tooltip>Ver documento</q-tooltip>
                </span>
              </q-td>
              <q-td key="ref" :props="props" style="text-align: left">
                {{ props.row.docref }}
              </q-td>
              <q-td key="fecha" :props="props" style="text-align: left">
                {{ props.row.fecha }}
              </q-td>
              <q-td key="docref" :props="props" style="text-align: left">
                {{ props.row.docref }}
              </q-td>
              <q-td key="concepto" :props="props" style="text-align: left">
                {{ props.row.concepto }}
              </q-td>
              <q-td
                v-if="model.tipo == 3"
                key="nit"
                :props="props"
                style="text-align: left !important"
                class="white-space"
              >
                {{ props.row.nits }}
              </q-td>
              <q-td
                v-if="model.tipo == 3"
                key="nombre"
                :props="props"
                style="text-align: left !important; width: 300px"
                class="white-space"
              >
                {{ props.row.nombre }}
                
              </q-td>
              <q-td
                key="detalle"
                :props="props"
                style="text-align: left !important; width: 500px"
                class="white-space"
              >
                {{ truncarTexto(props.row.detalle, 100) }}
              </q-td>
              <q-td key="valor_db" :props="props">
                {{
                  props.row.tipo != null &&
                  props.row.numero != null &&
                  props.row.fecha != null &&
                  props.row.concepto != null
                    ? formatTable(2, props.row.valor_db)
                    : formatTable(3, props.row.valor_db, props.row.detalle)
                }}
              </q-td>
              <q-td key="valor_cr" :props="props">
                {{
                  props.row.tipo != null &&
                  props.row.numero != null &&
                  props.row.fecha != null &&
                  props.row.concepto != null
                    ? formatTable(2, props.row.valor_cr)
                    : formatTable(3, props.row.valor_cr, props.row.detalle)
                }}
              </q-td>
              <q-td key="saldo" :props="props">
                <div class="row">
                  <div class="col">
                    <span>
                      {{
                        props.row.tipo != null &&
                        props.row.numero != null &&
                        props.row.fecha != null &&
                        props.row.concepto != null
                          ? formatTable(2, props.row.saldo)
                          : formatTable(3, props.row.saldo, props.row.detalle)
                      }}
                    </span>
                  </div>
                  <div class="col-auto q-ml-md" v-if="[2, 6].includes(model.tipo) && is_superuser">
                    <q-icon class="cursor-pointer" size="sm" v-if="props.row.mov_id != null && [cta_prop_id, cta_admon_id].includes(props.row.mayor_id)" @click="accionPagos(props.row)">
                      <svg v-if="props.row.pagado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 12V9C4 11.2 7.6 13 12 13S20 11.2 20 9V12C20 12.5 19.8 12.9 19.5 13.4C18.7 13.1 17.9 13 17 13C14.5 13 12.1 14.1 10.6 15.9C6.8 15.6 4 14 4 12M12 11C16.4 11 20 9.2 20 7S16.4 3 12 3 4 4.8 4 7 7.6 11 12 11M9.1 19.7L8.8 19L9.1 18.3C9.2 18.1 9.3 18 9.3 17.8C6.2 17.2 4 15.8 4 14V17C4 18.8 6.4 20.3 9.7 20.8C9.5 20.5 9.3 20.1 9.1 19.7M17 18C16.4 18 16 18.4 16 19S16.4 20 17 20 18 19.6 18 19 17.6 18 17 18M23 19C22.1 21.3 19.7 23 17 23S11.9 21.3 11 19C11.9 16.7 14.3 15 17 15S22.1 16.7 23 19M19.5 19C19.5 17.6 18.4 16.5 17 16.5S14.5 17.6 14.5 19 15.6 21.5 17 21.5 19.5 20.4 19.5 19Z" /></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.1 10.9L7.1 3.9C8.4 3.3 10.1 3 12 3C16.4 3 20 4.8 20 7C20 8.9 17.5 10.4 14.1 10.9M16.2 13H17C17.9 13 18.7 13.1 19.5 13.4C19.8 13 20 12.5 20 12V9C20 10.5 18.3 11.9 15.7 12.5L16.2 13M18.4 15.2L22.8 19.6C22.9 19.4 23 19.2 23.1 19.1C22.2 17.1 20.5 15.6 18.4 15.2M22.1 21.5L20.8 22.8L20.2 22.2C19.2 22.7 18.1 23.1 17 23.1C14.3 23.1 11.9 21.4 11 19.1C11.6 17.7 12.6 16.6 13.9 15.9L12.4 14.4C11.7 14.8 11.1 15.4 10.5 16C6.8 15.6 4 14 4 12V9C4 11.1 7.1 12.7 11.1 13L8.8 10.7C6 10 4 8.6 4 7C4 6.7 4.1 6.4 4.2 6.1L1.1 3L2.4 1.7L22.1 21.5M18.8 20.7L17.7 19.6C17.6 19.9 17.3 20 17 20C16.4 20 16 19.6 16 19C16 18.7 16.1 18.4 16.4 18.2L15.3 17.1C14.8 17.6 14.5 18.2 14.5 18.9C14.5 20.3 15.6 21.4 17 21.4C17.7 21.5 18.4 21.2 18.8 20.7M8.8 19L9.1 18.3C9.2 18.1 9.3 18 9.3 17.8C6.2 17.2 4 15.8 4 14V17C4 18.8 6.4 20.3 9.7 20.8C9.5 20.5 9.3 20.1 9.2 19.7L8.8 19Z" /></svg>
                      <q-tooltip>{{!props.row.pagado ? 'Marcar como pagado (Ocultar en el pago)' : 'Pendiente por pagar (Mostrar en el pago)'}}</q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-td>
              <q-td key="base" :props="props" v-if="filtro.incbase">
                {{ formatTable(2, props.row.base) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <imprimirconsulta ref="imprimirconsulta" :email="email" @enviarCorreo="enviarCorreo" :enviar_correo="enviar_correo" />
    </q-form>
    <div class="q-px-md q-py-lg" style="background-color: #f1f7fc">
      <div class="q-mt-sm" v-if="show_filtros">
        <q-checkbox
          size="sm"
          class="q-mr-sm"
          v-model="filtro.incnitsinsal"
          label="Incluir nits con saldos iguales a cero"
        />
        <q-checkbox
          size="sm"
          class="q-mr-sm"
          v-model="filtro.incnitsinmov"
          label="Incluir nits sin movimiento en el periodo"
        />
        <q-checkbox
          size="sm"
          class="q-mr-sm"
          v-model="filtro.incbase"
          label="Incluir base"
        />
      </div>
      <div class="row q-mt-sm">
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
    <verdocumentos ref="verdocumentos" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
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
      optionsconceptos: [],
      select_tipo_auxiliar: [
        { id: 1, nombre: "Código clasificado por nit" },
        { id: 2, nombre: "Código y nit" },
        { id: 3, nombre: "Código" },
        { id: 4, nombre: "Nit/Cuenta" },
        { id: 5, nombre: "Nit" },
        { id: 6, nombre: "Código, nit e Inmueble" },
        { id: 7, nombre: "Código, nit y concepto" },
      ],
      shape: null,
      pagination: {
        rowsPerPage: 0,
      },
      conta_centavos: 0,
      model: {
        tipo: 1,
        ccosto: false,
        idcc: null,
        año: null,
        mesini: null,
        mesfin: null,
        fechaini: null,
        fechafin: null,
        codigo: null,
        codigo2: null,
        nommayor: null,
        nommayor2: null,
        persona: null,
        nompersona: null,
        ccpersona: null,
        cccodigo: null,
        ccnombre: null,
        rango_fecha:false,
        codigonom: {
          nombre1: null,
          nombre2: null,
        },
        inmueble_id: null,
        concepto: null,
      },
      email: null,
      enviar_correo: false,
      filtro: {
        incdocanul: false,
        incnitsinsal: true,
        incnitsinmov: true,
        incbase: false,
      },
      mostrar_ocultar: {
        form: false,
        cc: true,
      },
      centro_costos: [],
      mayor: [],
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
        summovbase: 0,
      },
      pdfs: { path: null },
      data: [],
      inmuebles_asociados: [],
      show_filtros: true,
      columns: [
        {
          name: "tipo",
          label: "Tipo",
          align: "left",
          field: "tipo",
        },
        {
          name: "numero",
          label: "Número",
          align: "left",
          field: "numero",
        },
        {
          name: "fecha",
          label: "Fecha",
          field: "fecha",
        },
        {
          name: "docref",
          label: "Doc Ref",
          field: "docref",
        },
        {
          name: "concepto",
          label: "Concepto",
          field: "concepto",
        },
        {
          name: "nit",
          label: "Nit",
          field: "nits",
          align: "left",
        },
        {
          name: "nombre",
          label: "Nombre",
          field: "nombre",
          align: "left",
        },
        {
          name: "detalle",
          label: "Detalle",
          field: "detalle",
          align: "left",
        },
        {
          name: "valor_db",
          label: "Débito",
          field: "valor_db",
        },
        {
          name: "valor_cr",
          label: "Crédito",
          field: "valor_cr",
        },
        {
          name: "saldo",
          label: "Saldo",
          field: "saldo",
        },
        {
          name: "base",
          label: "Base",
          field: "base",
        },
      ],
      is_superuser: this.$store.getters["auth/user"].is_superuser
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    ...mapState("parametros", ["centavos_contabilidad", "cta_prop_id", "cta_admon_id"]),
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    ...mapActions("parametros", ["getProcesos"]),
    enviarCorreo(email) {
      this.email = email;
      this.imprimirConsulta(2, true);
    },
    async getConceptos(){
      this.optionsconceptos = await this.Get("contabilidad/concepto/select");
    },
    asignarCorreos(model) {
      if (model != null) {
        if (model.modelo.email != null && model.modelo.email != "") {
          this.email = model.modelo.email;
        }
        if (
          model.modelo.emails_adicionales != null &&
          model.modelo.emails_adicionales != ""
        ) {
          if (this.email != null) {
            this.email = `${this.email};${model.modelo.emails_adicionales}`;
          } else {
            this.email = model.modelo.emails_adicionales;
          }
        }
        this.asignarValor(model, 2);
      }
    },
    async exportarexcel() {
      var params = {
        model: this.model,
        data: this.data,
        filtro: this.filtro,
        sumas: this.detalle,
        tipo: this.model.tipo,
      };
      await this.PostDownload(
        "contabilidad/consultas/exportar_consulta_filtro_aux",
        params
      ).then((resp) => {
        let nombrefile = "";
        if (this.model.tipo == 1) {
          nombrefile = "consulta_codigo_clasificado_por_nit.xlsx";
        } else if (this.model.tipo == 2) {
          nombrefile = "consulta_codigo_y_nit.xlsx";
        } else if (this.model.tipo == 3) {
          nombrefile = "consulta_codigo.xlsx";
        } else if (this.model.tipo == 4) {
          nombrefile = "consulta_nit_y_cuenta.xlsx";
        } else if (this.model.tipo == 5) {
          nombrefile = "consulta_nit.xlsx";
        }else if (this.model.tipo == 6) {
          nombrefile = "consulta_nit_e_inmueble.xlsx";
        } else if (this.model.tipo == 7) {
          nombrefile = "consulta_codigo_nit_concepto.xlsx";
          
        }
        fileDownload(resp, nombrefile);
      });
    },
    remplazarmes(text) {
      if (text == null) return text;
      const map = {
        january: "ENERO",
        february: "FEBRERO",
        march: "MARZO",
        april: "ABRIL",
        may: "MAYO",
        june: "JUNIO",
        july: "JULIO",
        august: "AGOSTO",
        september: "SEPTIEMBRE",
        october: "OCTUBRE",
        november: "NOVIEMBRE",
        december: "DICIEMBRE",
      };
      return String(text).replace(
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
        (m) => map[m.toLowerCase()] || m
      );
    },
    async consultar() {
      let fecha_in_tem = null;
      let fecha_fn_tem = null;
      if(this.model.rango_fecha){
        const formatoFecha = (fecha) => {
          if (!fecha || !fecha.includes('/')) {
            return fecha; 
          }
          const partes = fecha.split('/');          
          if (partes.length !== 3) {
            return fecha;
          }

          const [dia, mes, año] = partes;
          return `${año}-${mes}-${dia}`;
        };
        fecha_in_tem =this.model.fechaini 
        fecha_fn_tem =this.model.fechafin 
        this.model.fechaini = formatoFecha(this.model.fechaini);
        this.model.fechafin = formatoFecha(this.model.fechafin);
      }
      var params = {
        model: this.model,
        filtro: this.filtro,
      };
      var resul = {
        sumsaldos: [],
        summov: [],
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          this.data = await this.Post(
            "contabilidad/consultas/consulta_filtro_aux",
            params
          );
          if (this.data.length == 0) {
            this.LInfo("info", "No hay información para mostrar");
          }
          const filtro = this.data.filter((filter) => filter.color == 0);
          var sumdb = 0;
          var sumcr = 0;
          var sumbase = 0;
          filtro.forEach((element) => {
            sumdb = sumdb + element.valor_db;
            sumcr = sumcr + element.valor_cr;
            sumbase = sumbase + element.base;
          });
          resul.summov.push(sumdb);
          resul.summov.push(sumcr);

          // Cuando es tipo 7 (Código, nit y concepto) los saldos inicial/final no vienen del endpoint consulta_saldos_aux
          // y deben calcularse a partir de las filas especiales "SALDO A ..." retornadas por el procedimiento getauxcodnitconc.
          if (this.model.tipo == 7) {
            const isSaldoRow = (r) => r && r.detalle && r.detalle.toString().startsWith("SALDO ");
            const saldosIniRows = this.data.filter(
              (r) => isSaldoRow(r) && r.ordenf && r.ordenf.toString().startsWith("2000-01-01")
            );
            const saldosFinRows = this.data.filter(
              (r) => isSaldoRow(r) && r.ordenf && r.ordenf.toString().startsWith("2099-01-01")
            );

            const saldoIni = saldosIniRows.reduce(
              (acc, r) => acc + (Number(r.valor_db || 0) - Number(r.valor_cr || 0)),
              0
            );
            const saldoFin = saldosFinRows.reduce(
              (acc, r) => acc + (r.saldo != null ? Number(r.saldo) : (Number(r.valor_db || 0) - Number(r.valor_cr || 0))),
              0
            );

            this.detalle.saldoinidb = saldoIni > 0 ? saldoIni : 0;
            this.detalle.saldoinicr = saldoIni < 0 ? saldoIni * -1 : 0;
            this.detalle.saldofindb = saldoFin > 0 ? saldoFin : 0;
            this.detalle.saldofincr = saldoFin < 0 ? saldoFin * -1 : 0;
            this.detalle.summovbase = sumbase;
            this.detalle.summovdb = sumdb;
            this.detalle.summovcr = sumcr;

            if(this.model.rango_fecha){
              this.model.fechaini = fecha_in_tem;
              this.model.fechafin = fecha_fn_tem;
            }
            return;
          }

          const data = await this.Post(
            "contabilidad/consultas/consulta_saldos_aux",
            params
          );
          if(this.model.rango_fecha){
            this.model.fechaini = fecha_in_tem;
            this.model.fechafin = fecha_fn_tem;
          }
          resul.sumsaldos = data.sumsaldos;
          if (this.model.tipo == 6) {
            if (this.model.mesini == this.model.mesfin) {
              this.detalle.saldoinidb = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : 0;
              this.detalle.saldoinicr = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : resul.sumsaldos[0] * -1;
              this.detalle.saldofindb = resul.sumsaldos[1] > 0 ? resul.sumsaldos[1] : resul.sumsaldos[1] * -1;
              this.detalle.saldofincr = resul.sumsaldos[1] > 0 ? resul.sumsaldos[1] : resul.sumsaldos[1] * -1;
            }
          } else {
            this.detalle.saldoinidb = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : resul.sumsaldos[0] * -1;
            this.detalle.saldofincr = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : resul.sumsaldos[0] * -1;
          }

          // this.detalle.saldoinidb = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : 0;
          // this.detalle.saldoinidb = this.data.filter((filter) => filter.color == 3 && filter.id != '99').reduce((sum, item) => sum + item.valor_db, 0)
          this.detalle.saldoinidb = resul.sumsaldos[0] > 0 ? resul.sumsaldos[0] : 0
          this.detalle.saldoinicr = resul.sumsaldos[0] < 0 ? resul.sumsaldos[0] * -1 : 0
          this.detalle.summovdb = resul.summov[0];
          this.detalle.summovcr = resul.summov[1];

          if (this.model.tipo != 4 && this.model.tipo != 5 ) {
            // this.detalle.saldoinicr =
            //   resul.sumsaldos[0] < 0 ? resul.sumsaldos[0] * -1 : 0;
            // this.detalle.saldoinicr = this.data.filter((filter) => filter.color == 3 && filter.id == '99').reduce((sum, item) => sum + item.saldo, 0)
            this.detalle.saldofindb = resul.sumsaldos[1] > 0 ? resul.sumsaldos[1] : 0;
            this.detalle.saldofincr = resul.sumsaldos[1] < 0 ? resul.sumsaldos[1] * -1 : 0;
          } else {
              this.detalle.saldofindb = this.detalle.summovdb > this.detalle.summovcr
                  ? this.detalle.summovdb - this.detalle.summovcr + resul.sumsaldos[0]
                  : 0;
              this.detalle.saldofincr = this.detalle.summovcr > this.detalle.summovdb
                  ? this.detalle.summovcr - this.detalle.summovdb + resul.sumsaldos[0]
                  : 0;
          }
          if (this.model.tipo == 3){
              let temp_saldoinidb = this.data.filter((filter) => filter.color == 3 && filter.id != '99').reduce((sum, item) => sum + item.saldo, 0)
              this.detalle.saldoinidb = temp_saldoinidb > 0 ? temp_saldoinidb : 0;
              this.detalle.saldoinicr = temp_saldoinidb < 0 ? temp_saldoinidb * -1 : 0;
              this.detalle.saldofindb = resul.sumsaldos[1] > 0 ? resul.sumsaldos[1] : 0;
              this.detalle.saldofincr = resul.sumsaldos[1] < 0 ? resul.sumsaldos[1] * -1 : 0;
          }
          this.detalle.summovbase = sumbase;
          this.detalle.summovdb = resul.summov[0];
          this.detalle.summovcr = resul.summov[1];
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    fechaActual(val=null) {
      var fecha = new Date(Date.now());
      this.model.año = fecha.getFullYear();
      this.model.mesini = fecha.getMonth() + 1;
      this.model.mesfin = fecha.getMonth() + 1;
      const formatoFecha = (fecha) => {
        let dia = fecha.getDate().toString().padStart(2, '0'); 
        let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');  
        let año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
      };
      this.model.fechaini = formatoFecha(fecha);
      this.model.fechafin = formatoFecha(fecha);

    },
    // async asignarValor(caso, valor, opcion = null) {
    async asignarValor(model, caso, opcion = null) {
      if (model != null) {
        switch (caso) {
          case 1:
            if (opcion == 1) {
              this.model.nommayor = model.model.nombrel;
              this.model.codigonom.nombre1 = model.model.codigol.toString();
            } else {
              if (model != 2){
                this.model.nommayor2 = model.model.nombrel;
                this.model.codigonom.nombre2 = model.model.codigol.toString();
              }
            }
            break;
          case 2:
            this.model.nompersona = model.modelo.n_completo;
            this.model.ccpersona = model.modelo.documento;
            let inmuebles_asociados = model.modelo.inmuebles_asociados.map((el) => ({...el, label: el.contrato ? el.contrato.label : el.label}));
            this.inmuebles_asociados = inmuebles_asociados;
            break;
          case 3:
            this.model.cccodigo = model.codigo;
            this.model.ccnombre = model.nombre;
            break;
          case 4:
            this.model.cccodigo = model.codigo;
            this.model.ccnombre = model.nombre;
            break;
        }
      }
    },
    formatTable(caso, val, detalle = null) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: this.conta_centavos,
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
    async imprimirConsulta(tipo = 1, send_correo = false) {
      if (tipo == 2) {
        this.enviar_correo = true;
      } else {
        this.enviar_correo = false;
      }
      var params = {
        model: this.model,
        filtro: this.filtro,
        sumas: this.detalle,
        tipo_impresion: tipo,
        enviar_correo: send_correo,
        email: this.email,
      };
      try {
        const validate = await this.$refs.Formconsulta.validate();
        if (validate) {
          let data = await this.Post(
            "contabilidad/consultas/imprimir_consulta_aux",
            params
          );
          if (send_correo == true) {
            this.LInfo("success", "Correo enviado correctamente.");
          } else {
            const url = window.URL.createObjectURL(
              new Blob([data], { type: "application/pdf" })
            );
            this.pdfs.path = url;
            this.$refs.imprimirconsulta.abrirmodal(this.pdfs, this.model.tipo);
          }
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getMayor() {
      try {
        const data = await this.Get("contabilidad/mayor");
        this.mayor = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.model.ccosto = false;
      this.model.idcc = null;
      this.model.codigo = null;
      this.model.codigo2 = null;
      this.model.nommayor = null;
      this.model.nommayor2 = null;
      this.model.persona = null;
      this.model.nompersona = null;
      this.model.ccpersona = null;
      this.model.cccodigo = null;
      this.model.ccnombre = null;
      this.model.codigonom = {
        nombre1: null,
        nombre2: null,
      };
      this.model.inmueble_id = null;
      this.filtro = {
        incdocanul: false,
        incnitsinsal: true,
        incnitsinmov: true,
        incbase: false,
      };
    },
    async getCentroCosto() {
      await this.Get("contabilidad/centrocostos", { tipo: "C" }).then((resp) => {
        this.centro_costos = resp;
      });
    },
    truncarTexto(texto, limite) {
      let texto_trunc = this.remplazarmes(texto);
      if (texto_trunc.length > limite) {
        return texto_trunc.substring(0, limite) + "...";
      }
      return texto_trunc;
    },
    async verdocumentos(documento, tipo_documento, id_doc, editar) {
      this.$refs.verdocumentos.abrirmodal(
        documento,
        tipo_documento,
        id_doc,
        editar
      );
    },
    accionPagos(val) {
      let msg = `Está seguro de realizar la acción de: "${!val.pagado ? 'Marcar como pagado (Ocultar en el pago)' : 'Pendiente por pagar (Mostrar en el pago)'}", del movimiento ${val.numero} ${Math.abs(val.valor_cr) > 0 ? this.formatTable(2, Math.abs(val.valor_cr)) : this.formatTable(2, Math.abs(val.valor_db))}.`;
      this.LConfim(msg, async () => {
        const resp = await this.Post("contrato/pagos/acciones_movimientos_pago", val);
        this.LConfimOK("success", resp.msg, () => {
          val.pagado = !val.pagado;
        }, false);
      },
      () => {});
    }
  },
  watch: {
    "model.rango_fecha"(val){
      this.data = [];
    },  
    "model.persona"(val) {
      this.inmuebles_asociados = [];
      this.model.inmueble_id = null;
    },
    "model.tipo"(val) {
      this.onReset();
      if(val!=3){
        this.model.rango_fecha = false;
      }
      if (val == 1) {
        this.mostrar_ocultar.form = false;
        this.mostrar_ocultar.cc = true;
        this.show_filtros = true;
      } else if (val == 2) {
        this.mostrar_ocultar.form = true;
        this.mostrar_ocultar.cc = true;
        this.show_filtros = false;
      } else if (val == 3) {
        this.mostrar_ocultar.form = true;
        this.mostrar_ocultar.cc = false;
        this.show_filtros = false;
        
        setTimeout(() => {
          this.$refs.codigo.eventclearable();
          this.$refs.codigo2.eventclearable();
        }, 200);
      } else if (val == 4) {
        this.mostrar_ocultar.form = true;
        this.mostrar_ocultar.cc = false;
        this.show_filtros = false;
      } else if (val == 5) {
        this.mostrar_ocultar.form = true;
        this.mostrar_ocultar.cc = true;
        this.show_filtros = false;
      } else if (val == 6) {
        this.mostrar_ocultar.form = true;
        this.mostrar_ocultar.cc = true;
        this.show_filtros = false;
      }
      this.model.idcc = null;
      this.model.ccosto = false;
      this.data = [];
      this.filtro = {
        incdocanul: false,
        incnitsinsal: true,
        incnitsinmov: true,
        incbase: false,
      };
    },
    "model.codigo"(val) {
      if (val == null) {
        this.model.nommayor = null;
        this.detalle.general = null;
        this.detalle.genenom = null;
        this.detalle.aux1 = null;
        this.detalle.aux1nom = null;
        this.detalle.aux2 = null;
        this.detalle.aux2nom = null;
        this.model.codigonom.nombre1 = null;
        this.data = [];
      } else {
        if (typeof val == "number") {
          this.extraerCuenta(val);
        }
      }
    },
    "model.codigo2"(val) {
      if (val == null) {
        this.model.nommayor2 = null;
        this.detalle.general = null;
        this.detalle.genenom = null;
        this.detalle.aux1 = null;
        this.detalle.aux1nom = null;
        this.detalle.aux2 = null;
        this.detalle.aux2nom = null;
        this.model.codigonom.nombre2 = null;
        this.data = [];
      } else {
        if (typeof val == "number") {
          this.extraerCuenta(val);
        }
      }
    },
    "model.ccosto"(val) {
      if (val == false) {
        this.model.idcc = null;
        this.model.cccodigo = null;
        this.model.ccnombre = null;
        this.data = [];
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
    this.getCentroCosto();
    this.getMayor();
    this.getProcesos("008");
    this.getConceptos();
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
.bold input {
  font-weight: bold;
}
.q-table td.white-space {
  white-space: normal !important;
}
.max_width_tooltip {
  width: 100px;
}
</style>
<style lang="sass">
.my-sticky-header-table2
  /* height or max-height is important */
  min-height: 10vh
  max-height: 45vh

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
