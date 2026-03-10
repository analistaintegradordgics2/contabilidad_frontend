<template>
  <div>
     <q-tabs
        v-model="tab"
        dense align="left" 
        narrow-indicator
        class="q-mt-sm"
      >
          <q-tab :name="1" label="Movimiento Detallado" @click="armarColums(1)"/>
          <q-tab :name="2" label="Formato 5249"  @click="armarColums(2)"/>
      </q-tabs>
      <q-space class="espacio" />
    <q-tab-panels v-model="tab" animated class="bg-white text-primary">
       <q-tab-panel :name="1" class="q-pa-none">
          <tabMovimientos :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
      <q-tab-panel :name="2" class="q-pa-none">
          <tabFormato :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script>
import tabMovimientos from '../../exogena/partial/forms/tabMovimientos.vue'
import tabFormato from '../../exogena/partial/forms/tabFormato.vue'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'formato5249',
  components: {
    tabMovimientos,
    tabFormato
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
      formato: 5249,
      datos: []
    }
  },
  computed: {},
  methods: {
    async getLoad (params) {
      await this.Get(`contabilidad/exogena/search/${5249}/${params}/${this.inAnio}`).then((resp) => {
        this.datos = resp ?? []
      })
    },
    async armarColums (params) {
      this.columnsData = this.columns.filter((x) => x.view.includes(params) && x.form.includes(this.formato))
      await this.getLoad(params)
      if (params === 3) await this.getMayor()
    }
  },
  watch: {
    'onClick' () {
      this.LConfim('¿Desea exportar en formato excel?', async () => await this.PostDownload('contabilidad/exogena/exportar_excel_exogena', { datos: this.datos, encabezado: `${this.tab === 1 ? 'Movimiento Detallado 5249' : this.tab === 2 ? 'Formato 5249' : 'Parametros 5249'}` }).then((resp) =>
        fileDownload(resp, `${this.tab === 1 ? 'MovimientoDetallado5249.xlsx' : this.tab === 2 ? 'Formato5249.xlsx' : 'Parametros5249.xlsx'}`))
      )
    }
  },
  mounted () {
    this.armarColums(1, this.formato)
  }
}
</script>
