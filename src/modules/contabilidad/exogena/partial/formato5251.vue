<template>
  <div>
     <q-tabs
        v-model="tab"
        dense align="left" 
        narrow-indicator
        class="q-mt-sm"
      >
          <q-tab :name="1" label="Movimiento Detallado" @click="armarColums(1)"/>
          <q-tab :name="2" label="Formato 5251"  @click="armarColums(2)"/>
          <q-tab :name="3" label="Parámetros" @click="armarColums(3)"/>
      </q-tabs>
      <q-space class="espacio" />
    <q-tab-panels v-model="tab" animated class="bg-white text-primary">
       <q-tab-panel :name="1" class="q-pa-none">
          <tabMovimientos :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
      <q-tab-panel :name="2" class="q-pa-none">
          <tabFormato :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
       <q-tab-panel :name="3" class="q-pa-none">
          <tabParametros :columns="columnsData" :datos="datos" :mayor="mayor" :formato="formato" :valCuantia="valCuantia" :valFactor="valFactor" @update-cuantia="updateCuantia" @update-factor="updateFactor"/>
       </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script>
import tabMovimientos from 'pages/contabilidad/exogena/partial/forms/tabMovimientos.vue'
import tabFormato from 'pages/contabilidad/exogena/partial/forms/tabFormato.vue'
import tabParametros from 'pages/contabilidad/exogena/partial/forms/tabParametros.vue'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'formato5251',
  components: {
    tabMovimientos,
    tabFormato,
    tabParametros
  },
  props: {
    columns: {
      type: Array
    },
    inAnio: {
      type: String
    },
    onClick: {
      type: Boolean
    }
  },
  data () {
    return {
      tab: 1,
      columnsData: [],
      formato: 5251,
      valCuantia: 0,
      valFactor: 0,
      mayor: [],
      datos: []
    }
  },
  computed: {},
  methods: {
    async getLoad (params) {
      await this.Get(`contabilidad/exogena/search/${5251}/${params}/${this.inAnio}`).then((resp) => {
        if (this.tab === 3) {
          this.datos = resp.data ?? []
          this.valCuantia = resp.valCuantia
          this.valFactor = resp.valFactor
        } else {
          this.datos = resp
        }
      })
    },
    updateCuantia (val) {
      this.valCuantia = val
    },
    updateFactor (val) {
      this.valFactor = val
    },
    async armarColums (params) {
      await this.getLoad(params)
      if (params === 3) {
        this.columnsData = [] 
        this.datos = [] 
      } else {
        this.columnsData = this.columns.filter((x) => x.view.includes(params) && x.form.includes(this.formato))
      }
    },
  },
  watch: {
    'onClick' () {
      this.LConfim('¿Desea exportar en formato excel?', async () => await this.PostDownload('contabilidad/exogena/exportar_excel_exogena', { datos: this.datos, encabezado: `${this.tab === 1 ? 'Movimiento Detallado 5251' : this.tab === 2 ? 'Formato 5251' : 'Parametros 5251'}` }).then((resp) =>
        fileDownload(resp, `${this.tab === 1 ? 'MovimientoDetallado5251.xlsx' : this.tab === 2 ? 'Formato5251.xlsx' : 'Parametros5251.xlsx'}`))
      )
    }
  },
  mounted () {
    this.armarColums(1, this.formato)
  }
}
</script>
