<template>
  <div class="">
    <q-form
      class="formcontabilizacion"
      ref="formcontabilizacion"
    >
      <q-table
        class="my-sticky-header-table-conta estiloconta"
        :data="grid"
        :columns="columns"
        row-key="name"
        flat
        dense
        :pagination.sync="pagination"
        style="max-height: 380px; background: white; border: 2px solid #f9f9f9"
      >
        >
        <template v-slot:body="props">
          <q-tr @click.native="onRowClick(props.row)">
            <q-td class="qtd">
              <div class="row" style="width: 150px">
                <l-select-rest
                  col="12 q-mt-sm"
                  url="contabilidad/contabilizacion/cuentas/selectnew"
                  v-model="props.row.mayor_id"
                  @keydown="AddRow($event, props.rowIndex)"
                  :clearable="false"
                  :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`"
                  :rules="[!validate_doc_soporte ? $rules.required($t('validator.required')) : true]"
                  :readonly="estado || props.row.pago_id != null"
                  @click.native="onRowClick(props.row)"
                  @blur="validacionInmueblesAsociados(props.rowIndex, 1, $event)"
                  @emitselecte="validarConta(1, props.rowIndex, $event)"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="row" style="width: 320px">
                <l-select-rest
                  col="12 q-mt-sm"
                  url="contabilidad/contabilizacion/personas/selectnew"
                  v-model="props.row.persona_id"
                  @keydown="AddRow($event, props.rowIndex)"
                  @focus="inputfocus(1, props.rowIndex, $event)"
                  :clearable="false"
                  :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`"
                  :rules="[!validate_doc_soporte ? $rules.required($t('validator.required')) : true]"
                  :readonly="estado || props.row.pago_id != null"
                  ref="selectrest"
                  @click.native="onRowClick(props.row)"
                  @blur="validacionInmueblesAsociados(props.rowIndex, 2, $event)"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="row" style="width: 150px; padding-bottom: 5px !important">
                <l-select
                  col="12 q-mt-sm"
                  v-model="props.row.concepto_id"
                  option-value="id"
                  option-label="codigo_nombre"
                  :options="conceptos_conta"
                  :rules="[
                    !validate_doc_soporte
                      ? $rules.required($t('validator.required'))
                      : true,
                  ]"
                  @focus="inputfocus(2, props.rowIndex, $event)"
                  :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`"
                  :readonly="estado"
                  @selected="validarInput($event, 3, props.rowIndex)"
                  @click.native="onRowClick(props.row)"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="q-px-sm" style="width: 280px">
                <l-input
                  @input="Detalle(props.rowIndex)"
                  @focus="Detalle($event)"
                  @keydown="AddRow($event, props.rowIndex)"
                  v-model="props.row.detalle"
                  col="12 q-mt-sm"
                  type="textarea"
                  rows="1"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                  style_input="font-size: 11px !important"
                  :rules="[!validate_doc_soporte ? $rules.required($t('validator.required')) : true]"
                  :readonly="estado"
                  @click.native="onRowClick(props.row)"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div
                class="row"
                style="width: 125px"
                @keydown="AddRow($event, props.rowIndex)"
              >
                <l-money
                  v-model="props.row.valordb"
                  col="12 q-mt-sm"
                  prefijo="$ "
                  sufijo=""
                  :precision="centavos_contabilidad == true ? 2 : 0"
                  @keydown="AddRow($event, props.rowIndex)"
                  :rules="[(val) => val >= 0, (val) => validarInput(null, 8, props.rowIndex)]"
                  :readonly="(props.rowIndex == 0 && tipodocumento < 3 ? true : false) || estado || props.row.pago_id != null"
                  @blur="recalcularValores(), validarValores(1, props.rowIndex)"
                  @click.native="onRowClick(props.row)"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div
                class="row"
                style="width: 125px"
                @keydown="AddRow($event, props.rowIndex)"
              >
                <l-money
                  v-model="props.row.valorcr"
                  col="12 q-mt-sm"
                  prefijo="$ "
                  sufijo=""
                  :precision="centavos_contabilidad == true ? 2 : 0"
                  @keydown="AddRow($event, props.rowIndex)"
                  :rules="[
                    (val) => val >= 0,
                    (val) => validarInput(null, 8, props.rowIndex),
                  ]"
                  @blur="recalcularValores(), validarValores(2, props.rowIndex)"
                  :readonly="(props.rowIndex == 0 && tipodocumento == 2 ? true : false) || estado || props.row.pago_id != null"
                  @click.native="onRowClick(props.row)"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="row q-px-sm" style="width: 120px">
                <l-input
                  col="12 text-black q-mt-sm"
                  v-model="props.row.docref"
                  @keydown="AddRow($event, props.rowIndex)"
                  :readonly="estado"
                  @click.native="onRowClick(props.row)"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                  :rules="[true]"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div
                class="row"
                style="width: 125px"
                @keydown="AddRow($event, props.rowIndex)"
              >
                <l-money
                  v-model="props.row.base"
                  col="12 q-mt-sm"
                  prefijo="$ "
                  sufijo=""
                  :precision="centavos_contabilidad == true ? 2 : 0"
                  @keydown="AddRow($event, props.rowIndex)"
                  :rules="[(val) => validarInput(null, 5, props.rowIndex)]"
                  :readonly="estado"
                  @click.native="onRowClick(props.row)"
                  :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="row" style="width: 150px">
                <l-select
                  col="12 q-mt-sm"
                  v-model="props.row.cc_id"
                  option-value="id"
                  option-label="codigo_nombre"
                  :options="centro_costos"
                  @keydown="AddRow($event, props.rowIndex)"
                  :class_input="`evitclick ${
                    estado ? 'text-weight-bold text-black' : ''
                  }`"
                  :rules="[(val) => validarInput(null, 6, props.rowIndex)]"
                  :readonly="estado"
                  @click.native="onRowClick(props.row)"
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <div class="row" style="width: 325px">
                <l-select-rest
                  col="12 q-mt-sm"
                  url="contabilidad/contabilizacion/personas/selectnew"
                  v-model="props.row.tercero_id"
                  @keydown="AddRow($event, props.rowIndex)"
                  :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`"
                  :readonly="estado"
                  ref="selectrest"
                  @click.native="onRowClick(props.row)"
                  :rules="
                    props.row.mayor_id == cta_prop_id
                      ? [$rules.required($t('validator.required'))]
                      : [true]
                  "
                />
              </div>
            </q-td>
            <q-td auto-width class="qtd">
              <!-- Nelson Lugo, solo se muestra para contabilidad de tipo inmobiliaria -->
              <div class="row" style="width: 325px">
                <l-select-rest
                  col="12"
                  v-model="props.row.inmu_id"
                  url="contabilidad/contabilizacion/inmuebles/selectnew"
                  :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`"
                  @keydown="AddRow($event, props.rowIndex)"
                  @click.native="onRowClick(props.row)"
                  :rules="!estado ?
                    props.row.mayor_id == cta_prop_id ||
                    props.row.mayor_id == cta_arr_id ||
                    props.row.mayor_id == cta_admon_id
                      ? [$rules.required($t('validator.required'))]
                      : [true]
                    : [true]
                  "
                  :readonly="estado || props.row.pago_id != null"
                  @blur="validacionInmueblesAsociados(props.rowIndex, 3, $event)"
                />
              </div>
            </q-td>
            <q-td auto-width class="text-center qtd">
              <div class="flex items-center justify-end q-pb-md" style="width: 155px; padding-right: 5px" v-if="props.row.pago_id == null && props.row.pagado == false">
                <q-btn
                  class="q-mr-sm"
                  color="grey-5"
                  dense
                  size="xs"
                  unelevated
                  icon="mdi-format-list-bulleted"
                >
                  <q-tooltip>
                    <label>Detalle</label><br />
                    {{ detalle.general }}<br />
                    {{ detalle.aux1 }}<br />
                    {{ detalle.aux2 }}<br />
                    <hr />
                    <label class="text-weigh-bold">Concepto: </label>
                    {{ detalle.concepto }}<br />
                    <label>Centro de gestión: </label> {{ detalle.centrogestion
                    }}<br />
                    <label>Línea de servicio: </label>
                    {{ detalle.lineaservicio }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  class="q-mr-sm"
                  color="primary"
                  dense
                  round
                  unelevated
                  icon="delete"
                  @click="DeleteRow(props.rowIndex)"
                  v-if="grid.length > 1 && !estado"
                  :disable="estado"
                >
                  <q-tooltip>Quitar</q-tooltip>
                </q-btn>
                <q-btn
                  class="q-mr-sm"
                  round
                  dense
                  color="primary"
                  unelevated
                  icon="add"
                  @click="AddRow($event, props.rowIndex)"
                  v-if="grid.length - 1 == props.rowIndex && !estado"
                  :disable="estado"
                >
                  <q-tooltip>Agregar</q-tooltip>
                </q-btn>
                <q-btn dense unelevated round color="primary" @click="props.row.es_novedad = !props.row.es_novedad" v-if="validar_cta_arre(props.row)" :disable="estado">
                  <q-icon :name="props.row.es_novedad == true ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" />
                  <q-tooltip>Incluir en cupón</q-tooltip>
                </q-btn>
              </div>
              <div v-else>
                <q-badge label="Pago" />
                <q-tooltip>Este movimiento tiene un pago asociado, no se puede editar o eliminar.</q-tooltip>
              </div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:pagination="scope">
          <div class="q-mr-sm"><span class="q-mr-xs">pagina:</span><strong>{{ pagination.page }}</strong> / {{ pagesNumber }}</div>
          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            size="sm"
            flat
            :disable="scope.isFirstPage"
            @click="paginacion('primera')"
          />
          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            size="sm"
            flat
            :disable="scope.isFirstPage"
            @click="paginacion('anterior')"
          />
          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            size="sm"
            flat
            :disable="scope.isLastPage"
            @click="paginacion('siguiente')"
          />
          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            size="sm"
            flat
            :disable="scope.isLastPage"
            @click="paginacion('ultima')"
          />
          <div class="q-ml-sm"><strong class="q-mr-xs">Total:</strong>{{ grid.length }}</div>
        </template>
        <!-- <template v-slot:no-data>
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" name="warning" />
            <label>Sin datos disponibles</label>
          </div>
        </template> -->
      </q-table>
    </q-form>
    <div class="row q-mt-sm">
      <div class="col-md-12 divtotales" style="height: 90px">
        <div class="row q-pa-sm">
          <div class="col-md-4 q-pa-sm">
            <q-chip text-color="black" class="class_chip">
              <q-avatar
                class="
                  text-weight-bold
                  class_avat_chip class_diferencia
                  q-px-sm
                "
                >Diferencia:
              </q-avatar>
              {{ totaldiferencia }}
            </q-chip>
          </div>
          <div class="col-md-4 q-pa-sm">
            <q-chip square text-color="black" class="class_chip">
              <q-avatar
                class="text-weight-bold class_avat_chip class_debito q-px-sm"
                >Débito:
              </q-avatar>
              {{ totaldebito }}
            </q-chip>
          </div>
          <div class="col-md-4 q-pa-sm">
            <q-chip square text-color="black" class="class_chip">
              <q-avatar
                class="text-weight-bold class_avat_chip class_credito q-px-sm"
                >Crédito:</q-avatar
              >
              {{ totalcredito }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>

    <l-newmodal
      medium
      ref="modalcontabilizacion"
      :maxheight="tipomodal.class == 3 ? '480px' : tipomodal.class == 2 ? '360px' : ''"
      :height="tipomodal.class == 3 ? '480px' : tipomodal.class == 2 ? '360px' : ''"
      :validar_salir="false"
      footer
    >
      <template slot="title">
        <label class="tituloModal q-ml-sm titulocard text-bold" style="font-size: 16px"
          >Datos requeridos para esta cuenta</label
        >
      </template>
      <template slot="body">
        <div v-if="tipomodal.base == 1" class="q-pt-md">
          <div class="row q-pa-md">
            <div class="q-mx-auto">
              <q-icon name="account_balance" size="sm" color="primary" />
              <label class="q-ml-sm" style="font-size: 16px">Base de retención</label>
            </div>
            <label class="col-12 text-caption q-mt-xs text-grey-8 text-center"
              >Esta cuenta solicita base de retención, digite el valor base y el sistema
              calculará el valor del impuesto.</label
            >
            <div class="col-12 text-center q-pt-lg">
              <q-radio
                class="q-pl-md q-pr-sm"
                v-model="baseretencion.tipo"
                :val="1"
                label="Debito"
              />
              <q-radio
                class="q-pr-md"
                v-model="baseretencion.tipo"
                :val="2"
                label="Crédito"
              />
            </div>
            <div class="col-12 row justify-center q-mt-sm">
              <l-money
                col="md-4 text-black"
                v-model="baseretencion.valor"
                prefijo="$ "
                sufijo=""
                :precision="centavos_contabilidad == true ? 2 : 0"
                icon="monetization_on"
              />
            </div>
          </div>
        </div>
        <div v-if="tipomodal.ccosto == 1" class="q-pt-md">
          <div :class="tipomodal.class != 1 ? 'q-mt-md' : ''">
            <q-icon name="request_quote" size="sm" color="primary" />
            <label class="q-ml-sm" style="font-size: 16px">Centro de costos</label>
          </div>
          <label class="col-12 text-caption q-mt-xs"
            >Esta cuenta exige centro de costo, por favor ingrese el centro de costo.</label
          >
          <div class="row q-mt-sm text-center">
            <label class="col-12">Código / Nombre</label>
            <l-select
              col="12"
              v-model="tipomodal.idccosto"
              option-value="id"
              option-label="codigo_nombre"
              :options="centro_costos"
            />
          </div>
        </div>
        <div v-if="tipomodal.nittercero == 1" class="q-pt-md">
          <div :class="tipomodal.class != 1 ? 'q-mt-md' : ''">
            <q-icon name="person" size="sm" color="primary" />
            <label class="q-ml-sm" style="font-size: 16px">Nit de tercero</label>
          </div>
          <label class="col-12 text-caption q-mt-xs"
            >Esta cuenta exige nit de tercero, por favor ingrese el número de o nombre del
            tercero.</label
          >
          <div class="row q-mt-sm">
            <l-select-rest
              col="12"
              label="Documento / Nombre"
              url="contabilidad/contabilizacion/personas/selectnew"
              v-model="tipomodal.idtercero"
              :rules="[$rules.required($t('validator.required'))]"
            />
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="row justify-center">
          <div class="col-3">
            <q-btn
              rounded
              class="full-width btnlisto"
              @click="accionmodal"
            >
              <span class="qbtn-label">Agregar</span>
            </q-btn>
          </div>
        </div>
      </template>
    </l-newmodal>
    <l-newmodal
      ref="modalinmoasociados"
      width="1000px"
      :validar_salir="false"
      titulo="Inmuebles Asociados a la persona"
      footer
      btn_listo
    >
      <template slot="body">
        <div class="row q-pa-md">
          <div class="col-12 text-right">
            <div class="row justify-end">
              <l-input col="4" v-model="filter" placeholder="Búsqueda" :rules="[true]" />
            </div>
          </div>
          <div class="col-12">
            <q-table
              flat
              bordered
              :data="inmuebles_asociados"
              :columns="columns_inmo"
              :pagination.sync="pagination_inmo"
              :filter="filter"
              row-key="name"
            >
              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                  <q-badge
                    :style="`background-color: rgb(${props.row.estado.color})`"
                    :label="props.row.estado.nombre"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-accion="props">
                <q-td :props="props">
                  <q-btn
                    unelevated
                    dense
                    icon="east"
                    @click="asignarInmoAsociado(props.row)"
                  >
                    <q-tooltip>Asignar Inmueble</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "contabilizacion",
  props: {
    tipodocumento: {
      type: Number,
      default: 1,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    contabilizacion: {
      type: Array,
      default: () => [],
    },
    estadodoc: {
      type: [Number, String],
      default: null,
    },
    novalidar_nit: {
      type: Boolean,
      default: false,
    },
    notacredito: {
      type: Boolean,
      default: false,
    },
    notaajuste: {
      type: Boolean,
      default: false,
    },
    docsoporte: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      validar_nit: null,
      concep_validar: null,
      filter: null,
      view: false,
      cta_banco: null,
      validate_doc_soporte: false,
      detalle: {
        general: null,
        aux1: null,
        aux2: null,
        concepto: null,
        centrogestion: null,
        lineaservicio: null,
        nit: null,
        detalle: null,
      },
      sumatorias: {
        totaldebito: 0,
        totalcredito: 0,
        diferencia: 0,
      },
      baseretencion: {
        index: null,
        tipo: null,
        procentaje: 0,
        valor: 0,
      },
      tipomodal: {
        class: 0,
        base: 0,
        ccosto: 0,
        nittercero: 0,
        index: null,
        idtercero: null,
        idccosto: null,
      },
      grid: [
        {
          mayor_id: null,
          persona_id: null,
          concepto_id: null,
          detalle: null,
          valordb: 0,
          valorcr: 0,
          docref: null,
          cc_id: null,
          tercero_id: null,
          base: 0,
          inmu_id: null,
          mov_id: "0",
          pago_id: null,
          nittercero: false,
          direccion: null,
          pagado:false,
          es_novedad: false,
          pago_arr: false,
        },
      ],
      columns: [
        {
          name: "mayor_id",
          label: "Código",
          align: "center",
        },
        {
          name: "persona_id",
          label: "Nit",
          align: "center",
        },
        {
          name: "concepto_id",
          label: "Concepto",
          align: "center",
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "center",
          field: "accion",
        },
        {
          name: "valordb",
          label: "Débito",
          align: "center",
          field: "accion",
        },
        {
          name: "valorcr",
          label: "Crédito",
          align: "center",
          field: "accion",
        },
        {
          name: "docref",
          label: "Docref",
          align: "center",
          field: "accion",
        },
        {
          name: "base",
          label: "Base",
          align: "center",
          field: "accion",
        },
        {
          name: "cc_id",
          label: "Centro Costo",
          align: "center",
          field: "accion",
        },
        {
          name: "tercero_id",
          label: "Nit Tercero",
          align: "center",
          field: "accion",
        },
        // Nelson Lugo - Esta columna va cuando la contabilidad sea de tipo 1 ques para los inmobiliaria, si no aplica por favor quitarla.
        {
          name: "inmueble_id",
          label: "Inmueble",
          align: "center",
        },
        {
          name: "accion",
          label: "Acciones",
          align: "center",
          field: "accion",
        },
        // {
        //   name: "idreferencia",
        //   label: "ID REFERENCIA",
        //   align: "center",
        //   field: "accion",

        // },
      ],
      columns_inmo: [
        {
          name: "id",
          label: "Id",
          align: "center",
          field: "id",
        },
        {
          name: "label",
          label: "Dirección",
          align: "left",
          field: "label",
          classes: "white-space",
        },
        {
          name: "estado",
          label: "Estado",
          align: "left",
          field: (row) => row.estado != null ? row.estado.nombre : "",
        },
        {
          name: "tipo",
          label: "Tipo",
          align: "left",
          field: "tipo",
        },
        {
          name: "accion",
          label: "Acciones",
          align: "center",
        },
      ],
      mayor: [],
      concepto: [],
      contratosConceptos:[],
      cargandoContratosConceptos: false,
      expandir: true,
      pagination: {
        page: 1,
        rowsPerPage: 100,
      },
      pagination_inmo: {
        rowsPerPage: 10,
      },
      oldconceptoid: null,
      oldpersonaid: null,
      oldterceroid: null,
      oldccosto: null,
      baseseleccion: [],
      conceptos: [],
      centro_costos: [],
      inmuebles_asociados: [],
      index_inmo_aso: null,
    };
  },
  computed: {
    ...mapState("contabilidad", [
      "storedocumentoid",
      "storenumdocumento",
      "conceptos_conta",
      "centrocosto",
    ]),
    ...mapState("parametros", [
      "centavos_contabilidad",
      "cta_prop_id",
      "cta_arr_id",
      "cta_admon_id",
      "tipo_de_contabilidad",
      "nota_credito_id",
      "nota_debito_id",
      "doc_soporte_id",
    ]),
    pagesNumber () {
      return Math.ceil(this.grid.length / this.pagination.rowsPerPage)
    },
    totaldebito() {
      var total = 0;
      this.grid.forEach((element) => {
        total = total + element.valordb;
      });
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: this.centavos_contabilidad == true ? 2 : 0,
      });
      this.sumatorias.totaldebito = total;
      return formatterPeso.format(total);
    },
    totalcredito() {
      var total = 0;
      this.grid.forEach((element) => {
        total = total + element.valorcr;
      });
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: this.centavos_contabilidad == true ? 2 : 0,
      });
      this.sumatorias.totalcredito = total;
      if (this.tipodocumento == 2) {
        setTimeout(() => {
          //Leidyb - Se comenta por que el total en la forma de pago solo debe tomar el de la cuenta de caja o banco
          // if (this.estado == true) {
          //   this.$emit("eventos", 1, total);
          // } else {
          if (this.cta_banco != null) {
            let total_solo_cta_banco = 0;
            this.grid.forEach(item => {
              if (item.mayor_id == this.cta_banco) {
                total_solo_cta_banco += item.valorcr;
              }
            });
            this.$emit("eventos", 1, total_solo_cta_banco);
          } else {
            this.$emit("eventos", 1, this.grid[0].valorcr);
          }
        }, 500);
      }
      return formatterPeso.format(total);
    },
    totaldiferencia() {
      var totaldebito = 0;
      var totalcredito = 0;
      var diferencia = 0;
      this.grid.forEach((element) => {
        totaldebito = totaldebito + element.valordb;
        totalcredito = totalcredito + element.valorcr;
      });
      diferencia = totaldebito - totalcredito;
      if (diferencia < 0) {
        diferencia = Math.abs(diferencia);
      }
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: this.centavos_contabilidad == true ? 2 : 0,
      });
      this.sumatorias.totaldiferencia = diferencia;
      return formatterPeso.format(diferencia);
    },
  },
  methods: {
    // ...mapActions("http", ["Get", "Post"]),
    validar_cta_arre(row) {
      if (row.mayor_id == this.cta_arr_id) {
        return true;
      } else {
        row.es_novedad = false;
        return false;
      }
    },
    exportarMovimiento() {
      return this.grid;
    },
    async paginacion(tipo) {
      let paginar = true;
      if (this.estado == false) {
        paginar = await this.$refs.formcontabilizacion.validate();
      }
      if (paginar) {
        switch (tipo) {
          case "primera":
            this.pagination.page = 1;
            break;
          case "siguiente":
          this.pagination.page ++;
            break;
          case "anterior":
          this.pagination.page --;
            break;
          case "ultima":
          this.pagination.page = Math.ceil(this.grid.length / this.pagination.rowsPerPage);
            break;
        }
      }
    },
    validarValores(tipo, index) {
      // 1 - Debito, 2 - Credito
      if (tipo == 1) {
        if (this.grid[index].valordb > 0) {
          this.grid[index].valorcr = 0;
        }
        this.recalcularValores();
      } else {
        if (this.grid[index].valorcr > 0) {
          this.grid[index].valordb = 0;
        }
        this.recalcularValores();
      }
    },
    async onSubmit() {
      try {
        const validate = await this.$refs.formcontabilizacion.validate();
        if (validate) {
          this.validar_nit = null;
          this.grid.forEach((i) => {
            i["centro_costo"] = i.cc_id;
          });

          if (this.tipodocumento == 4 && this.estadodoc == 2 && (this.notacredito == true || this.notaajuste==true ) ) {
            var tempgrid = this.grid.map((item) => {
              var tempvalordb = item.valordb;
              var tempvalorcr = item.valorcr;
              delete item.valordb;
              delete item.valorcr;
              // Nelson Lugo 19/02/2026 - Caso #75844 - Se solicitio que al generar una nota crédito en el campo de base de la contabilización del documento siempre sea negativo.
              if (this.notacredito == true) item.base = Math.abs(item.base) * -1;

              item.valordb = tempvalorcr;
              item.valorcr = tempvalordb;
              item.mov_id = "0";
              item.docref = this.storenumdocumento;
              return item;
            });
            return tempgrid;
          } else {
            if (!this.validate_doc_soporte) {
              var valid_persona_id = false;
              this.grid.forEach((element) => {
                if (element.persona_id == null) {
                  this.valid_persona_id = true;
                }
              });
              if (this.valid_persona_id) {
                this.LInfo(
                  "warning",
                  "Por favor verifique las personas en la contabilizacion"
                );
              } else {
                return this.grid;
              }
            } else {
              return this.grid;
            }
          }
        } else {
          if (this.tipodocumento == 4) {
            this.$emit("eventos", 8, true);
          }
          return null;
        }
      } catch ({ message }) {
        // console.error(message);
      }
    },
    onReset() {
      this.detalle = {
        general: null,
        aux1: null,
        aux2: null,
        concepto: null,
        centrogestion: null,
        lineaservicio: null,
        nit: null,
        detalle: null,
      };
      this.sumatorias = {
        totaldebito: 0,
        totalcredito: 0,
        diferencia: 0,
      };
      this.baseretencion = {
        index: null,
        tipo: null,
        procentaje: 0,
        valor: 0,
      };
      this.grid = [
        {
          mayor_id: null,
          persona_id: null,
          concepto_id: null,
          detalle: null,
          valorcr: 0,
          valordb: 0,
          tercero_id: null,
          base: 0,
          mov_id: "0",
          cc_id: null,
          docref: null,
          direccion: null,
          nittercero: false,
          es_novedad: false,
        },
      ];
      setTimeout(() => {
        this.$refs.formcontabilizacion.resetValidation();
      }, 500);
    },
    cancelarmodal() {
      this.grid[this.baseretencion.index].mayor_id = null;
      this.detalle.general = null;
      this.detalle.aux1 = null;
      this.detalle.aux2 = null;
      this.$refs.modalcontabilizacion.close();
    },
    accionmodal() {
      if (this.tipomodal.base == 1) {
        var key = null;
        this.grid[this.baseretencion.index].base = this.baseretencion.valor;
        var retencion = (this.baseretencion.valor * this.baseretencion.procentaje) / 100;
        key = this.baseseleccion.findIndex(
          (index) => index.index === this.baseretencion.index
        );
        if (key >= 0) {
          this.baseseleccion.splice(key, 1);
        }
        this.baseseleccion.push({
          tipo: this.baseretencion.tipo,
          index: this.baseretencion.index,
        });
        if (this.baseretencion.tipo == 1) {
          this.grid[this.baseretencion.index].valordb = Math.round(retencion);
        } else if (this.baseretencion.tipo == 2) {
          this.grid[this.baseretencion.index].valorcr = Math.round(retencion);
        }
      }
      if (this.tipomodal.ccosto == 1) {
        if (this.tipomodal.idccosto != null && this.tipomodal.idccosto != "") {
          this.grid[this.tipomodal.index].cc_id = this.tipomodal.idccosto;
        }
      }
      if (this.tipomodal.nittercero == 1) {
        if (this.tipomodal.idtercero != null && this.tipomodal.idtercero != "") {
          this.grid[this.tipomodal.index].tercero_id = this.tipomodal.idtercero;
        }
      }
      this.tipomodal = {
        class: 0,
        base: 0,
        ccosto: 0,
        nittercero: 0,
        index: null,
        idtercero: null,
        idccosto: null,
      };
      this.$refs.modalcontabilizacion.close();
      this.cuotasCargadas = false;
    },
    recalcularValores(val) {
      if (this.tipodocumento == 2) {
        if (this.sumatorias.totaldebito > 0) {
          if (this.sumatorias.totaldiferencia > 0) {
            this.grid[0].valorcr = this.sumatorias.totaldebito;
            setTimeout(() => {
              if (this.sumatorias.totalcredito > this.sumatorias.totaldebito) {
                if (this.sumatorias.totaldiferencia <= this.grid[0].valorcr) {
                  this.grid[0].valorcr =
                    this.grid[0].valorcr - this.sumatorias.totaldiferencia;
                }
              }
            }, 100);
          }
        }
      }
    },
    async validarInput(event, tipo, index) {
      switch (tipo) {
        // Validar el codigo de mayor
        case 1:
          var openmodal = false;
          this.tipomodal = {
            class: 0,
            base: 0,
            ccosto: 0,
            nittercero: 0,
            index: null,
            idtercero: null,
            idccosto: null,
          };
          if (event.base == true) {
            if (this.grid[index].base == 0) {
              if (event.naturaleza.toLowerCase() == "debito") {
                this.baseretencion.tipo = 1;
              } else {
                this.baseretencion.tipo = 2;
              }
              this.baseretencion.index = index;
              this.baseretencion.procentaje = parseFloat(event.porcentajeret);
              this.baseretencion.valor = 0;
              this.tipomodal.base = 1;
              this.tipomodal.class = this.tipomodal.class + 1;
              openmodal = true;
            }
          }
          if (event.ccosto == true) {
            if (this.grid[index].cc_id == null) {
              this.tipomodal.ccosto = 1;
              this.tipomodal.class = this.tipomodal.class + 1;
              openmodal = true;
            }
          }
          if (event.nittercero == true) {
            this.concep_validar = event;
            this.tipomodal.nittercero = 1;
            this.tipomodal.class = this.tipomodal.class + 1;
            openmodal = true;
          }
          if (openmodal == true) {
            if (this.grid[index].tercero_id == null) {
              this.$refs.modalcontabilizacion.open();
              this.tipomodal.index = index;
            }
          }
          break;
        case 2:
          // Validar el nit de la persona
          if (this.$route.params.tipodocumento == 3 && index == 0) {
            //Validacion para seleccionar la persona del primer registro de la grilla para documento de tipo nota contable.
            this.$emit("eventos", 5, event.value);
          }
          if (this.grid[index].mayor_id != null) {
            let i = this.mayor.findIndex((i) => i.id === this.grid[index].mayor_id);
            if (i >= 0) {
              this.validarInput(this.mayor[i], 1, index);
            }
          }
          break;
        case 3:
          // Validar el concepto
          if (event != null) {
            if (this.grid[index].inmu_id != null) {
              this.grid[index].detalle = `${event.detalle} ${this.grid[index].direccion}`;
            } else {
              this.grid[index].detalle = event.detalle;
            }
            if (this.contratosConceptos && Object.keys(this.contratosConceptos).length > 0) {
              const c = Array.isArray(this.contratosConceptos)
                ? this.contratosConceptos.find(
                    item =>
                      item.concepto_cont_id === this.grid[index].concepto_id &&
                      item.cuotas === true
                  )
                : this.contratosConceptos.concepto_cont_id === this.grid[index].concepto_id &&
                  this.contratosConceptos.cuotas === true
                ? this.contratosConceptos
                : null;
              if (c) {
                const a = c.cuotasfacturadas != null ? c.cuotasfacturadas : 0;
                const b = c.cuotasxfacturar != null ? c.cuotasxfacturar : 0;
                if (!this.grid[index].detalle.includes(' de ')) {
                  this.grid[index].detalle += ` (cuota ${a} de ${b})`;
                }
              }
            } else {
              console.warn('contratos conceptos aún no cargados en validarInput');
            }
          } else {
            this.grid[index].detalle = null;
          }
          break;
        case 4:
          // Validar el centro de costo
          // if (this.grid[index].cc_id != this.oldccosto) {
          //   if (event.target.value != "" && event.target.value != null) {
          //     this.oldccosto = this.grid[index].cc_id;
          //     var text = event.target.value.split(" ");
          //     let result = this.centro_costos.filter((f) => f.codigo == text[0]);
          //     if (result.length > 0) {
          //       this.grid[index].cc_id = result[0].id;
          //     } else {
          //       this.grid[index].cc_id = null;
          //       this.notify("negative", "Centro de costo no existe!");
          //     }
          //   }
          // }
          break;
        case 5:
          // Validar base si la cuenta la exige
          var seleccion = null;
          if (this.grid[index].mayor_id != null) {
            const caso5 = this.mayor.filter(
              (filter) => filter.id == this.grid[index].mayor_id
            );
            if (caso5.length > 0) {
              if (caso5[0].base == 1) {
                if (this.grid[index].base > 0) {
                  this.baseseleccion.forEach((element) => {
                    if (index == element.index) {
                      seleccion = element.tipo;
                    }
                  });
                  if (caso5[0].porcentajeret > 0) {
                    if (seleccion == 1) {
                      this.grid[index].valorcr = 0;
                      var porcentaje = Math.round(
                        (this.grid[index].base * parseFloat(caso5[0].porcentajeret)) / 100
                      );
                      this.grid[index].valordb = porcentaje;
                    } else if (seleccion == 2) {
                      this.grid[index].valordb = 0;
                      var porcentaje = Math.round(
                        (this.grid[index].base * parseFloat(caso5[0].porcentajeret)) / 100
                      );
                      this.grid[index].valorcr = porcentaje;
                    }
                    return true;
                  }
                } else {
                  return false;
                }
              }
            }
          }
          break;
        case 6:
          // Valirdar si la cuenta exige centro de costo
          if (this.grid[index].mayor_id != null) {
            const caso6 = this.mayor.filter(
              (filter) => filter.id == this.grid[index].mayor_id
            );
            if (caso6.length > 0) {
              if (caso6[0].ccosto == 1) {
                if (this.grid[index].cc_id != null) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            }
          }
          break;
        case 7:
          // Valirdar si la cuenta exige nit de tercero
          if (this.grid[index].mayor_id != null) {
            const caso7 = this.mayor.filter(
              (filter) => filter.id == this.grid[index].mayor_id
            );
            if (caso7.length > 0) {
              if (caso7[0].nittercero == 1) {
                if (this.grid[index].tercero_id != null) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            }
          }
          break;
        case 8:
          //
          break;
        case 9:
          // Validar el nit del tercero
          // if (this.grid[index].tercero_id != this.oldterceroid) {
          //   this.oldterceroid = this.grid[index].tercero_id;
          //   var text = event.target.value.split(" ");
          //   const params = { search: text[0] };
          //   await this.Get("tercero/personas/select", params).then((resp) => {
          //     if (resp.length == 0) {
          //       this.notify("negative", "Documento o nombre no existe!");
          //     }
          //   });
          // } else {
          //   if (this.grid[index].persona_id == null && this.oldterceroid == null) {
          //     this.notify("negative", "Documento o nombre no existe!");
          //   }
          // }
          break;
      }
    },
    async onRowClick(row) {
      if (row != undefined) {
        var id = row.mayor_id;
        var codigo = null;
        if (row.mayor_id != null && row.mayor_id != "") {
          const result = this.mayor.filter((filter) => filter.id == id);
          row.nittercero = result[0].nittercero;
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
                  this.detalle.general = filtro2[0].codigol + " - " + filtro2[0].nombrel;
                  this.detalle.aux1 = filtro1[0].codigol + " - " + filtro1[0].nombrel;
                  this.detalle.aux2 = filtro3[0].codigol + " - " + filtro3[0].nombrel;
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
                  this.detalle.general = filtro2[0].codigol + " - " + filtro2[0].nombrel;
                  this.detalle.aux1 = filtro1[0].codigol + " - " + filtro1[0].nombrel;
                  this.detalle.aux2 = filtro3[0].codigol + " - " + filtro3[0].nombrel;
                }
              }
            }
          } else {
            codigo = codigo.split("");
            codigoPadre1 = codigo[0];
            filtro1 = this.mayor.filter((filter) => filter.codigol == codigoPadre1);
            filtro2 = this.mayor.filter((filter) => filter.codigol == result[0].codigol);
            this.detalle.general = filtro1[0].codigol + " - " + filtro1[0].nombrel;
            this.detalle.aux1 = filtro2[0].codigol + " - " + filtro2[0].nombrel;
          }
        }
        if (row.concepto_id != null && row.concepto_id != "") {
          let result = this.conceptos_conta.filter(
            (filter) => filter.id == row.concepto_id
          )[0];
          this.detalle.concepto = result.codigo + " - " + result.nombre;
          if (row.detalle != null && row.concepto_id != "") {
            this.detalle.detalle = result.detalle;
          }
        }
        if (row.persona_id != null && row.persona_id != "") {
          if (this.oldpersonaid != row.persona_id) {
            this.oldpersonaid = row.persona_id;
            var idpersona = row.persona_id;
            fetch(`api/tercero/personas/personaid/${idpersona}/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${this.$store.getters["auth/token"]}`,
              },
            })
              .then((res) => res.json())
              .then((resp) => {
                this.detalle.nit = resp.documento + " - " + resp.n_completo;
                this.detalle.idpersona = resp.id;
              });
          }
        }

        if (row.select == undefined) {
          if (row.mayor_id == null) {
            this.detalle.general = null;
            this.detalle.aux1 = null;
            this.detalle.aux2 = null;
          }

          if (row.concepto_id == null) {
            this.detalle.concepto = null;
          }

          if (row.persona_id == null) {
            this.detalle.nit = null;
            this.detalle.idpersona = null;
          }
          if (row.detalle == null || row.detalle == "") {
            this.detalle.detalle = null;
          } else {
            this.detalle.detalle = row.detalle;
          }
        }
        // se agrega la sgte linea para validar que se va a ingresar un nit en el input
        this.validar_nit = true;
      }
    },
    inputfocus(tipo, index, event) {
      switch (tipo) {
        case 1:
          this.detalle.nit = event.target.value;
          if (this.grid[index].detalle != null && this.grid[index].detalle != "") {
            this.detalle.detalle = this.grid[index].detalle;
          }
          break;
        case 2:
          this.detalle.concepto = event.target.value;
          if (this.grid[index].detalle != null && this.grid[index].detalle != "") {
            this.detalle.detalle = this.grid[index].detalle;
          }
          break;
      }
    },
    async selectMayor(val) {
      if (typeof val == "number") {
        const data = await this.Get("contabilidad/mayor/" + val);
        var row = { mayor_id: data.id, select: true };
        if (this.view == false) {
          this.onRowClick(row);
        }
      }
    },
    async selectNit(val) {
      if (typeof val == "number") {
        var row = { persona_id: val, select: true };
        this.onRowClick(row);
      }
    },
    ejecurtarEventosGrid(tipo, val) {
      switch (tipo) {
        case 1:
          //Asignar el valor total del encabezado en la primera fila de la grid, Ingresos.
          if (this.grid.length > 0) {
            this.grid[0].valordb = val;
          }
          break;
        case 2:
          //Asignar el concepto en la primera fila de la grilla.
          if (val != null) {
            this.grid[0].concepto_id = val.id;
            this.grid[0].detalle = val.detalle;
          } else {
            this.grid[0].concepto_id = null;
            this.grid[0].detalle = null;
          }
          break;
        case 3:
          //Asignar la persona en la primera fila de la grilla.
          if (!this.validate_doc_soporte) {
            if (val != null) {
              this.grid[0].persona_id = val.id;
            } else {
              this.grid[0].persona_id = null;
            }
          }
          break;
        case 4:
          if (val != null) {
            setTimeout(() => {
              if (val.tipo == 1) {
                //Asignar el codigo de mayor por defecto en la primera fila de la grilla para INGRESOS.
                this.grid[0].mayor_id = val.id;
              } else if (val.tipo == 2) {
                //Asignar el codigo de mayor por defecto en la primera fila de la grilla para EGRESOS.
                this.grid[0].mayor_id = val.id;
                this.cta_banco = val.id;
              }
            }, 500);
          }
          break;
        case 5:
          //Asignar el detalle del documento al primer concepto de la grid
          let detalle = val;
          if (this.grid[0].inmu_id != undefined) {
            if (this.grid[0].inmu_id != null) {
              detalle = `${detalle} ${this.grid[0].direccion}`;
            }
          }
          this.grid[0].detalle = detalle;
          break;
        case 6:
          //Asignar id de l inmueble seleccionado en la grid
          // this.grid.forEach((element) => {
          //   element.inmu_id = val.id;
          // });
          break;
        case 7:
          //Validar si es tipo de documento es documento soporte para que la contabilizacion no sea obligatoria
          if (val == this.doc_soporte_id) {
            this.validate_doc_soporte = true;
          } else {
            this.validate_doc_soporte = false;
          }
          break;
      }
    },
    async AddRow(event, index = null) {
      if (event.keyCode == 45 || event.type == "click") {
        // var posicion = this.grid.length - 1;
        const validate = await this.$refs.formcontabilizacion.validate();
        if (validate) {
          var posicion = index;
          let valordb = 0
          let valorcr = 0
          if (this.grid[posicion].valordb == 0 && this.grid.length <= 1) {
            valordb = this.grid[posicion].valorcr 
          }
          if (this.grid[posicion].valorcr == 0 && this.grid.length <= 1) {
            valorcr = this.grid[posicion].valordb 
          }
          if (this.tipodocumento == 1) { // Ingresos (Recibo de banco o de caja)
            // La diferencia al agregar una nueva fila debe ir siempre al credito de forma automatica - #70398 - danielvega
            let diferencia = this.calcDiferencia()
            valorcr = diferencia
          } else if (this.tipodocumento == 3) { // Nota contable
            // La diferencia al agregar una nueva fila debe ir siempre al credito y al debito de forma automatica - #70398 - danielvega
            let diferencia = this.calcDiferencia()
            if (diferencia > 0 && this.grid[posicion].valordb == 0){
              valordb = diferencia
            } else if (diferencia > 0 && this.grid[posicion].valorcr == 0) {
              valorcr = diferencia
            }
          }
          this.grid.splice((index + 1), 0, {
            mayor_id: null,
            persona_id: this.grid[posicion].persona_id,
            concepto_id: this.grid[posicion].concepto_id,
            detalle: this.grid[posicion].detalle,
            valordb: valordb,//this.grid[posicion].valordb != 0 ? 0 : this.grid.length <= 1 ? this.grid[posicion].valorcr : 0,
            valorcr: valorcr,//this.grid[posicion].valorcr != 0 ? 0 : this.grid.length <= 1 ? this.grid[posicion].valordb : 0,
            docref: this.grid[posicion].docref,
            cc_id: null,
            tercero_id: null,
            inmu_id: this.grid[posicion].inmu_id,
            mov_id: "0",
            base: 0,
            pago_id: null,
            direccion: this.grid[posicion].direccion,
            pagado: false,
            es_novedad: false,
            pago_arr: this.grid[posicion].pago_arr
          });
          setTimeout(() => {
            document.querySelectorAll("input.evitclick").forEach((element, index) => {
              element.onclick = function (e) {
                if (e.target.value != "") {
                  e.stopPropagation();
                }
              };
            }, 200);
          });
          this.recalcularValores();
        }
      }
      // else if (event.keyCode == 46) {
      //   this.DeleteRow(index);
      // }
    },
    DeleteRow(index) {
      if (this.grid.length > 1) {
        if (index == 0) {
          setTimeout(() => {
            this.onRowClick(this.grid[index + 1]);
          }, 100);
        } else {
          setTimeout(() => {
            this.onRowClick(this.grid[index - 1]);
          }, 100);
        }
        this.grid.splice(index, 1);
        setTimeout(() => {
          this.recalcularValores();
        }, 200);
      }
    },
    rulesDetalle(val, index) {
      if (val != null) {
        if (typeof val == "number") {
          this.asignarDetalle(val, index);
        }
      }
      return true;
    },
    async asignarDetalle(val, index) {
      if (this.grid[index].concepto_id != null && this.grid[index].concepto_id != "") {
        const result = this.conceptos_conta.filter((filter) => filter.id == val);
        if (result.length > 0) {
          this.grid[index].detalle = result[0].detalle;
          var row = { concepto_id: result[0].id, select: true };
          this.onRowClick(row);
        }
      }
    },
    Detalle(val) {
      if (typeof val == "number") {
        this.detalle.detalle = this.grid[val].detalle;
      } else {
        this.detalle.detalle = val.target.value;
      }
    },
    notify(tipo, mensaje) {
      this.$q.notify({
        progress: true,
        timeout: 1200,
        type: tipo,
        message: mensaje,
      });
    },
    async getMayor() {
      try {
        const data = await this.Get("contabilidad/mayor");
        this.mayor = data;
      } catch ({ message }) {}
    },
    async getConceptos() {
      try {
        const data = await this.Get("contabilidad/concepto");
        this.conceptos = data;
      } catch ({ message }) {}
    },
    async getContratosConceptos(personaId) {
      try {
        if (this.cuotasCargadas || !personaId) return;
        this.cuotasCargadas = true; 
        if (!personaId) {
          console.warn("personaId no definido, no se consultan cuotas");
          return;
        }
        const data = await this.Get(`contrato/contratos/cuotas/${personaId}`);
        this.contratosConceptos = data;
      } catch (error) {
        console.error("Error al obtener contratos conceptos:", error);
      }
    },
    async getCentroCosto() {
      await this.Get("contabilidad/centrocostos/all", {
        tipo: "C",
      }).then((resp) => {
        this.centro_costos = resp;
      });
    },
    async validacionInmueblesAsociados(index, tipo, model) {
      if (model.model != null) {
        if (this.estado == false) {
          this.index_inmo_aso = index;
          if (tipo == 1) {
            // Validacion de tipo de cuenta, arre, prop o admon
            if (
              model.model.value == this.cta_prop_id ||
              model.model.value == this.cta_arr_id ||
              model.model.value == this.cta_admon_id
            ) {
              if (this.grid[index].persona_id != null) {
                fetch(`api/contabilidad/contabilizacion/personas/selectnew/${this.grid[index].persona_id}/`, {
                  method: "POST",
                  body: JSON.stringify({
                    id: this.grid[index].persona_id,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.$store.getters["auth/token"]}`,
                  },
                })
                  .then((res) => res.json())
                  .then((resp) => {
                    this.inmuebles_asociados = resp[0].modelo.inmuebles_asociados;
                    if (this.inmuebles_asociados.length > 0) {
                      this.$refs.modalinmoasociados.open();
                    }
                  });
              }
            }
            this.validarInput(model.model.model, 1, index);
          } else if (tipo == 2) {
            // Validacion en la persona si tiene inmuebles asociados
            if (this.grid[index].mayor_id != null) {
              if (
                this.grid[index].mayor_id == this.cta_prop_id ||
                this.grid[index].mayor_id == this.cta_arr_id ||
                this.grid[index].mayor_id == this.cta_admon_id
              ) {
                this.inmuebles_asociados = model.model.modelo.inmuebles_asociados;
                if (this.inmuebles_asociados.length > 0) {
                  this.tipomodal.nittercero = 1;
                  this.$refs.modalinmoasociados.open();
                }
                this.validarInput(model.model.modelo, 2, index);
              }
            } else {
              this.validarInput(model.model.modelo, 2, index);
            }
            // this.validarInput(model, 2, index);
          } else {
            if (model.model == null) {
              this.grid[index]["direccion"] = null;
              if (
                this.grid[index].mayor_id != null &&
                this.grid[index].persona_id != null
              ) {
                setTimeout(() => {
                  this.validacionInmueblesAsociados(index, 1, { model: {value: this.grid[index].mayor_id }});
                }, 300);
              }
            } else {
              this.grid[index]["direccion"] = model.model.label;
              if (this.grid[index].detalle != null) {
                let arraydet = this.grid[index].detalle.split("[");
                this.grid[index].detalle = `${arraydet[0]} ${model.model.label}`;
              } else {
                this.grid[index].detalle = model.model.label;
              }
            }
          }
        }
      }
    },
    asignarInmoAsociado(model) {
      // Asignar inmueble en la grid
      this.grid[this.index_inmo_aso]["inmu_id"] = model.id;
      this.grid[this.index_inmo_aso]["direccion"] = model.label;
      if (this.grid[this.index_inmo_aso].detalle != null && this.grid[this.index_inmo_aso].detalle != "") {
        let arraydet = this.grid[this.index_inmo_aso].detalle.split("[");
        this.grid[this.index_inmo_aso].detalle = `${arraydet[0]} ${model.label}`;
      } else {
        if (this.grid[this.index_inmo_aso].concepto_id != null) {
          let cc = this.conceptos_conta.filter((f) => f.id == this.grid[this.index_inmo_aso].concepto_id);
          if (cc.length > 0) {
            this.grid[this.index_inmo_aso].detalle = `${cc[0].detalle} ${model.label}`;
          }
        } else {
          this.grid[this.index_inmo_aso].detalle = model.label;
        }
      }
      this.$refs.modalinmoasociados.close();
    },
    validarConta(tipo, index, val) {
      if (tipo == 1) {
        if (val != null) {
          if (this.grid.some((item) => item.mayor_id == this.cta_prop_id || item.mayor_id == this.cta_admon_id)) {
            this.$emit("eventos", 12, true);
          } else {
            this.$emit("eventos", 12, false);
          }
        } else {
          this.$emit("eventos", 12, false);
        }
      }
    },
    calcDiferencia(){
      var totaldebito = 0;
      var totalcredito = 0;
      var diferencia = 0;
      this.grid.forEach((element) => {
        totaldebito = totaldebito + element.valordb;
        totalcredito = totalcredito + element.valorcr;
      });
      diferencia = totaldebito - totalcredito;
      if (diferencia < 0) {
        diferencia = Math.abs(diferencia);
      }
      return diferencia
    }
  },
  watch: {
    contabilizacion: {
      handler() {
        this.grid = this.contabilizacion;
        this.view = true;
        setTimeout(() => {
          this.view = false;
        }, 2000);      
      },
      deep: true,
    },
    contratosConceptos(newVal) {
      if (newVal && (Array.isArray(newVal) ? newVal.length > 0 : Object.keys(newVal).length > 0)) {
        this.grid.forEach((row, index) => {
          if (row.concepto_id) {
            const fakeEvent = { detalle: row.detalle };
            this.validarInput(fakeEvent, 3, index);
          }
        });
      }
    },
    grid: {
      handler(newVal) {
        let validar_cta_arre = this.grid.filter((f) => f.mayor_id == this.cta_arr_id).length > 0 ? true : false;
        this.$emit("validar_cta_arre", validar_cta_arre);
        if (this.contratosConceptos && Object.keys(this.contratosConceptos).length > 0) return;
        const persona = newVal.find(r => r.persona_id);
        if (persona && persona.persona_id) {
          this.getContratosConceptos(persona.persona_id);
        }
      },
      deep: true,
    },
    "cta_banco"(val) {
      if (val != null) {
        if (val != null) {
          let total_solo_cta_banco = 0;
          this.grid.forEach(item => {
            if (item.mayor_id == val) {
              total_solo_cta_banco += item.valorcr;
            }
          });
          this.$emit("eventos", 1, total_solo_cta_banco);
        }
      }
    }
  },
  created() {
    this.getMayor();
    this.getConceptos();
    this.getCentroCosto();
    this.getContratosConceptos(this.grid[0].persona_id);
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelectorAll("input.evitclick").forEach((element, index) => {
          element.onclick = function (e) {
            if (e.target.value != "") {
              e.stopPropagation();
            }
          };
        });
        if (this.docsoporte == this.doc_soporte_id) {
          this.validate_doc_soporte = true;
        }
      }, 2000);
    });
  },
};
</script>
<style lang="scss">
.qtd {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.q-field__bottom.row.items-start.q-field__bottom--animated {
  display: none;
}
label .q-input {
  padding-bottom: none;
}
.estiloconta table  thead  tr  th {
  font-size: 12px ;
  height: 24px ;
}
.estiloconta table  thead  tr {
  height: 24px ;
}

table > tbody > tr > td {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.qinputheigth {
  height: 25px !important;
  margin-bottom: 3px;
}
.qinputheigth div.q-field__control.relative-position.row.no-wrap.bg- {
  height: 23px !important;
}

.qinputheigth div.q-field__control.relative-position.row.no-wrap {
  min-height: 25px !important;
}

.inputheighttd label {
  height: 25px !important;
}

.inputheighttd div.q-field__control.relative-position.row.no-wrap {
  min-height: 25px !important;
}

.inputheighttd
  div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip {
  height: 25px !important;
}
.inputheighttd div.q-field__append.q-field__marginal.row.no-wrap.items-center {
  height: 25px !important;
}
.inputheighttd input {
  height: 25px !important;
  /* font-size: 12px; */
}

.inputheighttd div.q-field__native.row.items-center {
  min-height: 25px !important;
}
.inputheighttd .q-field__native {
  padding: 0px !important;
}
.inputheighttd .q-field__native.row {
  min-height: 25px !important;
}
.textareaheighttd textarea {
  /* height: 20px !important;  */
  min-height: 20px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.textareaheighttd div.q-field__control.relative-position.row.no-wrap.bg- {
  min-height: 20px !important;
}
.textareaheighttd textarea {
  font-size: 12px;
}
.textareaheighttd div.q-field__marginal {
  height: 26px !important;
}

/* .inputheighttd input {
  font-size: 12px;
} */

.negrita input {
  font-weight: bold !important;
}
/* .q-avatar{
  border-radius: 19px 0 0 19px !important;
} */
.class_chip {
  width: 407px !important;
  height: 47px !important;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d4e8f8;
  border-radius: 24px;
  opacity: 1;
  .q-chip__content {
    justify-content: unset !important;
  }
}
.class_avat_chip {
  width: 130px;
  height: 45px;
  border-radius: 24px 0px 0px 24px !important;
  color: #194880 !important;
  /* margin-right: 192px !important; */
  opacity: 1;
}
.class_credito {
  background: #e2424240 padding-box !important;
}
.class_debito {
  background: #42a5f540 padding-box !important;
}
.class_diferencia {
  background: #d8d8d8 padding-box !important;
}

.divtotales {
  height: 105px;
  background: #f1f7fc 0% 0% no-repeat padding-box;
  opacity: 1;
}
div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  > button.notranslate {
  font-size: 18px !important;
}
td.white-space {
  white-space: normal !important;
}
.my-sticky-header-table-conta {
  .q-field--outlined.q-field--readonly .q-field__control:before{
    border-style: inset !important;
  }
}

.my-sticky-header-table-conta {
  div.q-table__control {
    span.q-table__bottom-item {
      display: none !important;
    }
    label.q-field.q-table__select {
      display: none !important;
    }
  }
}
::placeholder {
  font-size: 14px !important; 
  align-items: end;
}
</style>

<style lang="sass">
.my-sticky-header-table-conta

  td:last-child
    /* bg color is important for td; just specify one */
    background-color: white !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: white

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:last-child th
    top: 0
    z-index: 1
  tr:last-child th:last-child
    /* highest z-index */
    z-index: 3

  td:last-child
    z-index: 1

  td:last-child, th:last-child
    position: sticky
    right: 0
</style>
