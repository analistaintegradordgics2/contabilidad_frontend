<template>
  <q-page class="q-mt-sm">
    <div flat bordered>
      <!-- Body -->
      <div class="row">
        <div class="col-10">
          <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left"
            narrow-indicator style="border-bottom: 1px solid lightgray">
            <q-tab name="cargos_masivos" dense label="Cargos Masivos" @click="onReset" />
            <q-tab name="retro_admon" dense label="Retroactivo de Administración" @click="onSearchTabRetro" />
          </q-tabs>

        </div>
        <div class="col">
          <div class="col-6 flex items-center justify-end">
            <q-chip round class="botones_acciones" size="22px">
              <q-btn
                  v-if="tab === 'retro_admon'"
                  round 
                  dense 
                  color="white" 
                  unelevated
                  class="q-mr-sm btnAcciones" 
                  @click="descargarExcel()">
                <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
                <q-tooltip>Descargar Excel</q-tooltip>
              </q-btn>
              <q-btn 
                  round 
                  dense 
                  unelevated 
                  color="white" 
                  class="q-mr-sm btnAcciones"
                  @click="tab === 'cargos_masivos' ? onSubmit() : onSubmitRetro()">
                <q-icon name="save" style="color: #42a5f5" />
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
              <q-btn 
                  round 
                  dense 
                  unelevated 
                  color="white" 
                  class="q-mr-sm btnAcciones" :to="{ name: 'home' }">
                <q-icon name="home" style="color: #42a5f5" />
                <q-tooltip>Inicio</q-tooltip>
              </q-btn>

            </q-chip>
          </div>
        </div>
      </div>

      <q-tab-panels v-model="tab" animated style="border: 0">

        <q-tab-panel name="cargos_masivos">
          <q-card-section>
            <div class="q-pa-lg" style="border: 0">
              <q-form ref="Formconsulta">
                <div class="row">
                  <div class="col-3 items-center">
                    <l-select-rest url="contabilidad/mayor/selectnew" label="Código Contable *" v-model="model.mayor_id"
                      ref="codigo" :rules="[$rules.required($t('validator.required'))]"
                      @input="searchNits(model.mayor_id)" />
                  </div>
                  <div class="col-3 items-center">
                    <l-select-rest url="contabilidad/mayor/selectnew" label="Contrapartida *"
                      v-model="model.contrapartida_id" ref="codigo"
                      :rules="[$rules.required($t('validator.required'))]" />
                  </div>
                  <div class="col-2 items-center">
                    <l-money v-model="model.valor" label="Valor *" prefijo="$ " @blur="asignarValor(model.valor)"
                      sufijo="" :rules="[
                      $rules.required($t('validator.required')),
                      (val) => val > 0 || 'Ingrese valor',
                    ]" />
                  </div>
                  <div class="col-3 row" >
                    <div class="col-6 flex items-center">
                      <l-select class="q-field--float" col="md-2 text-black" v-model="model.anio" option-value="id" option-label="nombre"
                        label="Año *" :options="anio" :rules="[$rules.required($t('validator.required'))]" />
                    </div>
          <div class="col-6 flex items-center">
            <l-date :value="fechaDisplay" label="Fecha" :disable="true" />
          <div>

                  </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 flex items-center">
                    <div class="q-pl-sm" >
                      <strong>Contabilización:</strong>
                      <q-radio val="db" label="Débito" v-model="model.tipo_conta" />
                      <q-radio val="cr" label="Crédito" v-model="model.tipo_conta" />
                    </div>
                  </div>
                  <div class="col-auto flex items-center">
                    <div class="q-pl-sm" >
                      <strong>Tipo Generación:</strong>
                      <q-radio val=1 label="Un documento por todos los nits" v-model="model.tipo_gen" />
                      <q-radio val=2 label="Un documento por cada nit" v-model="model.tipo_gen" />
                      <q-checkbox :val="true" v-model="todosInmuebles" @input="onSelectAll($event)"
                        label="Aplica para cada uno de los inmuebles" />
                    </div>
                  </div>
                </div>
                <div class="row q-mt-md">
                  <l-select
                    col="3"
                    emit-value 
                    map-options 
                    :options="conceptos" 
                    option-value="id" 
                    option-label="codigo_nombre"
                    v-model="model.concepto_id" 
                    label="Concepto *" 
                    @input="agregarDetalle(model.concepto_id)"
                    :rules="[$rules.required($t('validator.required'))]"
                  />
                  <l-input 
                    col="6"
                    label="Detalle *"
                    :rules="[$rules.required($t('validator.required'))]"
                    v-model="model.detalle"
                  />
                  <l-select-rest
                    col="3"
                    url="tercero/personas/selectnew"
                    v-model="model.persona"
                    :label="model.contrapartida_id == cta_prop_id ? 'Nit de tercero *' : 'Persona *'"
                    v-if="validatePersona"
                    :rules="[$rules.required($t('validator.required'))]"
                  />
                </div>
              </q-form>
            </div>
            <div class="row q-mt-lg" style="border: 0">
              <div class="col-12">
                <div class="col-12">
                  <div class="row justify-end">
                    <div class="q-mr-md">
                      <q-checkbox :val="true" v-model="soloNoSeleccionados"
                        @input="noSeleccionados(soloNoSeleccionados)" label="Mostrar solo los no seleccionados" />
                    </div>
                    <div class="q-mr-md">
                      <q-checkbox :val="true" @input="mostrarSoloSeleccionados(soloSeleccionados)"
                        v-model="soloSeleccionados" label="Mostrar solo los seleccionados" />
                    </div>
                    <l-input col="4" v-model="filter" style_val="padding-right: 0px;" placeholder="Búsqueda">
                      <template append>
                        <q-icon name="search" color="primary" />
                      </template>
                    </l-input>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <q-table class="my-sticky-header-table2 qtablecon" flat bordered dense virtual-scroll row-key="name"
                  :data="model.personas" :columns="columns" :filter="filter" :pagination.sync="pagination">
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th>
                        <q-checkbox v-model="seltodos" @input="seleccionartodos" />
                      </q-th>
                      <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr>
                      <q-td class="text-center">
                        <q-checkbox v-model="seleccionar" :val="props.row" />
                      </q-td>
                      <q-td auto-width>{{ props.row.documento }}</q-td>
                      <q-td class="my-table-details-nombre ">{{ props.row.n_completo }}</q-td>
                      <q-td class="my-table-details">
                        <div v-for="inm in props.row.inmueble" :key="inm">
                          <li>{{ inm }}</li>
                        </div>
                      </q-td>
                      <q-td auto-width>{{ formatMoney(props.row.valor) }}</q-td>
                      <q-td auto-width class="white-space">
                        <q-btn unelevated dense size="md" icon="mdi-home-account" @click="verInmuebles(props.row)"
                          v-if="props.row.inmuebles_asociados.length > 0">
                          <q-tooltip>Inmuebles asociados</q-tooltip>
                        </q-btn>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:no-data>
                    <div class="full-width row flex-center text-accent q-gutter-sm">
                      <div v-if="model.personas.length == 0 && spinners == false">
                        <label class="text-black">
                          <q-icon name="warning" color="red" size="24px" />
                          SIN DATOS DISPONIBLES
                        </label>
                      </div>
                      <div v-if="spinners">
                        <q-spinner color="primary" size="3em" />
                      </div>
                    </div>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel name="retro_admon">
          <q-card-section>
            <div class="flex items-center row col-12 q-mb-sm q-ml-sm q-mt-sm">
              <div class="col-3" v-show="tab !== 'cargos_masivos'">
                <q-input borderless rounded dense v-model="in_search" outlined debounce="300"
                  label="Búsqueda administración">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-1 flex items-center q-ml-sm">
                <q-btn unelevated dense round color="primary" icon="search" @click="onSearchTabRetro">
                  <q-tooltip>Buscar</q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row q-pa-lg" style="border: 0">
              <div class="col-12">
                <div class="col-12">
                  <div class="row justify-end">
                    <div class="q-mr-md">
                      <q-checkbox :val="true" v-model="soloNoSeleccionados"
                        @input="noSeleccionados(soloNoSeleccionados)" label="Mostrar solo los no seleccionados" />
                    </div>
                    <div class="q-mr-md">
                      <q-checkbox :val="true" @input="mostrarSoloSeleccionados(soloSeleccionados)"
                        v-model="soloSeleccionados" label="Mostrar solo los seleccionados" />
                    </div>
                    <l-input col="4" v-model="filter" style_val="padding-right: 0px;" placeholder="Búsqueda">
                      <template append>
                        <q-icon name="search" color="primary" />
                      </template>
                    </l-input>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <q-table class="my-sticky-header-table2 qtablecon" flat bordered dense virtual-scroll row-key="name"
                  :data="model.personas" :columns="columns_retro" :filter="filter" :pagination.sync="pagination">
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th>
                        <q-checkbox v-model="seltodos" @input="seleccionartodos" />
                      </q-th>
                      <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr>
                      <q-td class="text-center">
                        <q-checkbox v-model="seleccionar" :val="props.row" />
                      </q-td>
                      <q-td auto-width>{{ props.row.documento }}</q-td>
                      <q-td class="my-table-details-nombre ">{{ props.row.n_completo }}</q-td>
                      <q-td class="my-table-details">
                        <div v-for="inm in props.row.inmueble.filter((x) => !['', undefined, null].includes(x))"
                          :key="inm">
                          <li>{{ inm }}</li>
                        </div>
                      </q-td>
                      <q-td auto-width class="white-space">
                        <q-btn size="md" flat dense text-color="black" icon="mdi-home-account"
                          @click="openModalRetro(props.row)">
                          <q-tooltip>Inmuebles asociados</q-tooltip>
                        </q-btn>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:no-data>
                    <div class="full-width row flex-center text-accent q-gutter-sm">
                      <div v-if="model.personas.length == 0 && spinners == false">
                        <label class="text-black">
                          <q-icon name="warning" color="red" size="24px" />
                          SIN DATOS DISPONIBLES
                        </label>
                      </div>
                      <div v-if="spinners">
                        <q-spinner color="primary" size="3em" />
                      </div>
                    </div>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
      <!-- /Body -->
      <modal ref="inmueblesasociados" @pushearIds="inmoSeleccionados" />
      <modal_retro ref="modalretroactivos" @pushearIds="inmoSeleccionados" />
      <modalpago ref="modalpago" :seleccionar ="seleccionar" :in_search ="in_search"/>
    </div>
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import modal from './form/modal.vue'
import modal_retro from './form/modal_retro.vue'
import modalpago from './form/modal_pago.vue'
import Swal from "sweetalert2/src/sweetalert2.js";
import fileDownload from "js-file-download";
export default {
  layout: 'main',
  name: 'cargosMasivos',
  components: {
    modal,
    modal_retro,
    modalpago
  },
  data() {
    return {
      model: {
        anio: null,
        mayor_id: null,
        contrapartida_id: null,
        tipo_conta: null,
        tipo_gen: null,
        detalle: null,
        valor: 0,
        concepto_id: null,
        fecha: moment().format('DD-MM-YYYY'),
        persona: null,
        personas: []
      },
      in_search: '',
      tab: 'cargos_masivos',
      todosInmuebles: false,
      seltodos: false,
      spinners: false,
      soloNoSeleccionados: false,
      soloSeleccionados: false,
      filter: null,
      data: [],
      personasT: [],
      conceptos: [],
      seleccionar: [],
      columns: [
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'n_completo', align: 'left', label: 'Nombre', field: 'n_completo' },
        { name: 'inmueble', align: 'left', label: 'Inmubles', field: 'inmueble' },
        { name: 'valor', align: 'left', label: 'Valor', field: 'valor', format: (val) => this.formatMoney(val) },
        { name: "acciones", align: "center", label: "Acciones", headerClasses: "bg-primary " },
      ],
      columns_retro: [
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'n_completo', align: 'left', label: 'Nombre', field: 'n_completo' },
        { name: 'inmueble', align: 'left', label: 'Inmuebles Seleccionados', field: 'inmueble' },
        { name: "acciones", align: "center", label: "Acciones", headerClasses: "bg-primary" },
      ],
      pagination: { rowsPerPage: 0 }
    }
  },
  computed: {
    ...mapState('generales', ['anio']),
    ...mapState('parametros', ['cta_prop_id']),
    validatePersona() {
      if (this.model.tipo_gen == 1) {
        return true;
      } else if (this.model.contrapartida_id == this.cta_prop_id) {
        return true;
      } else {
        return false;
      }
    },
    fechaDisplay() {
      const raw = this.model && this.model.fecha ? this.model.fecha : null;
      if (!raw) return '';
      return moment(raw, ["DD-MM-YYYY", "DD/MM/YYYY"], true).isValid()
        ? moment(raw, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("DD/MM/YYYY")
        : raw;
    }
  },
  methods: {
    ...mapActions('generales', ['getConfAnio']),
    ...mapActions('parametros', ['getProcesos']),
    async getConceptos() {
      try {
        const data = await this.Get("contabilidad/concepto");
        this.conceptos = data;
      } catch ({ message }) { }
    },
    agregarDetalle() {
      const concepto = this.conceptos.find((x) => x.id === this.model.concepto_id)
      this.model.detalle = concepto.nombre
    },
    onSelectAll(evnt) {
      if (this.model.personas.length == 0) {
        this.LInfo('warning', 'Por favor realice una busqueda de datos primero.');
        this.todosInmuebles = false
        return
      }
      if (evnt) {
        this.model.personas.forEach((el) => {
          const dataTemp = el.inmuebles_asociados.map((x) => {
            return {
              'id': x.value,
              'label': x.label
            }
          })

          this.inmoSeleccionados(dataTemp, el.id)
        })
      } else {
        this.model.personas.forEach((el) => {
          el.inmueble_id = [el.inmuebles_asociados[0].value]
          el.inmueble = [el.inmuebles_asociados[0].label]
        })
      }
    },
    async searchNits(mayor_id) {
      this.spinners = true
      try {
        if (['', undefined, null].includes(this.model.mayor_id)) return
        const data = await this.Get(`contabilidad/cargos_masivos/${this.model.anio}/${mayor_id}`);
        this.model.personas = data;
        this.personasT = data;
        this.pagination.rowsPerPage = data.length
        this.spinners = false
      } catch ({ message }) { }
    },
    async onSearchTabRetro() {
      this.seleccionar = []
      this.spinners = true
      try {
        const search = ['', undefined, null].includes(this.in_search) ? 'all' : this.in_search.toUpperCase();
        const data = await this.Get(`contabilidad/retroactivo_admon/${search}`);
        this.model.personas = data;
        this.personasT = data;
        this.pagination.rowsPerPage = data.length
        this.spinners = false
      } catch ({ message }) { }
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
    asignarValor(val) {
      this.model.personas.forEach(element => {
        element.valor = val
      });
      this.personasT.forEach(element => {
        element.valor = val
      });
    },
    seleccionartodos() {
      if (this.seltodos == true) {
        this.seleccionar = this.model.personas;
      } else {
        this.seleccionar = [];
      }
    },
    verInmuebles(model) {
      this.$refs.inmueblesasociados.abrirModal(model);
    },
    openModalRetro(model) {
      this.$refs.modalretroactivos.abrirModal(model);
    },
    inmoSeleccionados(arraySeleccion,persona_id,dataSelect) {
      return new Promise((resolve) => {
        const findIndex = this.model.personas.findIndex((x) => x.id === persona_id);
        this.model.personas[findIndex].inmuebles_seleccionados = dataSelect;
        arraySeleccion.forEach((element) => {
          const existingIndex = this.model.personas[findIndex].inmueble_id.findIndex((a) => a == element.id);
          if (existingIndex === -1) {
            this.model.personas[findIndex].inmueble_id.push(element.id);
            this.model.personas[findIndex].inmueble.push(element.label);
          }
        });

        this.model.personas[findIndex].inmueble_id = this.model.personas[findIndex].inmueble_id.filter((a) => {
          return [...new Set(arraySeleccion.map(item => item.id))].includes(a);
        });

        this.model.personas[findIndex].inmueble = this.model.personas[findIndex].inmueble.filter((b) => {
          return [...new Set(arraySeleccion.map(item => item.label))].includes(b);
        });

        resolve();
        this.$refs.inmueblesasociados.cerrarModal()
      });
    },
    noSeleccionados(val) {
      if (val) {
        this.seleccionar.forEach((element) => {
          this.model.personas = this.model.personas.filter((x) => x.id !== element.id);
        });
      } else {
        this.model.personas = [...this.personasT];
      }
    },
    async onSubmit() {
      const validate = await this.$refs.Formconsulta.validate();
      if (validate) {
        if (['', null, undefined].includes(this.model.tipo_conta) || ['', null, undefined].includes(this.model.tipo_gen)) {
          this.LInfo('warning', 'Por favor seleccione una contabilización y/o un tipo de generación para el documento.');
          return;
        }
        if (this.seleccionar.length == 0) {
          this.LInfo('warning', 'Por favor seleccione al menos un registro.');
          return;
        } else {
          if (this.seleccionar.some((f) => f.inmueble_id == undefined || f.inmueble_id.length == 0)) {
            this.LInfo('warning', 'Por favor seleccione al menos un inmueble para cada administración seleccionada.');
            return;
          }
        }
        this.LConfim('¿Está seguro/a que desea guardar este cargue masivo?', async () => {
          await this.Post(`contabilidad/cargos_masivos/${this.model.anio}/${this.model.mayor_id}`, { model: this.model, seleccionados: this.seleccionar }).then((resp) => {
            this.LFinish(`${resp.msg}`, () => {
              this.onReset()
            });
          });
        });
      }
    },
    onSubmitRetro() {
      if (this.seleccionar.length == 0) {
        this.LInfo('warning', 'Por favor seleccione al menos un registro.');
        return;
      }

      if (this.validarInmueblesSeleccionados(this.seleccionar, this.model.personas)) {
        this.LInfo('warning', 'Es necesario seleccionar todas las administraciones que tienen inmuebles con retroactivos.');
      }
      if (this.seleccionar.some((a) => a.inmueble_id.filter((x) => !['', undefined, null].includes(x)).length == 0)) {
        this.LInfo('warning', 'No ha aplicado ningún valor retroactivo para las administraciones seleccionadas.');
        return;
      }
      let sendDetalle = null
      this.$refs.modalpago.abrirModal()
      
  
    },
    async descargarExcel() {
      const search = ['', undefined, null].includes(this.in_search) ? 'all' : this.in_search.toUpperCase();
      await this.PostDownload(
        `contabilidad/retroactivo_admon/${search}`, { payload: this.model.personas, excel: true }
      ).then((resp) => {
        fileDownload(resp, `Listado_admon_retroactivos.xlsx`);
      });
    },
    validarInmueblesSeleccionados(seleccionados, data) {
      for (let item of data) {
        let inmueblesFaltantes = item.inmueble_id.filter(id => {
          return !seleccionados.some(item => item.inmueble_id.includes(id));
        });

        if (inmueblesFaltantes.length > 0) {
          return false;
        }
      }
      return true;
    },
    onReset() {
      this.seleccionar = []
      this.todosInmuebles = false
      this.model = {
        anio: null,
        mayor_id: null,
        contrapartida_id: null,
        tipo_conta: null,
        tipo_gen: null,
        detalle: '',
        fecha: moment().format('DD-MM-YYYY'),
        persona: null,
        personas: []
      }
      this.asignarAnio();
    },
    mostrarSoloSeleccionados(val) {
      if (val) {
        this.model.personas = this.seleccionar
      } else {
        this.model.personas = this.personasT
      }
    },
    asignarAnio() {
      this.model.anio = this.anio.find(f => f.nombre == parseInt(moment().format("YYYY"))).id;
    }
  },
  async created() {
    this.getConceptos()
    this.getConfAnio().then(resp => {
      this.model.anio = this.anio.find(
        f => f.nombre == parseInt(moment().format("YYYY"))).id;
    });
    await this.getConfAnio().then(resp => {
      this.asignarAnio();
    });
    this.getProcesos("007");
  }
}
</script>
<style scoped>
div.qinputheigth,
div.divarea {
  font-size: 10px;
}

.q-table td.white-space {
  white-space: normal !important;
  text-align: justify !important;
}
</style>
<style lang="scss" scoped>
.my-table-details {
  max-width: 380px;
  font-size: 12px;
  white-space: normal;
  margin-top: 4px;
}

.my-table-details-nombre {
  font-size: 12px;
  white-space: normal;
  margin-top: 4px;
}

.q-tab-panel {
  padding: 0px !important;
}

.q-card__section--vert {
  padding: 10px;
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
