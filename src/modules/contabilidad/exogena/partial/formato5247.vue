1<template>
  <div>
     <q-tabs
        v-model="tab"
        dense align="left" 
        narrow-indicator
        class="q-mt-sm"
      >
          <q-tab :name="1" label="Movimiento Detallado" @click="armarColums(1)"/>
          <q-tab :name="2" label="Formato 5247"  @click="armarColums(2)"/>
          <q-tab :name="3" label="Cuantías Menores" @click="armarColums(3)"/>
          <q-tab :name="4" label="Parámetros" @click="armarColums(4)"/>
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
          <tabCuantias :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
       <q-tab-panel :name="4" class="q-pa-none">
          <tabParametros :columns="columnsData" :datos="datos" :mayor="mayor" :formato="formato" :valCuantia="valCuantia" @update-cuantia="updateCuantia" />
       </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script>
import tabMovimientos from '../../exogena/partial/forms/tabMovimientos.vue'
import tabFormato from '../../exogena/partial/forms/tabFormato.vue'
import tabCuantias from '../../exogena/partial/forms/tabCuantias.vue'
import tabParametros from '../../exogena/partial/forms/tabParametros.vue'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'formato5247',
  components: {
    tabMovimientos,
    tabFormato,
    tabCuantias,
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
      formato: 5247,
      valCuantia: 0,
      mayor: [],
      datos: []
    }
  },
  computed: {},
  methods: {
    async getLoad (params) {
      await this.Get(`contabilidad/exogena/search/${5247}/${params}/${this.inAnio}`).then((resp) => {
        if (this.tab === 4) {
          this.datos = resp.data ?? []
          this.valCuantia = resp.valCuantia
        } else {
          this.datos = resp
        }
      })
    },
    async armarColums (params) {
      await this.getLoad(params)
      if (params === 4) {
        this.columnsData = [] 
        this.datos = [] 
      } else {
        this.columnsData = this.columns.filter((x) => x.view.includes(params) && x.form.includes(this.formato))
      }
    },
    async getMayor () {
      try {
        this.mayor = await this.Get('contabilidad/mayor')
      } catch ({ message }) {}
    },
    updateDetail (id, index) {
      this.datos.data[index].detalle = this.mayor.find((x) => x.id === id).codigo_nombre.split('-')[1]
    },
    updateCuantia (val) {
      this.valCuantia = val
    }
  },
  watch: {
    'onClick' () {
      this.LConfim('¿Desea exportar en formato excel?', async () => await this.PostDownload('contabilidad/exogena/exportar_excel_exogena', { datos: this.datos, encabezado: `${this.tab === 1 ? 'Movimiento Detallado 5247' : this.tab === 2 ? 'Formato 5247' : this.tab === 3 ? 'Cuantías Menores 5247' : 'Parametros 5247'}` }).then((resp) =>
        fileDownload(resp, `${this.tab === 1 ? 'MovimientoDetallado5247.xlsx' : this.tab === 2 ? 'Formato5247.xlsx' : this.tab === 3 ? 'CuantíasMenores5247.xlsx' : 'Parametros5247.xlsx'}`))
      )
    }
  },
  mounted () {
    this.armarColums(1, this.formato)
  }
}
</script>
