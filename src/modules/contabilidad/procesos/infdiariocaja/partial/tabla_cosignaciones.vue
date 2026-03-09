<template>
  <div class="row">
    <div class="col q-mb-md q-pr-md flex justify-end">
      <span
        class="q-mr-md q-my-auto"
        v-if="model.num_documento != null && estado.toLowerCase() == 'cerrada' ? true : false"
      >
        Doc: #{{ model.num_documento }}
      </span>

      <div style="background: transparent linear-gradient(180deg, #D4E8F83D 0%, #D4E8F8 100%) 0% 0% no-repeat padding-box;
                  border: 1px solid #FFFFFF;
                  border-radius: 34px;
                  opacity: 1;"
      >
        <can permiso="view_menu_gestion_contable_informes_informe_diario_de_caja_acciones_imprimir">
          <q-btn
            round
            dense
            color="white q-ml-sm"
            @click="imprimirDocumento"
            :disable="model.documento_id != null && estado.toLowerCase() == 'cerrada' ? false : true"
          >
            <q-icon name="print" color="teal" />
            <q-tooltip> Imprimir </q-tooltip>
          </q-btn>
        </can>

        <can
          permiso="view_menu_gestion_contable_informes_informe_diario_de_caja_acciones_agregar_consignacion"
        >
          <q-btn
            unelevated
            round
            dense
            color="primary q-ma-sm"
            icon="add"
            @click="addConsignacion()"
            :disable="estado.toLowerCase() == 'cerrada'"
          >
            <q-tooltip>Agregar</q-tooltip>
          </q-btn>
        </can>
      </div>

    </div>
    <div class="col-12">
      <q-table
        flat
        dense
        class="my-sticky-header-table q-px-md q-pl-xl"
        row-key="name"
        :data="consignacion"
        :columns="columns"
        :pagination.sync="pagination"
        :filter="filter"
      >
        <template v-slot:body="props">
          <tr>
            <td auto-width>
              <l-input
                col="3"
                class="q-mt-sm"
                v-model="props.row.numero"
                label="Número *"
                :disable="props.row.id != null && editconsig == true"
                :rules="[$rules.required($t('validator.required'))]"
              />
            </td>
            <td auto-width>
              <l-select
                col="3"
                class="q-mt-sm"
                v-model="props.row.ctaban"
                value="id"
                option-label="nombre"
                :options="list_bancos_mayor"
                label="Banco *"
                :disable="props.row.id != null && editconsig == true"
                :rules="[$rules.required($t('validator.required'))]"
              />
            </td>
            <td auto-width>
              <l-money
                col="3"
                class="q-mt-sm"
                v-model="props.row.efectivo"
                prefijo="$ "
                sufijo=""
                @input="total(props.row)"
                :disable="props.row.id != null && editconsig == true"
                label="Efectivo *"
                :rules="[(val) => val > 0]"
                :precision="centavos_contabilidad == true ? 2 : 0"
              />
            </td>
            <td auto-width>
              <l-money
                col="3"
                v-model="props.row.total"
                prefijo="$ "
                sufijo=""
                label="Total *"
                icon="monetization_on"
                :precision="centavos_contabilidad == true ? 2 : 0"
                :disable="true"
              />
            </td>

            <td auto-width class="text-center">
              <label>{{ props.row.fecha }}</label>
            </td>

            <q-td class="text-center">
              <q-btn
                class="q-mr-sm"
                unelevated
                round
                dense
                color="primary"
                size="12px"
                v-if="addconsig == false && props.row.id != null"
                @click="editarCosignacion(props.row)"
                :disable="
                  estado.toLowerCase() == 'cerrada' || estado == ''
                    ? true
                    : false
                "
              >
                <q-icon size="2em" name="edit" color="white" />
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                class="q-mr-sm"
                unelevated
                round
                dense
                color="orange"
                size="12px"
                @click="onSubmit(props.row)"
                v-if="addconsig == true && props.row.id == null"
                :disable="estado.toLowerCase() == 'cerrada' || estado == '' ? true : false"
              >
                <q-icon size="2em" name="save" color="white" />
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>

              <q-btn
                class="q-mr-sm"
                unelevated
                round
                dense
                color="orange"
                size="12px"
                @click="onSubmit(props.row)"
                v-if="addconsig == true && props.row.id !== null"
                :disable="estado.toLowerCase() == 'cerrada' || estado == '' ? true : false"
              >
                <q-icon size="2em" name="save" color="white" />
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>

              <!-- @click="editarCosignacion(props.row)" -->
              <q-btn
                unelevated
                round
                dense
                color="primary"
                size="12px"
                v-if="props.row.id && addconsig == false"
                @click="eliminarCosignaciones(props.row)"
                :disable="
                  estado.toLowerCase() == 'cerrada' || estado == ''
                    ? true
                    : false
                "
              >
                <q-icon size="2em" name="delete" color="white" />
                <q-tooltip>Quitar</q-tooltip>
              </q-btn>

              <q-btn
                class="q-ml-sm"
                unelevated
                round
                dense
                color="red"
                size="12px"
                @click="cerrarEditarConsignacion()"
                v-if="addconsig == true"
                :disable="estado.toLowerCase() == 'cerrada' || estado == '' ? true : false"
              >
                <q-icon size="2em" name="close" color="white" />
                <q-tooltip>Cerrar</q-tooltip>
              </q-btn>
            </q-td>
          </tr>
        </template>
        <!-- <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              class="q-mr-sm"
              unelevated
              round
              dense
              color="primary"
              icon="edit"
              size="12px"
              @click="editarCosignacion(props.row)"
              :disable="
                estado.toLowerCase() == 'cerrada' || estado == '' ? true : false
              "
            >
              <q-tooltip>Editar</q-tooltip></q-btn
            >
            <q-btn
              unelevated
              round
              dense
              color="primary"
              icon="delete"
              size="12px"
              @click="eliminarCosignaciones(props.row)"
              :disable="
                estado.toLowerCase() == 'cerrada' || estado == '' ? true : false
              "
            >
              <q-tooltip>Quitar</q-tooltip></q-btn
            >
          </q-td>
        </template> -->
        <template v-slot:no-data>
          <div class="full-width row flex-center q-gutter-sm">
            <q-icon size="2em" name="warning" color="red" />
            <label>Sin datos disponibles</label>
          </div>
        </template>
      </q-table>
    </div>
   <!--  <addcosignacion
      ref="addcosignacion"
      :caja_id="caja_id"
      @reload="$emit('reload')"
    /> -->
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import addcosignacion from "./add_cosignacion.vue";
export default {
  name: "consignacion",
  components: {
    addcosignacion,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    caja_id: {
      type: Number,
      default: null,
    },
    estado: {
      type: String,
      default: "",
    },
   /*  model: {
      type: Array,
      default: () => [],
    }, */
    model: {
      type: Object,
      default: {},
    },

  },
  data() {
    return {
      list_bancos_mayor: [],
      filter: null,
      addconsig: false,
      consignacion: [],
      editconsig: true,
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "numero",
          field: "numero",
          label: "Número",
          align: "center",
        },
        {
          name: "cuenta",
          field: "cuenta",
          label: "Cuenta",
          align: "center",
        },
        {
          name: "efectivo",
          field: "efectivo",
          label: "Efectivo",
          align: "center",
          format: (val) => this.formatMoney(val),
        },
        {
          name: "total",
          field: "total",
          label: "Total",
          align: "canter",
          format: (val) => this.formatMoney(val),
        },
        {
          name: "fecha",
          field: "fecha",
          label: "Fecha Consignación",
          align: "center",
          format: (val) => moment(val, ["YYYY-MM-DD"]).format("DD/MM/YYYY"),
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center",
        },
      ],
    };
  },
  computed: {
    ...mapState("parametros", ["centavos_contabilidad"]),
  },
  mounted() {
    this.consignacion = this.value;
    this.getBancosMayor();
  },
  methods: {
    cerrarEditarConsignacion(){
      this.editconsig = false
      this.$emit("emitconsulta");
    },
    total(prop) {
      prop.total = prop.efectivo;
    },
    editarCosignacion(model) {
      let consignacion = this.consignacion.filter((item) => item.id == model.id )
      this.consignacion = consignacion
      this.addconsig = true
      this.editconsig = false;
    },
    addConsignacion() {
      this.addconsig = true;
      this.consignacion = []
      this.consignacion.push({
        id: null,
        numero: null,
        efectivo: 0,
        total: 0,
        ctaban: null,
        caja: this.caja_id,
        mayor: null,
      });
    },
    async onSubmit(model) {
      try {
        await this.Post(
          "contabilidad/info_diario_caja/add_cosignacion",
          model
        ).then((resp) => {
          this.LInfo(
            "success",
            `Cosignación ${
              model.id == null ? "agregada" : "editada"
            } correctamente.`
          );
          this.$emit("emitconsulta");
          // this.$refs.modaladd.close();
        });
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarCosignaciones(model) {
      this.LConfim(
        `¿Está seguro de quitar la consignacion # ${model.numero}?`,
        async () => {
          await this.Post("contabilidad/info_diario_caja/delete_cosignacion", {
            id: model.id,
          }).then(() => {
            this.$emit("emitconsulta");
          });
        },
        () => {}
      );
    },
    formatMoney(val) {
      var formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
      return formatterPeso.format(val);
    },
    imprimirDocumento(){
      this.$emit("imprimir_documento")
    },
    async getBancosMayor() {
      await this.Get("contabilidad/ctabanco").then((resp) => {
        this.list_bancos_mayor = resp;
      });
    },
  },
};
</script>

<style lang="sass">
.my-sticky-header-table
  max-height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: white

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    &.q-table--loading thead tr:last-child th
      top: 48px
</style>
