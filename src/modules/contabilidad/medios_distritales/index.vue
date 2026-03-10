<template>
  <q-page class="q-ma-lg q-ml-lg">
    <q-page flat>
      <div class="row">
        <div class="col-9">
          <q-form class="row" ref="formconsulta">
            <div>
              <l-select
                class="q-field--float"
                col="md-2 text-black"
                v-model="model.anio"
                option-value="nombre"
                option-label="nombre"
                label="Año *"
                :options="anio"
                :rules="[$rules.required($t('validator.required'))]"
              />
            </div>
          </q-form>
        </div>
        <div class="col-3 flex justify-end">
          <q-chip class="botones_acciones listbtnacciones q-ma-none" size="22px">
            <div class="row">
              <q-btn
                round
                dense
                unelevated
                color="white"
                text-color="red"
                class="btnAcciones"
                v-if="showBtnInconsistencias"
                @click="abrirModal"
              >
                <q-icon name="info" style="color: #42a5f5" />
                <q-tooltip>Inconsistencias</q-tooltip>
              </q-btn>
              <q-btn round dense unelevated class="btnAcciones q-ml-sm" color="white" @click="exportar_art(tab)" :disable="tab==1">
                <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
                <q-tooltip>Exportar excel</q-tooltip>
              </q-btn>
              <q-btn round dense unelevated class="btnAcciones q-ml-sm" color="white" @click="generar_plano(tab)" :disable="tab==1">
                <q-icon name="mdi-file-download-outline" style="color: #42a5f5" />
                <q-tooltip>Generar Plano</q-tooltip>
              </q-btn>
              <can permiso="view_menu_medios_distritales_acciones_generar_articulo">
                <q-btn round dense unelevated class="btnAcciones q-ml-sm" color="white" @click="get_articulos(tab)" :disable="tab==1">
                  <q-icon name="search" style="color: #42a5f5" />
                  <q-tooltip>Generar artículo</q-tooltip>
                </q-btn>
              </can>
            </div>
          </q-chip>
        </div>
      </div>

      <q-tabs
        v-model="tab"
        dense
        align="left"
        narrow-indicator
        style="border-bottom: 1px solid lightgray"
      >
        <q-tab :name="1" label="Parámetros" />
        <q-tab :name="2" label="Artículo 2" />
        <q-tab :name="4" label="Artículo 4" />
        <q-tab :name="6" label="Artículo 6" />
        <!-- <q-tab :name="10" label="Artículo 10" /> -->
        <q-tab :name="12" label="Artículo 12" />
      </q-tabs>
      <q-space class="espacio" />

      <q-tab-panels v-model="tab" animated class="bg-white text-primary">
        <q-tab-panel :name="1" class="q-pa-none">
          <div class="row col-12 q-pt-md q-mr-sm justify-end">
              <div class="q-mr-sm">
                <q-btn
                  unelevated
                  round
                  dense
                  color="primary"
                  @click="editarParametros"
                  class="q-mb-md q-ml-ms"
                  v-if="!habilitarEditar"
                  >
                  <q-icon name="mdi-pencil" color="white" />
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
              </div>           
            <div class="q-mr-sm">
              <q-btn
                unelevated
                round
                dense
                color="amber"
                @click="guardarParametro"
                class="q-mb-md"
                v-if="habilitarEditar"
              >
                <q-icon name="mdi-content-save" color="white" />
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-btn
                unelevated
                round
                dense
                icon="add"
                class="bg-blue-4 btn_caso"
                color=" primary"
                size="md"
                @click="AddRow($event)"
                v-if="habilitarEditar"
              >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"
                  >Crear parámetro</q-tooltip
                >
              </q-btn>
            </div>
          </div>
          <q-form ref="resgistroParametro">

          <q-table
            class="q-mt-md"
            flat
            bordered
            dense
            row-key="name"
            :data="data"
            :columns="columnsParams"
            :filter="filter"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
          >
            <!-- <template v-slot:header="props">
              <q-tr :props="props">
                <q-th>
                  <q-checkbox v-model="seltodos" @input="selectAll($event)" />
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                  col.label
                }}</q-th>
              </q-tr>
            </template> -->
            <template v-slot:body="props">
              <q-tr>
                <!-- <q-td auto-width class="text-center">
                  <q-checkbox v-model="seleccionar" :val="props.row" />
                </q-td> -->
                <q-td key="articulo" :props="props" style="width: 10%">
                  <!-- <div class="row" style="width: 150px"> -->
                  <l-select
                    class="q-mt-md"
                    v-model="props.row.articulo"
                    option-value="id"
                    option-label="nombre"
                    label="Artículo"
                    :options="articulos"
                    @input="onChange($event,props.rowIndex)"
                    :rules="[$rules.required($t('validator.required'))]"
                    :disable="editParam"
                  />
                  <!-- </div> -->
                </q-td>
                <q-td key="cuenta" :props="props" style="width: 30%">
                  <!-- <div class="row" style="width: 250px"> -->
                  <l-select-rest
                    col="12 q-mt-sm"
                    url="contabilidad/contabilizacion/cuentas/selectnew"
                    v-model="props.row.cuenta"
                    :clearable="false"
                    :rules="[$rules.required($t('validator.required'))]"
                    :disable="editParam"
                  />
                  <!-- :class_input="`evitclick ${estado ? 'text-weight-bold text-black' : ''}`" -->
                  <!-- </div> -->

                  <!-- {{ props.row.cuenta }} -->
                </q-td>
                <q-td key="naturaleza" :props="props" style="width: 30%">
                  <!-- <div class="row" style="width: 150px"> -->
                  <l-select
                    class="q-mt-md"
                    v-model="props.row.naturaleza"
                    option-value="id"
                    option-label="nombre"
                    label="naturaleza"
                    :options="naturaleza"
                    :rules="[$rules.required($t('validator.required'))]"
                    :disable="editParam"
                  />
                  <!-- </div> -->
                  <!-- {{ props.row.naturaleza }} -->
                </q-td>
                <q-td key="concepto_pago" :props="props" style="width: 30%">
                  <!-- <div class="row" style="width: 350px"> -->
                  <l-select
                    class="q-mt-md"
                    v-model="props.row.concepto_pago"
                    option-value="id"
                    option-label="nombre"
                    label="Concepto"
                    :options="props.row.conceptos_pagos"
                    :rules="[props.row.articulo == 1 ? $rules.required($t('validator.required')) : null]"
                    :disable="editParam"
                  />
                </q-td>
                <q-td auto-width class="text-center">
                    <q-checkbox v-model="props.row.devolucion" :val="props.row" :disable="editParam"/>
                </q-td>
                <q-td
                  key="acciones"
                  class="text-center"
                  :props="props"
                  style="width: 10%"
                >
                  <q-btn
                    class="q-mr-sm"
                    dense
                    unelevated
                    icon="delete"
                    @click="DeleteRow(props.rowIndex)"
                    v-if="data.length > 1"
                    :disable="editParam"
                  >
                    <q-tooltip>Quitar</q-tooltip>
                  </q-btn>
                  <q-btn
                    class="q-mr-sm"
                    dense
                    unelevated
                    icon="add"
                    @click="AddRow($event, props.rowIndex)"
                    v-if="data.length - 1 == props.rowIndex"
                    :disable="editParam"
                  >
                    <q-tooltip>Agregar</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-form>

        </q-tab-panel>
        <q-tab-panel :name="2" class="q-pa-none">
          
          <articulo2 :value="data_articulo" />
        </q-tab-panel>
        <q-tab-panel :name="4" class="q-pa-none">
          <articulo4 :value="data_articulo"/>
        </q-tab-panel>
        <q-tab-panel :name="6" class="q-pa-none">
          <articulo6 :value="data_articulo"/>
        </q-tab-panel>
        <!-- <q-tab-panel :name="10" class="q-pa-none">
          <articulo10 :value="data_articulo"/>
        </q-tab-panel> -->
        <q-tab-panel :name="12" class="q-pa-none">
          <articulo12 :value="data_articulo"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
    <inconsistencias ref="refinconsistencias" :value="inconsistencias" @reload="getLoadInconsistencias"/>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import fileDownload from "js-file-download";
import articulo2 from "./partial/articulo2.vue";
import articulo4 from "./partial/articulo4.vue";
import articulo6 from "./partial/articulo6.vue";
// import articulo10 from "./partial/articulo10.vue";
import articulo12 from "./partial/articulo12.vue";
import inconsistencias from '../medios_distritales/partial/inconsistencias/index.vue'

export default {
  layout: "main",
  name: "medios",
  components: {
    articulo2,
    articulo4,
    articulo6,
    // articulo10,
    articulo12,
    inconsistencias,
  },
  data() {
    return {
      tab: 2,
      filter: "",
      ver: false,
      showBtnInconsistencias: false,
      inconsistencias: [],
      data: [],
      habilitarEditar: false,
      editParam: true,
      articulos: [
        { id: 2, nombre: "2" },
        { id: 4, nombre: "4" },
        { id: 6, nombre: "6" },
        // { id: 10, nombre: "10" },
        { id: 12, nombre: "12" },
      ],
      naturaleza: [
        { id: 1, nombre: "DEBITO" },
        { id: 2, nombre: "CREDITO" },
      ],
      concepto_pago_temp: [],
      concepto_pago: [
        // { id: 1, nombre: "INGRESOS POR VENTAS DE SERVICIOS" },
        // { id: 2, nombre: "INGRESOS POR VENTAS DE ACTIVOS MOVILES" },
        // { id: 3, nombre: "INGRESOS POR VENTA DE ACTIVOS FIJOS" },
        // { id: 4, nombre: "INGRESOS POR RECAUDOS" },
        // { id: 5, nombre: "OTROS" },
      ],
      model: {
        anio: moment().format("YYYY"),
      },
      columnsParams: [
        { name: "articulo", label: "Artículo", align: "left", field: "articulo" },
        { name: "cuenta", label: "Cuenta", align: "left", field: "cuenta" },
        { name: "naturaleza", label: "Naturaleza", align: "left", field: "naturaleza" },
        {
          name: "concepto_pago",
          label: "Concepto Pago",
          align: "left",
          field: "concepto_pago",
        },
        { name: "devolucion", label: "Devolución", align: "left", field: "devolucion" },
        { name: "acciones", label: "acciones", align: "left", field: "devolucion" },
      ],
      pagination: {
        rowsPerPage: 50,
      },
      data_articulo: [],
      data_articulo2: [],
      data_articulo4: [],
      data_articulo6: [],
      data_articulo10: [],
      data_articulo12: [],
      parametros: [
        {
          articulo: null,
        },
      ],
    };
  },
  watch: {
    tab(newval, oldval) {
     this.data_articulo = []
     if (oldval == 1 && this.habilitarEditar) {
      this.LInfo("warning", "Por favor, guarde los parámetros")
      this.tab=1
     }
    }
  },
  computed: {
    ...mapState("generales", ["anio"]),
  },
  methods: {
    ...mapActions("generales", ["getConfAnio"]),
    AddRow(event, index) {
      if (event.keyCode == 45 || event.type == "click") {
        this.data.push({
          id: null,
          articulo: null,
          cuenta: null,
          naturaleza: null,
          concepto_pago: null,
          devolucion: false,
        });
      } else if (event.keyCode == 46) {
        this.DeleteRow(index);
      }
    },
    DeleteRow(index) {
      this.data.splice(index, 1);
    },
    async get_articulos() {
      if (this.inconsistencias.length == 0) {
        const validate = await this.$refs.formconsulta.validate();
        if (validate) {
          // let parametros = this.data.filter(param => param.articulo == this.tab )
          if (this.data.some(art => art.articulo === this.tab)) {
            let params= {
              anio:this.model.anio,
              articulo: this.tab
            }
            await this.Post('contabilidad/medios_distritales/get_articulos', params).then((resp) => {
              this.data_articulo = resp
            })
          } else {
            this.LInfo("warning", "No hay parámetros para este artículo")
          }
        }
      } else {
        this.LInfo("warning", "por favor validar las inconsistencias, para poder generar la consulta")
      }
    },
    async guardarParametro() {
      const validate = await this.$refs.resgistroParametro.validate();
      if (validate) {
      this.LConfim('¿Desea guardar estos parámetros?', async () => {
          try {
            
        const resp = await this.Post('contabilidad/medios_distritales/guardar_parametros', { params: this.data })
          if (resp.success) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: `${resp.success}`,
              confirmButtonColor: '#42a5f5',
              confirmButtonText: 'Aceptar'
            })
          }
            this.getParametrosMedios()
            this.habilitarEditar = false
            this.editParam = true
            this.LInfo("succes", "Parámetros guardados exitosamente.")

        } catch (error) {
          console.error('Error en la petición:', error)
        }
      })
    }
    },
    async getParametrosMedios() {
     await this.Get('contabilidad/medios_distritales/get_parametros_medios').then((resp) => {
      this.data = resp
     })

    },

    async getConceptoPagos() {
     await this.Get('contabilidad/medios_distritales/get_concepto_pagos').then((resp) => {
      this.concepto_pago = resp
     })

    },
    async onChange(event, index) {
      this.data[index].concepto_pago = null
      this.data[index].conceptos_pagos = this.concepto_pago.filter((x) => x.articulo == event)
    },
    async exportar_art(tab) {
      if(this.data_articulo.length == 0) {
        this.LInfo("warning", "No hay información para exportar.")
        return
      }
      let params = {}
      switch (tab) {
        case 2:
          params.nombre = 'artículo2'
          break;
        case 4:
          params.nombre = 'artículo4'
          break
        case 6:
          params.nombre = 'artículo6'
          break
        case 12:
          params.nombre = 'artículo12'
          break
        default:
          break;
      }
      params.model = this.armarDatos(tab)
    await this.PostDownload("contabilidad/medios_distritales/exportar_art", params).then((resp) => {
        fileDownload(resp, `artículo-${tab}.xlsx`);
      });
    },
    async generar_plano(tipo) {
      if(this.data_articulo.length == 0) {
        this.LInfo("warning", "No hay información para generar el archivo plano.")
        return
      }
      await this.PostDownload("contabilidad/medios_distritales/generar_plano", {
        model: this.armarDatos(tipo),
      }).then((resp) => {
        fileDownload(resp, `plano_medios_distritales - articulo${tipo}.txt`);
      });
    },
    armarDatos (tipo) {
      if (tipo == 2) {
        return this.data_articulo.map((x) => {
          return {
            "Vigencia": x.vigencia ?? '',
            "Tipo Doc": x.tipo_doc ?? '',
            "Documento": x.documento ?? '',
            "Nombre Completo": x.n_completo ?? '',
            "Dirección": x.direccion ?? '',
            "Télefono": x.telefono ?? '',
            "Email": x.email ?? '',
            "Cod. Ciudad": x.codigo_municipio ?? '',
            "Cod. Depto": x.codigo_dpto ?? '',
            "Concepto": x.concepto_pago ?? '',
            "Compras": parseFloat(x.Valor_bruto) || 0, 
            "Devoluciones": parseFloat(x.valor_total) || 0
          };
        });
      }
      else if (tipo == 4) {
        return this.data_articulo.map((x) => {
          return {
            "Vigencia": x.vigencia ?? '',
            "Tipo Doc": x.tipo_doc ?? '',
            "Documento": x.documento ?? '',
            "Nombre Completo": x.n_completo ?? '',
            "Dirección": x.direccion ?? '',
            "Télefono": x.telefono ?? '',
            "Email": x.email ?? '',
            "Cod. Ciudad": x.codigo_municipio ?? '',
            "Cod. Depto": x.codigo_dpto ?? '',
            "Base Ret.": x.base_retencion ?? '',
            "% Tarifa Ret.": parseFloat(x.tarifa_aplicada)|| 0,
            "Retención": parseFloat(x.valor_total) || 0
          };
        });
      }else if (tipo == 6) {
        return this.data_articulo.map((x) => {
          return {
            "Vigencia": x.vigencia ?? '',
            "Tipo Doc": x.tipo_doc ?? '',
            "Documento": x.documento ?? '',
            "Razon Social": x.n_completo ?? '',
            "Dirección": x.direccion ?? '',
            "Télefono": x.telefono ?? '',
            "Email": x.email ?? '',
            "Cod. Ciudad": x.codigo_municipio ?? '',
            "Cod. Depto": x.codigo_dpto ?? '',
            "Monto del Pago": x.Valor_bruto ?? '',
            "% Tarifa Apl.": parseFloat(x.tarifa_aplicada)|| 0,
            "Retención": parseFloat(x.valor_total) || 0
          };
        });
      }else if (tipo == 12) {
        return this.data_articulo.map((x) => {
          return {
            "Vigencia": x.vigencia ?? '',
            "Tipo Doc": x.tipo_doc ?? '',
            "Documento": x.documento ?? '',
            "Propietario": x.n_completo ?? '',
            "Dir. inmueble": x.direccion ?? '',
            "Valor Bruto": x.telefono ?? '',
            "Dir. Notificación": x.direccion ?? '',
            "Cod. Ciudad": x.codigo_municipio ?? '',
            "Cod. Depto": x.codigo_dpto ?? '',
            "Email": x.email ?? '',
            "Télefono": x.telefono ?? ''
          };
        });
      } else {
        return []
      }
    },
    async getLoadInconsistencias () {
      await this.Get('contabilidad/medios_distritales/searchInconsistencias').then((resp) => {
        if (resp.length > 0) {
          this.inconsistencias = resp
          this.showBtnInconsistencias = true
        }
      })
    },
    abrirModal () {
      this.$refs.refinconsistencias.openModal(this.inconsistencias)
    },
    editarParametros() {
      this.habilitarEditar = true
      this.editParam = false
    },
  },
  created() {
    this.getConfAnio().then((resp) => {
      this.model.anio = this.anio.find(
        (f) => f.nombre === parseInt(moment().format("YYYY"))
      ).nombre;
    });
    this.getParametrosMedios()
    this.getLoadInconsistencias()
    this.getConceptoPagos()
  },
};
</script>

<style lang="scss">
.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0% 0%
    no-repeat padding-box !important;
}
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
</style>
