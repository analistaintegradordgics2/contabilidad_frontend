<template>
  <q-page class="q-ma-lg q-ml-xl">
    <l-newmodal ref="modal" width="1400px" max_height="1200" titulo="Inconsistencias Medios Distritales" height="80vh" :validar_salir="false" :footer="true">
      <template slot="body">
          <div class="">
            <q-tabs
              v-model="tab"
              dense align="left" 
              narrow-indicator
            >
                <q-tab :name="1" label="Nits"/>
                <q-tab :name="2" label="Direcciones y/o ciudades" />
                <q-tab :name="3" label="Teléfonos" />
            </q-tabs>
            <q-separator />
            <div class="row flex ">
              <q-input
                class="col-4 q-pt-md q-px-md"
                dense
                rounded
                outlined
                v-model="filter"
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              
            </div>
            <q-tab-panels v-model="tab" animated >
               <q-tab-panel :name="1">
                  <q-table
                    flat
                    bordered
                    dense
                    row-key="name"
                    :data="value.filter((x) => x.inconsistencia && x.inconsistencia.length > 0 && x.inconsistencia.some((item) => ['1','1,2,3'].includes(item)))"
                    :columns="columns"
                    :filter="filter"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th>
                          <q-checkbox v-model="seltodos" @input="selectAll($event)"/>
                        </q-th>
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr>
                        <q-td auto-width class="text-center">
                          <q-checkbox v-model="seleccionar" :val="props.row" />
                        </q-td>
                        <q-td auto-width>{{ props.row.documento }}</q-td>
                        <q-td auto-width>{{ props.row.nit_sugerido }}</q-td>
                        <q-td style="white-space: normal">
                          <div style="width: 300px">
                            {{ props.row.n_completo }}
                          </div>
                        </q-td>
                        <q-td auto-width>{{ props.row.descripcion }}</q-td>
                        <q-td auto-width>{{ props.row.ciudad }}</q-td>
                        <q-td auto-width>{{ props.row.telefono }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
               </q-tab-panel>
              <q-tab-panel :name="2">
                <q-table
                    flat
                    bordered
                    dense
                    row-key="name"
                    :data="value.filter((x) => x.inconsistencia && x.inconsistencia.length > 0 && x.inconsistencia.some((item) => ['2','1,2,3'].includes(item)))"
                    :columns="columnsDirections"
                    :filter="filter"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination"
                  >
                    <template v-slot:body="props">
                      <q-tr>
                        <q-td auto-width>{{ props.row.documento }}</q-td>
                        <q-td auto-width>{{ props.row.n_completo }}</q-td>
                        <q-td auto-width>{{ props.row.descripcion }}</q-td>
                        <q-td auto-width>{{ props.row.ciudad }}</q-td>
                        <q-td auto-width>{{ props.row.telefono }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
               </q-tab-panel>
               <q-tab-panel :name="3">
                <q-table
                    flat
                    bordered
                    dense
                    row-key="name"
                    :data="value.filter((x) => x.inconsistencia && x.inconsistencia.length > 0 && x.inconsistencia.some((item) => ['3','1,2,3'].includes(item)))"
                    :columns="columnsTelefonos"
                    :filter="filter"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination"
                  >
                    <template v-slot:body="props">
                      <q-tr>
                        <q-td auto-width>{{ props.row.documento }}</q-td>
                        <q-td auto-width>{{ props.row.n_completo }}</q-td>
                        <q-td auto-width>{{ props.row.descripcion }}</q-td>
                        <q-td auto-width>{{ props.row.ciudad }}</q-td>
                        <q-td auto-width>{{ props.row.telefono }}</q-td>
                      </q-tr>
                    </template>
                  </q-table>
               </q-tab-panel>
            </q-tab-panels>
          </div>
      </template>
      <template slot="footer">
        <div class="row justify-center ">
          <div class="col-2 q-pr-sm">
            <q-btn dense  color="green" label="Generar Excel" class="full-width btnGuardar"  @click="generarExcel()">
              <q-tooltip>Generar Excel Inconsistencias</q-tooltip>
            </q-btn>
          </div>  
          <div class="col-2 q-pr-sm">
            <q-btn dense color="amber" label="Actualizar" class="full-width btnGuardar" @click="getLoad()">
              <q-tooltip>Actualizar</q-tooltip>
            </q-btn>
          </div>
          <div class="col-2" v-if="tab===1">
            <q-btn dense color="grey" label="Reparar nits" class="full-width btnGuardar"  @click="onRepair()">
              <q-tooltip>Reparar nits</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </l-newmodal>
  </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'inconsistenciasMediosDistritales',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showBtnInconsistencias: false,
      filter: '',
      tab: 1,
      seleccionar: [],
      seltodos: false,
      pagination: {
        rowsPerPage: 50
      },
      columns: [
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'nit_sugerido', label: 'Nit sugerido', align: 'left', field: 'nit_sugerido' },
        { name: 'n_completo', label: 'Nombre Completo', align: 'left', field: 'n_completo',headerStyle: "white-space: normal; width: 200px; text-align:left;", },
        { name: 'descripcion', label: 'Dirección', align: 'left', field: 'descripcion' },
        { name: 'ciudad', label: 'ciudad', align: 'left', field: 'ciudad' },
        { name: 'telefono', label: 'Telefono', align: 'left', field: 'telefono' },
      ],
      columnsDirections: [
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'n_completo', label: 'Nombre Completo', align: 'left', field: 'n_completo' },
        { name: 'descripcion', label: 'Dirección', align: 'left', field: 'descripcion' },
        { name: 'ciudad', label: 'ciudad', align: 'left', field: 'ciudad' },
        { name: 'telefono', label: 'Telefono', align: 'left', field: 'telefono' },
      ],
      columnsTelefonos: [
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'n_completo', label: 'Nombre Completo', align: 'left', field: 'n_completo' },
        { name: 'descripcion', label: 'Dirección', align: 'left', field: 'descripcion' },
        { name: 'ciudad', label: 'ciudad', align: 'left', field: 'ciudad' },
        { name: 'telefono', label: 'Telefono', align: 'left', field: 'telefono' },
      ],
    }
  },
  computed: {
    ...mapState('generales', ['anio'])
  },
  methods: {
    ...mapActions('generales', ['getConfAnio']),
    openModal () {
      this.$refs.modal.open()
    },
    getLoad () {
      this.$emit('reload')
    },
    onRepair () {
      if (this.seleccionar.length === 0) {
        this.LInfo('warning', 'Debe seleccionar al menos un registro')
        return
      }
      // se utiliza el mismo endpoint de exogena, porque se requiere lo mismo. 
      this.LConfim(`¿Desea realizar la corrección de NITS para los ${this.seleccionar.length} registros selecccionados?`, async () => {
        const params = this.seleccionar
        await this.Post('contabilidad/exogena/repairNits', params).then((response) => {
          if (response.status === 200) {
            this.LFinish(response.msg, () => {})
          } else {
            this.LInfo('warning', response.msg)
          }
          this.getLoad()
          this.seleccionar = []
        })
      })
    },
    async generarExcel () {
      const arrayTemp = this.value.filter((x) => x.inconsistencia && x.inconsistencia.length > 0 &&
        x.inconsistencia.some(item => this.tab === 1 ? ['1', '1,2,3'].includes(item) : this.tab === 2 ? ['2', '1,2,3'].includes(item) : ['3'].includes(item)))
      const tittle = this.tab === 1 ? 'Listado de NITS inconsistencias Medios distritales' : this.tab === 2 ? 'Listado de direcciones y/o ciudades inconsistencias Medios distritales' : 'Listado de telefonos Inconsistencias Medios distritales'
      await this.PostDownload('contabilidad/medios_distritales/downloadExcel', { model: arrayTemp, tittle: tittle }).then((resp) => {
        fileDownload(resp, 'inconsistencias-medios-distritales.xlsx')
      })
    },
    selectAll (evnt) {
      if (evnt) {
        this.seleccionar = this.value
      } else {
        this.seleccionar = []
      }
    }
  },
  async created () {
  }
}
</script>
<style lang="scss">
.listbtnacciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>
