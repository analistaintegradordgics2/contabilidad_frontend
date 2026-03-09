<template>
  <div>
     <q-tabs
        v-model="tab"
        dense align="left" 
        class="q-mt-sm"
        narrow-indicator
      >
          <q-tab :name="1" label="Movimiento Detallado" @click="armarColums(1)"/>
          <q-tab :name="2" label="Formato 1008"  @click="armarColums(2)"/>
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
          <tabParametros :columns="columnsData" :datos="datos" :mayor="mayor" :formato="formato" :valCuantia="valCuantia" @update-detail="updateDetail" @update-cuantia="updateCuantia" @delete-params="deleteParams" @add-params="onAddParams"/>
       </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script>
import tabMovimientos from 'pages/contabilidad/exogena/partial/forms/tabMovimientos.vue'
import tabFormato from 'pages/contabilidad/exogena/partial/forms/tabFormato.vue'
import tabCuantias from 'pages/contabilidad/exogena/partial/forms/tabCuantias.vue'
import tabParametros from 'pages/contabilidad/exogena/partial/forms/tabParametros.vue'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'formato1008',
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
      formato: 1008,
      valCuantia: 0,
      mayor: [],
      datos: []
    }
  },
  computed: {},
  methods: {
    async getLoad (params) {
      await this.Get(`contabilidad/exogena/search/${1008}/${params}/${this.inAnio}`).then((resp) => {
        if (this.tab === 4) {
          this.datos = resp.data
          this.valCuantia = resp.valCuantia
        } else {
          this.datos = resp ?? []
        }
      })
    },
    async armarColums (params) {
      this.columnsData = this.columns.filter((x) => x.view.includes(params) && x.form.includes(this.formato))
      await this.getLoad(params)
      if (params === 4) await this.getMayor()
    },
    async getMayor () {
      try {
        this.mayor = await this.Get('contabilidad/mayor')
      } catch ({ message }) {}
    },
    updateDetail (id, index) {
      this.datos.data[index].detalle = this.mayor.find((x) => x.id === id).codigo_nombre.split('-')[1]
    },
    onAddParams (param) {
      param.idformato = 8
      this.datos.push(param)
    },
    updateCuantia (val) {
      this.valCuantia = val
    },
    async deleteParams (seleccionados) {
      await this.Post(`contabilidad/exogena/deleteParams`, {model: seleccionados}).then((response) => {
        if (response.status === 200) {
          seleccionados.forEach(element => {
            const index = this.datos.findIndex((x) => x.id === element)
            this.datos.splice(index,1)
          });
          this.LFinish(response.msg,() => {});
        }
      })
    }
  },
  watch: {
    'onClick' () {
      this.LConfim('¿Desea exportar en formato excel?', async () => await this.PostDownload('contabilidad/exogena/exportar_excel_exogena', { datos: this.datos, encabezado: `${this.tab === 1 ? 'Movimiento Detallado 1008' : this.tab === 2 ? 'Formato 1008' : this.tab === 3 ? 'Cuantías Menores 1008' : 'Parametros 1008'}` }).then((resp) =>
        fileDownload(resp, `${this.tab === 1 ? 'MovimientoDetallado1008.xlsx' : this.tab === 2 ? 'Formato1008.xlsx' : this.tab === 3 ? 'CuantíasMenores1008.xlsx' : 'Parametros1008.xlsx'}`))
      )
    }
  },
  mounted () {
    this.armarColums(1, this.formato)
  }
}
</script>
